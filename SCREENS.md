# SCREENS.md — per-screen layout & component spec

Ground truth for verifying a built screen against the design. Each screen row
lists **every region and component that must be present**, in order, with the
values that make it correct — not just its name. Built from the real
`.dc.html` previews (`HomePage`, `Collections`, `Tags`, `UsersRow`, `JobPost`,
`QuestionNAnswers`, `AskAQuestion(2)`, `Profile(2)`, `Blogs`, `GlobalSearch`,
`EmptyState`, `ErrorState`, `MobileNav`, plus the seven auth screens) — not
invented.

Almost every in-shell screen below is **one shared shell** with a different
content block swapped in. Get the shell right once; each screen then only
needs its own content block checked.

---

## 0 · The App Shell — present on every in-shell screen

    header    sticky top:0, h-64px, flex row, border-bottom border-secondary, bg-primary
              ├─ logo      30×30 rounded-9 bg-accent-grad, wordmark "Dev" + accent "Flow" (17px/600, hidden <360px)
              ├─ search    flex-1 max-w-830px centered, h-48 rounded-10 bg-secondary,
              │            Search icon 20px + input "Search anything globally" (hidden <768px → icon button instead)
              └─ actions   theme toggle (34×34 icon button) + avatar button (34×34 circle, bordered)

    left nav  sticky top:65px, height:100dvh-65px, bg-primary, border-right border-secondary
              width 266px ≥1280px, 72px below (icon-only, no labels)
              items: Home · Collections · Find Jobs · Tags · Communities · Ask a Question
              active item: solid accent-color fill, white text, 600 weight; inactive: transparent, text-secondary 500
              Logout pinned to bottom via flex-1 spacer, same treatment
              hidden below 768px — replaced by the bottom tab bar

    main      flex-1, centered, max-width scales 1100→1400→1600 by breakpoint
              content column (flex-1) + right aside (330px, only on wide ≥1440 screens
              that are NOT blogs/profile/search — see NO_RIGHT below)

    page header (shared by all list-kind screens: Home/Collections/Tags/Users/Jobs/Blogs)
              h1 (pageTitle) + primary CTA button top-right (only when the screen has one)
              local search bar below (h-56 rounded-12 bordered) — Blogs additionally
              has a "Most Popular ▾" sort button beside its search bar
              filter chip row below that (h-42 rounded-8, active = accent-soft fill)

    right aside (330px, sticky, border-left) — "Hot Network" (5 linked questions,
              22×22 "?" mark bordered in accent/blue alternating) + "Popular Tags"
              (8 rows, devicon logo + name + count, tabular-nums)

    bottom nav (mobile <768px only) — 5 of the 6 rail items, icon 21px + 10.5px label,
              active = accent text/icon

Screens outside this shell (auth, MobileNav mockup) are noted separately.

---

## 1 · In-shell screens — content block per kind

