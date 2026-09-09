// Wypelnia baze DevFlow danymi demonstracyjnymi: uzytkownicy, pytania, odpowiedzi, glosy,
// kolekcje i interakcje. Server actions wymagaja sesji NextAuth i kontekstu requestu, wiec nie
// da sie ich odpalic ze skryptu - zamiast tego odtwarzamy dokladnie te same zapisy, ktore robia
// createQuestion / createAnswer / createVote / toggleSaveQuestion, razem z ich zdenormalizowanymi
// licznikami i punktacja reputacji.
//
//   npm run seed            pelny przebieg (najpierw czysci poprzedni seed)
//   npm run seed -- --reset tylko czyszczenie
//
// Kazdy wstawiony dokument ma pole `seeded: true`, wiec czyszczenie nigdy nie rusza prawdziwych
// danych. Wyjatkiem sa tagi - sa wspoldzielone z realnymi pytaniami, wiec zamiast kasowac je po
// znaczniku, przeliczamy ich licznik z faktycznej liczby wierszy TagQuestion.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { INTERACTIONS_POINTS } from "../constants/interactions.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "scripts/seed/data");
const AVATARS = path.join(ROOT, "public/avatars");

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();

// Deterministyczny RNG - ten sam seed daje ta sama baze, wiec przebieg mozna powtorzyc
// i porownac liczby zamiast zgadywac, co sie zmienilo.
let rngState = 20260909;
const rand = () => {
  rngState |= 0;
  rngState = (rngState + 0x6d2b79f5) | 0;
  let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const randInt = (min, max) => min + Math.floor(rand() * (max - min + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
// Fisher-Yates na kopii. Sortowanie losowym komparatorem tez by "dzialalo", ale zostawia
// wyrazny slad kolejnosci wejsciowej - przy 200 pytaniach to znaczy, ze te same pytania
// wpadalyby do kolekcji i glosow czesciej niz reszta.
const sample = (arr, n) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
};
// Losowanie ze skosem w dol: wykladnik > 1 sprawia, ze duze wartosci sa rzadkie.
const skewed = (max, exponent) => Math.floor(rand() ** exponent * max);

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
const oid = () => new mongoose.Types.ObjectId();

const collections = {};
const bind = (db) => {
  for (const name of [
    "users",
    "questions",
    "answers",
    "tags",
    "tagquestions",
    "votes",
    "collections",
    "interactions",
  ]) {
    collections[name] = db.collection(name);
  }
};

// --- czyszczenie ------------------------------------------------------------

const reset = async () => {
  const seededQuestions = await collections.questions.find({ seeded: true }, { projection: { _id: 1 } }).toArray();
  await collections.tagquestions.deleteMany({ question: { $in: seededQuestions.map((q) => q._id) } });

  for (const name of ["users", "questions", "answers", "votes", "collections", "interactions"]) {
    await collections[name].deleteMany({ seeded: true });
  }

  // Licznik na tagu jest zdenormalizowany, wiec po usunieciu pytan trzeba go odbudowac
  // z prawdy, czyli z tabeli laczacej. Tagi, ktore zostaly bez zadnego pytania, znikaja.
  const counts = await collections.tagquestions.aggregate([{ $group: { _id: "$tag", n: { $sum: 1 } } }]).toArray();
  const byTag = new Map(counts.map((c) => [c._id.toString(), c.n]));
  const tags = await collections.tags.find({}, { projection: { _id: 1 } }).toArray();

  const ops = tags.map((t) => {
    const n = byTag.get(t._id.toString()) ?? 0;
    return n === 0
      ? { deleteOne: { filter: { _id: t._id } } }
      : { updateOne: { filter: { _id: t._id }, update: { $set: { questions: n } } } };
  });
  if (ops.length) await collections.tags.bulkWrite(ops);

  console.log(`reset: usunieto ${seededQuestions.length} pytan i powiazane dokumenty`);
};

// --- avatary ----------------------------------------------------------------

const writeAvatars = (users) => {
  fs.mkdirSync(AVATARS, { recursive: true });
  let created = 0;
  for (const user of users) {
    const file = path.join(AVATARS, `${user.username}.svg`);
    if (fs.existsSync(file)) continue;
    const svg = createAvatar(notionists, {
      seed: user.username,
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf", "transparent"],
      radius: 50,
    }).toString();
    fs.writeFileSync(file, svg);
    created += 1;
  }
  console.log(`avatary: ${created} nowych, ${users.length - created} juz bylo`);
};

// --- seed -------------------------------------------------------------------

const seed = async () => {
  const rawUsers = readJson("users.json");
  const rawQuestions = [1, 2, 3, 4].flatMap((n) => readJson(`questions-${n}.json`));
  const rawAnswers = [1, 2, 3, 4].flatMap((n) => readJson(`answers-${n}.json`));

  writeAvatars(rawUsers);

  // 1. uzytkownicy
  const users = rawUsers.map((u) => ({
    _id: oid(),
    ...u,
    image: `/avatars/${u.username}.svg`,
    reputation: 0,
    seeded: true,
    createdAt: new Date(NOW - randInt(200, 420) * DAY),
    updatedAt: new Date(NOW),
    __v: 0,
  }));
  await collections.users.insertMany(users);

  // Kilku "power userow" pisze wiecej niz reszta - inaczej ranking w /community
  // i badge z constants/badges.ts nigdy nie rozjezdzaja sie na tyle, zeby cos pokazac.
  const weightedAuthors = users.flatMap((u, i) => Array(i < 5 ? 5 : i < 12 ? 3 : 1).fill(u));

  // 2. tagi - ten sam upsert co w createQuestion, wiec dolaczamy sie do juz istniejacych
  const tagNames = [...new Set(rawQuestions.flatMap((q) => q.tags))];
  const tagIds = new Map();
  for (const name of tagNames) {
    const res = await collections.tags.findOneAndUpdate(
      { name },
      { $setOnInsert: { name, questions: 0, createdAt: new Date(NOW), updatedAt: new Date(NOW), __v: 0 } },
      { upsert: true, returnDocument: "after" }
    );
    tagIds.set(name, res._id);
  }

  // 3. pytania - daty gestsze przy dzisiaj, wyswietlenia mocno skosne
  const questions = [];
  const tagQuestions = [];
  const tagBumps = new Map();

  for (const q of rawQuestions) {
    const createdAt = new Date(NOW - (rand() ** 1.7 * 360 + 1) * DAY);
    const _id = oid();
    const ids = q.tags.map((t) => tagIds.get(t));

    questions.push({
      _id,
      ref: q.id,
      author: pick(weightedAuthors)._id,
      title: q.title,
      content: q.content,
      tags: ids,
      views: 30 + skewed(9000, 3),
      answers: 0,
      upvotes: 0,
      downvotes: 0,
      createdAt,
      updatedAt: createdAt,
      seeded: true,
      __v: 0,
    });

    for (const tagId of ids) {
      tagQuestions.push({ _id: oid(), question: _id, tag: tagId, createdAt, updatedAt: createdAt, __v: 0 });
      tagBumps.set(tagId.toString(), (tagBumps.get(tagId.toString()) ?? 0) + 1);
    }
  }

  const byRef = new Map(questions.map((q) => [q.ref, q]));

  // 4. odpowiedzi - autor nigdy nie odpowiada na wlasne pytanie, data zawsze po pytaniu
  const answers = [];
  for (const a of rawAnswers) {
    const question = byRef.get(a.questionRef);
    if (!question) {
      console.warn(`pomijam odpowiedz do nieznanego pytania: ${a.questionRef}`);
      continue;
    }
    const candidates = users.filter((u) => !u._id.equals(question.author));
    const created = question.createdAt.getTime() + randInt(1, 72) * 60 * 60 * 1000 + rand() * 30 * DAY;

    answers.push({
      _id: oid(),
      author: pick(candidates)._id,
      question: question._id,
      content: a.content,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(Math.min(created, NOW)),
      updatedAt: new Date(Math.min(created, NOW)),
      seeded: true,
      __v: 0,
    });
    question.answers += 1;
  }

  // 5. glosy - unikalny indeks {author, id, type} pilnuje jednego glosu na target,
  // wiec glosujacych losujemy bez powtorzen. 85% to upvote, jak w prawdziwym ruchu.
  const votes = [];
  const voteOn = (target, type, maxVoters) => {
    const candidates = users.filter((u) => !u._id.equals(target.author));
    const voters = sample(candidates, skewed(maxVoters + 1, 1.6));

    for (const voter of voters) {
      const voteType = rand() < 0.85 ? "upvote" : "downvote";
      const created = new Date(Math.min(target.createdAt.getTime() + rand() * 40 * DAY, NOW));
      votes.push({
        _id: oid(),
        author: voter._id,
        id: target._id,
        type,
        voteType,
        createdAt: created,
        updatedAt: created,
        seeded: true,
        __v: 0,
      });
      target[voteType === "upvote" ? "upvotes" : "downvotes"] += 1;
    }
  };

  for (const q of questions) voteOn(q, "question", 18);
  for (const a of answers) voteOn(a, "answer", 12);

  // 6. kolekcje - kazdy zapisuje cudze pytania, unikalny indeks {author, question}
  const saves = [];
  for (const user of users) {
    const own = questions.filter((q) => !q.author.equals(user._id));
    const chosen = sample(own, randInt(4, 14));
    for (const q of chosen) {
      const created = new Date(Math.min(q.createdAt.getTime() + rand() * 60 * DAY, NOW));
      saves.push({
        _id: oid(),
        author: user._id,
        question: q._id,
        createdAt: created,
        updatedAt: created,
        seeded: true,
        __v: 0,
      });
    }
  }

  // 7. interakcje + reputacja. Punktacja jest importowana z constants/interactions.ts,
  // wiec skrypt nie moze rozjechac sie z tym, co nalicza createInteraction.
  const reputation = new Map(users.map((u) => [u._id.toString(), 0]));
  const interactions = [];

  const record = (userId, action, actionId, actionType, authorId, createdAt) => {
    interactions.push({
      _id: oid(),
      user: userId,
      action,
      actionId,
      actionType,
      createdAt,
      updatedAt: createdAt,
      seeded: true,
      __v: 0,
    });

    const points = INTERACTIONS_POINTS[action];
    if (!points) return; // view i edit nie sa punktowane
    reputation.set(userId.toString(), (reputation.get(userId.toString()) ?? 0) + points.user);
    // Autor nie dostaje punktow za wlasna akcje - dokladnie jak w createInteraction.
    if (authorId && !authorId.equals(userId)) {
      reputation.set(authorId.toString(), (reputation.get(authorId.toString()) ?? 0) + points.author);
    }
  };

  const questionById = new Map(questions.map((q) => [q._id.toString(), q]));
  const answerById = new Map(answers.map((a) => [a._id.toString(), a]));

  for (const q of questions) record(q.author, "question_post", q._id, "question", null, q.createdAt);
  for (const a of answers) {
    const q = questionById.get(a.question.toString());
    record(a.author, "answer_post", a._id, "answer", q.author, a.createdAt);
  }
  for (const v of votes) {
    const target = v.type === "question" ? questionById.get(v.id.toString()) : answerById.get(v.id.toString());
    record(v.author, `${v.voteType}_add`, v.id, v.type, target.author, v.createdAt);
  }
  for (const s of saves) {
    const q = questionById.get(s.question.toString());
    record(s.author, "bookmark_add", s.question, "question", q.author, s.createdAt);
  }

  // Odslony: kazdy uzytkownik oglada garsc pytan. Bez punktow, ale to jedyne zrodlo
  // sygnalu dla filtra "recommended", ktory czyta ostatnie interakcje uzytkownika.
  for (const user of users) {
    const seen = sample(questions, randInt(20, 40));
    for (const q of seen) {
      record(user._id, "view", q._id, "question", null, new Date(Math.min(q.createdAt.getTime() + rand() * 90 * DAY, NOW)));
    }
  }

  // 8. zapis
  await collections.questions.insertMany(questions.map(({ ref, ...doc }) => doc));
  await collections.tagquestions.insertMany(tagQuestions);
  await collections.answers.insertMany(answers);
  await collections.votes.insertMany(votes);
  await collections.collections.insertMany(saves);
  await collections.interactions.insertMany(interactions);

  await collections.tags.bulkWrite(
    [...tagBumps].map(([id, n]) => ({
      updateOne: { filter: { _id: new mongoose.Types.ObjectId(id) }, update: { $inc: { questions: n } } },
    }))
  );

  await collections.users.bulkWrite(
    [...reputation].map(([id, points]) => ({
      updateOne: { filter: { _id: new mongoose.Types.ObjectId(id) }, update: { $set: { reputation: points } } },
    }))
  );

  return { users, questions, answers, votes, saves, interactions };
};

// --- raport -----------------------------------------------------------------

const report = async (result) => {
  const counts = {};
  for (const name of Object.keys(collections)) counts[name] = await collections[name].countDocuments();
  console.log("\nkolekcje (cala baza, razem z danymi sprzed seeda):");
  console.table(counts);

  const withoutAnswers = result.questions.filter((q) => q.answers === 0).length;
  console.log(
    `\npytania: ${result.questions.length}, odpowiedzi: ${result.answers.length}, ` +
      `bez odpowiedzi: ${withoutAnswers} (${Math.round((withoutAnswers / result.questions.length) * 100)}%)`
  );
  console.log(`glosy: ${result.votes.length}, kolekcje: ${result.saves.length}, interakcje: ${result.interactions.length}`);

  const topTags = await collections.tags.find({}).sort({ questions: -1 }).limit(6).toArray();
  console.log("\ntop 6 tagow:", topTags.map((t) => `${t.name} (${t.questions})`).join(", "));

  const topUsers = await collections.users.find({ seeded: true }).sort({ reputation: -1 }).limit(5).toArray();
  console.log("top 5 reputacji:", topUsers.map((u) => `${u.username} (${u.reputation})`).join(", "));
};

// --- main -------------------------------------------------------------------

const main = async () => {
  if (!process.env.MONGODB_URI) throw new Error("Brak MONGODB_URI - uruchom przez `npm run seed`");

  await mongoose.connect(process.env.MONGODB_URI, { dbName: "DevFlow" });
  bind(mongoose.connection.db);

  await reset();

  if (!process.argv.includes("--reset")) {
    const result = await seed();
    await report(result);
  }

  await mongoose.disconnect();
};

await main();
