@AGENTS.md

# DevFlow — project rules

Next.js (App Router) + Tailwind v4. A Q&A platform for developers: ask, answer,
vote, collect, browse jobs.

## How this project is built

The author writes plain semantic HTML first. Styling is a **separate, later** pass,
and it follows `STYLING.md` — not your own judgement about what looks good.
Component extraction is a third pass, after that.

When asked to style markup:

1. Read `STYLING.md`. It is short and it is binding.
2. Match each block against the recognition table. Use the matched recipe **verbatim**.
3. If a block matches no row: **say so and ask.** Do not improvise a recipe.
4. Report back which rows you used, and anything you had to ask about.

## Hard constraints

- **Tokens only.** Every colour through a `--color-*` theme token. No hex, no `rgb()`,
  no `bg-red-500`. Violating this silently breaks dark mode.
- **Classes only.** No new CSS file. No `style` attribute. The one exception is the
  `@layer base` block already in `globals.css`.
- **Never restyle what the base layer covers.** Adding `text-xl` to an `h2` is a bug.
  Bare `h1`–`h4`, `p`, `label`, `input`, `ul`, `table`, `a`, `code` are already correct.
- **Keep the author's markup shape.** Add classes and grouping wrappers. Do not
  rewrite semantic HTML into divs, and do not reorder content.
- **Both themes.** Check the `.dark` class on `<html>` before you call it done.
- **New pattern → `STYLING.md` first, then use it.** A recipe that exists in one file
  and not in the doc will diverge the second time someone needs it.

## Fonts

Switzer (UI) and Inter (fallback), both self-hosted from `/public/fonts`. Never add a
`<link>` to fontshare or Google Fonts — no external font requests in this project.

## Icons

- **UI icons** — `@phosphor-icons/react`, regular weight. The design library is
  Phosphor-named, so names map 1:1 (`House`, `Star`, `SuitcaseSimple`, `ArrowFatUp`).
- **Technology logos** — `devicon` (`devicon-<name>-plain colored`). Original brand
  colours, never recoloured to the accent.
- Never draw an icon as inline SVG paths when one of those two covers it.

## Accent

`--color-accent` is red-500. The **Sheen gradient** (`--accent-grad`, red-500 → red-600
at 145°) is reserved for exactly two things: the single highest-priority button on a
screen, and the logo tile. Everything else accented stays flat — nav, chips, badges,
text, icons. If two gradients appear on one screen, one of them is wrong.

## Layout

App shell is three siblings: left nav (`w-[266px]`, sticky, full height, own scroll),
`main` (`flex-1 min-w-0`), right panel (`w-[350px]`, sticky, hidden below `xl`).
Below `md` the left nav becomes a bottom bar. Neither side column scrolls with the page.

# Zasada zakresu

Wykonuj tylko to, o co prosi użytkownik — nic ponad to. Jeśli polecenie wymaga dodatkowych działań (nowe pliki, zależności, refaktory, testy, konfiguracja), najpierw zapytaj o zgodę i zrób to dopiero po jej uzyskaniu. Żadnych własnych dodatków poza absolutnym minimum wymaganym do realizacji polecenia.

Przy pisaniu kodu zawsze trzymaj się skilla `ponytail` — najprostsze rozwiązanie, które działa, nic ponad to.

# Komentarze w kodzie

Gdy użytkownik o to poprosi, dodawaj prosty komentarz wyjaśniający działanie komponentu / funkcji / strony — po co powstał i co robi, tak żeby użytkownik rozumiał sens kodu. Bez pytania nie dodawaj komentarzy.