| Screen                  | Route                         | Content block                                                                                                                                                                                                                                                                          |
| ----------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                    | `/`                           | **questions list**: h1 "All Questions" + CTA "Ask a Question", filters [Newest, Recommended, Frequent, Unanswered], question card list (see §2)                                                                                                                                        |
| Collections             | `/collections`                | Same shell/kind as Home — h1 "Saved Questions", filters [Most Recent, Oldest, Most Voted, Most Viewed, Most Answered], each card gets a "saved 3 days ago" stamp above the title                                                                                                       |
| Tags                    | `/tags`                       | **tag grid**: h1 "Tags", no CTA, filters [Popular, Recent, Name, Old], `grid auto-fill minmax(260px,1fr)` of tag cards (see §2)                                                                                                                                                        |
| Users (Communities)     | `/community`                  | **user grid**: h1 "All Users", no CTA, filters [New Users, Old Users, Top Contributors], `grid auto-fill minmax(240px,1fr)` of user cards (see §2)                                                                                                                                     |
| Find Jobs               | `/jobs`                       | **job list**: h1 "Jobs", no CTA, filters [Remote, Full Time, Contract, Senior+], stacked job cards (see §2)                                                                                                                                                                            |
| Question & Answers      | `/question/[id]`              | **detail view**: no page header — author row + vote strip, h1 question title, meta row (asked/votes/answers/views), body paragraphs + code block, tag row, "N Answers" + sort button, answer list, "Write your answer" editor + Submit — see §3                                        |
| Ask a Question          | `/ask`                        | **form view**: no page header — Title field, rich-text body field (editor toolbar + textarea), Tags field, submit button bottom-right — see §3                                                                                                                                         |
| Ask a Question — filled | `/ask` (state)                | Same form, all three fields pre-filled + 3 removable tag chips already added                                                                                                                                                                                                           |
| Profile                 | `/profile/[id]`               | **profile view**: avatar (180px desktop/110px mobile) + name/handle/edit-row + bio, Stats grid (Questions/Answers cell + 3 badge cells), two-column body: tab strip (Top Posts/Answers) + question list + Load More button, Top Tags side column — see §3. No page header, no filters. |
| Profile — own           | `/profile`                    | Identical, plus an "Edit Profile" button next to the name                                                                                                                                                                                                                              |
| Blogs                   | `/blogs`                      | **blogs view**: page header has search+sort row but no filter chips; hero article (image + title + excerpt + author) then a 2-up grid of post cards (image, title + arrow icon, excerpt, author row) — see §3. **No right aside** on this screen.                                      |
| Global Search           | overlay on Home               | Header search field becomes a dropdown panel: "Type:" pill row (Question/Answer/Users/Tags, active = solid accent) + "Top Match" result list (tag icon + title + kind label in info-color)                                                                                             |
| Empty state             | any list, no results          | Centered block (illustration 269×200 flat-color mock, not real asset) + h2 + body + one CTA button — see §3                                                                                                                                                                            |
| Error state             | any list, load failure        | Same centered block, illustration swapped for `<ErrorIllustration>` (a real `.jsx` import, not the flat mock), h2 "Oops! Something Went Wrong" + body + "Go back" button                                                                                                               |
| Mobile nav              | below `md`, standalone mockup | Phone-frame (390×780, rounded-38, shadowed) showing the Home screen behind a right-side drawer: dark scrim + drawer panel (304px) with logo, X close, 3 nav items, Login (soft-accent) + Signup (outline) buttons pinned to drawer bottom                                              |

**`NO_RIGHT` screens (never get the right aside):** blogs, profile, search.

---

## 2 · List-item components (reused across Home/Collections/Tags/Users/Jobs)

    question card   flex column gap-24, p-[36px 45px] (mobile 24px 20px), rounded-14,
                     bg-primary border-secondary, shadow (0 2px 4px + 0 12px 20px @2-3% black),
                     hover: border → accent
                     ├─ optional "saved N ago" stamp (Collections only)
                     ├─ h2 title (20px/600)
                     ├─ tag row (uppercase 10px pills, bg-tertiary)
                     └─ footer: avatar 20px + author + "• time"  ⟷  Votes/Answers/Views (icon+count, 12px)

    tag card         flex column gap-14, p-[28px 24px], rounded-14, same border/shadow
                     ├─ name pill (uppercase 12px, bg-tertiary, self-start)
                     ├─ blurb (13px, 3-line clamp)
                     └─ "<count> Questions" (count in accent, bold)

    user card        flex column centered gap-16, p-[32px 24px], same border/shadow
                     ├─ avatar 100px circle
                     ├─ name (18px/600) + "@handle" (13px, tertiary)
                     └─ tag pill row (3, centered, wrap)

    job card         flex row gap-24, p-[36px 45px], same border/shadow
                     ├─ mark tile 64×64 rounded-14, initials, tinted bg/fg per company
                     ├─ body: role (18px/600) + "Full Time" success pill,
                     │        blurb (2-line clamp), meta row (posted/pay/place, icon+12px)
                     └─ "View job" button (soft-accent, arrow-up-right icon), right-aligned

---

## 3 · Screen-specific blocks

