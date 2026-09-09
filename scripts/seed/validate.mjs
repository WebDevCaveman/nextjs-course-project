// Sprawdza pliki z trescia zanim trafia do bazy: limity ze schematow (tytul 100 znakow,
// max 3 tagi po 15 znakow, odpowiedz min 100 znakow), unikalnosc id, jezyki blokow kodu
// i to, czy kazda odpowiedz wskazuje na istniejace pytanie.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
const LANGS = ["javascript", "typescript", "xml", "css", "json", "python", "sql", "bash"];
const problems = [];
const ids = new Set();
let questions = 0;
let answers = 0;

for (const n of [1, 2, 3, 4]) {
  const file = path.join(DATA, `questions-${n}.json`);
  if (!fs.existsSync(file)) continue;
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  questions += list.length;
  if (list.length !== 50) problems.push(`questions-${n}: ${list.length} pytan zamiast 50`);

  for (const q of list) {
    const at = `questions-${n} ${q.id}`;
    if (ids.has(q.id)) problems.push(`${at}: zduplikowane id`);
    ids.add(q.id);
    if (q.title.length < 5 || q.title.length > 100) problems.push(`${at}: tytul ${q.title.length} znakow`);
    if (!q.content?.trim()) problems.push(`${at}: pusta tresc`);
    if (!q.tags?.length || q.tags.length > 3) problems.push(`${at}: ${q.tags?.length} tagow`);
    for (const t of q.tags ?? []) {
      if (t.length > 15) problems.push(`${at}: tag "${t}" ma ${t.length} znakow`);
      if (t !== t.toLowerCase()) problems.push(`${at}: tag "${t}" nie jest lowercase`);
    }
    for (const [, lang] of q.content.matchAll(/```([a-zA-Z0-9+#-]+)/g)) {
      if (!LANGS.includes(lang)) problems.push(`${at}: blok kodu w jezyku "${lang}"`);
    }
  }
}

for (const n of [1, 2, 3, 4]) {
  const file = path.join(DATA, `answers-${n}.json`);
  if (!fs.existsSync(file)) continue;
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  answers += list.length;

  for (const [i, a] of list.entries()) {
    const at = `answers-${n}[${i}] -> ${a.questionRef}`;
    if (!ids.has(a.questionRef)) problems.push(`${at}: nie ma takiego pytania`);
    if ((a.content ?? "").length < 100) problems.push(`${at}: tresc ${(a.content ?? "").length} znakow, minimum 100`);
    for (const [, lang] of (a.content ?? "").matchAll(/```([a-zA-Z0-9+#-]+)/g)) {
      if (!LANGS.includes(lang)) problems.push(`${at}: blok kodu w jezyku "${lang}"`);
    }
  }
}

console.log(`pytania: ${questions}, odpowiedzi: ${answers}, problemy: ${problems.length}`);
for (const p of problems) console.log("  " + p);
process.exit(problems.length ? 1 : 0);
