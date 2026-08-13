@AGENTS.md

# DevFlow — project rules

Next.js (App Router) + Tailwind v4 + shadcn/ui. A Q&A platform for developers: ask,
answer, vote, collect, browse jobs.

## How this project is built

The author writes plain semantic HTML first. Styling is a **separate, later** pass,
and it follows `STYLING.md` — not your own judgement about what looks good.
Component extraction is a third pass, after that, and it lands in shadcn components.

When asked to style markup:

1. Read `STYLING.md`. It is short and it is binding.
2. Match each block against the recognition table. Use the matched recipe **verbatim**.
3. If a block matches no row: **say so and ask.** Do not improvise a recipe.
4. Report back which rows you used, and anything you had to ask about.

When asked to extract a component:

1. Read `COMPONENTS.md`. Check the shadcn column first — `Button`, `Input`, `Badge`,
   `Textarea`, `Select`, `Avatar`, `Tabs`, `DropdownMenu`, `Dialog`, `Sheet`, `Tooltip`,
   `Separator`, `Skeleton` are shadcn primitives with variant props already wired to
   our tokens — never rebuild what shadcn already gives you.
2. `QuestionCard`, `TagCard`, `UserCard`, `JobCard`, `Tag`, `VoteControl`, `AppShell`,
   `RichTextEditor` have no shadcn equivalent — build them as local components in
   `components/devflow/`, composed from shadcn primitives where they overlap
   (e.g. `JobCard`'s apply button IS `<Button variant="soft" size="sm">`).
3. Never introduce a new variant. If a shadcn variant doesn't exist yet for what
   you need, add it to the component's own variants object — do not inline override
   classes at the call site.

## Hard constraints

- **Tokens only.** Every colour through a shadcn CSS variable (`--primary`,
  `--background`, `--muted`…) or a `--color-*` theme alias. No hex, no `rgb()`,
  no `bg-red-500`. Violating this silently breaks dark mode.
- **shadcn components are not restyled.** Don't add `className` overrides that fight
  a shadcn component's own variants — add the variant.
- **Classes only.** No new CSS file. No `style` attribute. The one exception is the
  `@layer base` block already in `globals.css`.
- **Never restyle what the base layer covers.** Adding `text-xl` to an `h2` is a bug.
  Bare `h1`–`h4`, `p`, `label`, `a`, `code` are already correct. `input`/`textarea`/
  `select` are shadcn components now, not bare tags — see STYLING.md.
- **Keep the author's markup shape.** Add classes and grouping wrappers. Do not
  rewrite semantic HTML into divs, and do not reorder content.
- **Both themes.** Check the `.dark` class on `<html>` before you call it done.
- **New pattern → `STYLING.md` first, then use it.** A recipe that exists in one file
  and not in the doc will diverge the second time someone needs it.

## Fonts

Switzer (UI) and Inter (fallback), both self-hosted from `/public/fonts`. Never add a
`<link>` to fontshare or Google Fonts — no external font requests in this project.

## Type scale — why shadcn components render at OUR sizes, not their own

`--text-sm`/`--text-base`/etc. are redefined in `globals.css`'s `@theme inline` block
(12.5px / 14px, not Tailwind's stock 14px / 16px). Because shadcn components are
copied into this repo as plain source (`components/ui/*.tsx`), Tailwind compiles
their `text-sm`/`text-base` classes against OUR redefined values — same as any other
file in the project. There is nothing to patch for this: a shadcn component that
writes `text-sm` in its source already renders at 12.5px here, automatically. Don't
"fix" a shadcn component's type size unless a screen shows it genuinely wrong —
that's a sign of a font-weight/line-height issue, not the scale.

**A colour token must never be named after a step of the type scale.** `text-*`
resolves against the colour palette first, so a `--color-base` next to `--text-base`
makes `text-base` compile to a _colour_ — the size silently stops applying and the
text picks up whatever `--color-base` holds. We hit exactly this: `--color-base`
mapped to `--bg-primary`, so `Button variant="soft"` painted its label in the panel's
own background (contrast 1.00, invisible), `<p>` rendered at 16px instead of 14px and
`<h4>` disappeared in dark mode. The token is gone — that surface is `bg-background`
now. Never add `--color-2xs/xs/sm/base/md/lg/xl/2xl/3xl/4xl`; name surfaces after what
they are (`--color-subtle`, `--color-muted`), never after a size.

## Icons

- **UI icons** — Huge Icons (outline), 1349 icons vendored in
  `components/devflow/icons/huge/`. Read `ICONS.md` before using them. Server
  Components render `<HugeIcon name="category/icon" size={n} />`; `"use client"`
  components render `<HugeIconSvg icon={uiIcons.x} size={n} />` from
  `huge/data/ui.ts` — importing a whole `data/<category>` module into the client
  ships up to 336 KB for one glyph. No `strokeWidth`: these are filled outlines.
- **Icon names lie.** The hamburger is `menu/menu-user`, `arrows/direction-right`
  is a chevron pointing _down_. Render a candidate before you commit to it.
- **Technology logos** — `devicon` (`devicon-<name>-plain colored`). Unchanged.
  Original brand colours, never recoloured to the accent. Not part of the icon
  set — devicons are for tag/stack logos only, never for UI icons.
- **`lucide-react` is imported nowhere** but stays in `package.json` until the end
  of the project: a component added by the shadcn CLI arrives with Lucide imports,
  and those get swapped for this set before it lands.
- Never draw a UI icon as inline SVG paths — the set covers it.

## Accent — where the red lands

shadcn's own `--accent` variable is a **neutral hover surface** (dropdown/select/menu
item hover) — a naming collision with nothing to do with brand colour. It maps to
`--bg-tertiary`, grey, never red. The brand red lives in `--color-primary` (shadcn
contract — Button `default`, focus rings) and `--color-accent-solid` (our own
utilities — links, `text-accent-solid`). Both resolve to `--red-500`; neither is
`--accent`. See `COMPONENTS.md` §0 for the full shape→component→variant mapping.

The **Sheen gradient** (`--accent-grad`, red-500 → red-600 at 145°) is reserved for
exactly two things: the single highest-priority button on a screen
(`Button variant="cta"`), and the logo tile. Everything else accented stays flat —
nav, chips, badges, text, icons, and definitely shadcn's neutral `--accent` hovers.
If two gradients appear on one screen, one of them is wrong.

## Layout

App shell is three siblings: left nav (`w-[266px]`, sticky, full height, own scroll),
`main` (`flex-1 min-w-0`), right panel (`w-[350px]`, sticky, hidden below `xl`).
Below `md` the left nav becomes a bottom bar. Neither side column scrolls with the page.

# Zasada zakresu

Wykonuj tylko to, o co prosi użytkownik — nic ponad to. Jeśli polecenie wymaga dodatkowych działań (nowe pliki, zależności, refaktory, testy, konfiguracja), najpierw zapytaj o zgodę i zrób to dopiero po jej uzyskaniu. Żadnych własnych dodatków poza absolutnym minimum wymaganym do realizacji polecenia.

Przy pisaniu kodu zawsze trzymaj się skilla `ponytail` — najprostsze rozwiązanie, które działa, nic ponad to.

# Komentarze w kodzie

Gdy użytkownik o to poprosi, dodawaj prosty komentarz wyjaśniający działanie komponentu / funkcji / strony — po co powstał i co robi, tak żeby użytkownik rozumiał sens kodu. Bez pytania nie dodawaj komentarzy.