**Question detail** (Question & Answers, and Home/etc. when a card is opened):

    author row    avatar 24px + name, right: vote counter (▲12 ▼-4, tabular pills) + save-star icon
    title         h1, 24-26px/600
    meta row      Asked Nd ago (accent clock) · Votes · Answers · Views — icon+13px each
    body          3 paragraphs (15px/24px, text-secondary) + one dark code block (slate-950 bg)
    tag row       4 uppercase pills, bg-black-solid/slate-400 (darker treatment than list-card tags)
    answers head  h2 "N Answers" (accent) ⟷ "Highest Upvotes ▾" sort button
    answer item   author row (22px avatar, accent name, "• answered <time>") + vote pills,
                  body paragraph, code block (bg-secondary, lighter than the question's)
    reply box     "Write your answer here" + "Generate an AI Answer" button (outlined, accent text)
                  → toolbar (9 icon buttons) + textarea (min-h 180px) → "Submit Answer" (flat accent, right-aligned)

**Ask a Question form** (no page header, no right aside):

    field         label (15px/600) + required "*" in accent
    title field   single-line input, h-56 rounded-8
    body field    bordered wrapper: toolbar (9 icons, bg-secondary) + textarea min-h 230px
    tags field    single-line input h-56 + (filled state) removable pill row below with X icons
    submit        "Ask a Question" button, Sheen gradient, right-aligned, h-46

**Profile:**

    header row    avatar (180/110px circle) + name h1 + "@handle", edit button (own profile only,
                  bg-tertiary flat, top-right) + link/location/joined-date row + bio paragraph
    stats         h2 "Stats" + grid auto-fit minmax(210px,1fr): one Questions/Answers split cell
                  + 3 badge cells (Gold/Silver/Bronze, medal icon in tinted circle)
    body row      tab strip (Top Posts/Answers, pill-segmented bg-tertiary) + question cards
                  (rounded-10 variant, no tag-row emphasis change) + centered "Load More" (Sheen)
                  — Top Tags column (330px) alongside, same list treatment as the right aside

**Blogs:**

    hero article  image (16:10, rounded-16) + title (24px) + excerpt + author row (44px avatar,
                  name in accent, date)
    post grid     2-up (auto-fit minmax(280px,1fr)), each: image (16:10) + title+arrow-icon row
                  + excerpt (14px) + author row (40px avatar)

**Empty / Error state:**

    illustration  ~270×200, centered — Empty uses a flat 3-card mock (no real asset);
                  Error uses the `<ErrorIllustration>` component (`./components/devoverflow/error-illustration.jsx`)
    heading       h2, 24px/700
    body          14px, max-width 381px, centered
    cta           one Sheen button, margin-top 16px — "Ask a Question" (empty) / "Go back" (error)

---

## 4 · Auth screens — standalone, no shell

Full recipes live in `handoff/STYLING.md` §3 and `handoff/COMPONENTS.md`
(`AuthCard`, `AuthField`, OAuth row, `WelcomeCard`). Quick map:

| Screen           | Route                   | Shell used                                                    |
| ---------------- | ----------------------- | ------------------------------------------------------------- |
| Welcome          | `/welcome`              | `WelcomeCard` — dark, centered, 3 circular OAuth icon buttons |
| Sign in          | `/sign-in`              | `AuthCard` + 2 `AuthField` + primary button + OAuth row       |
| Sign up          | `/sign-up`              | `AuthCard` + 3 `AuthField` + primary button + OAuth row       |
| Forgot password  | `/forgot-password`      | `AuthCard` + 1 `AuthField` + primary button                   |
| Check your email | `/forgot-password/sent` | `AuthCard`, no fields (confirmation only)                     |
| Set new password | `/reset-password`       | `AuthCard` + 2 `AuthField` + primary button                   |
| Account exists   | `/sign-up/exists`       | `AuthCard`, no fields (confirmation only)                     |

---

## Notes

- **Blogs, Profile, Global Search never get the right aside** — everything else
  on a wide (≥1440px) viewport does.
- **Question & Answers, Ask a Question, Profile, Blogs, Global Search** all
  suppress the page-header CTA/local-search/filter row — each draws its own
  head area instead (see §3).
- **Ask a Question** and **Ask a Question — filled** are one screen, two states
  (empty vs pre-filled + tags) — not two routes.
- **Profile** and **Profile — own** differ only by the Edit Profile button.
- Dark mode is a `.dark` class on the root, not a separate screen — verify
  every block above in both.
- Mobile (<768px) drops the left rail for a bottom tab bar and collapses the
  header search into an icon button — `MobileNav.dc.html` is the reference
  for the drawer variant of that same collapse.
