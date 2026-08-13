# STYLING.md — the styling contract

Read this before styling any markup. Two parts: a base layer that styles unclassed
HTML for free, and a recognition table mapping markup shape → one recipe or shadcn
component.

The point of the table is that the same block gets the same classes — or the same
shadcn component + variant — every time, in every file, no matter who asks or when.
That is what makes the later extraction to React components a move rather than a
rewrite.

---

## 1 · Base layer — already in `globals.css`

Bare semantic HTML is on-system before you touch it:

    body        bg-subtle text-fg font-sans antialiased
    h1          text-[30px] font-semibold tracking-[-0.8px] leading-[1.28]
    h2          text-xl  font-semibold tracking-[-0.3px] leading-[1.24]
    h3          text-lg  font-semibold tracking-[-0.3px]
    h4          text-base font-semibold tracking-[-0.2px]
    p           text-base leading-[1.55] text-fg-muted text-pretty
    small       text-xs text-fg-subtle
    strong      font-semibold text-fg
    a           text-accent-solid hover:text-accent-fg
    hr          border-0 border-t border-line my-6
    code        font-mono text-[13px] px-[5px] py-px rounded-[5px] bg-muted
    pre         font-mono text-xs p-4 rounded-lg bg-subtle border border-line
    ul, ol      pl-5 flex flex-col gap-2 text-base text-fg-muted
    label       text-base font-semibold tracking-[-0.15px] text-fg
    table/th/td full width, border-b border-line, th left+semibold

**`input`, `textarea`, `select` are NOT bare tags anymore — they are shadcn
`<Input>`/`<Textarea>`/`<Select>`.** If the author's HTML still has a bare `<input>`,
convert it to the shadcn component during this pass — that conversion is expected
and is not "improvising a recipe".

**Do not re-declare any base-layer rule.** `<h2 class="text-xl">` is a bug, not a
refinement.

---

## 2 · Recognition table

**Column 2 names a shadcn component where one applies.** Use it, with the variant
given — never a bare tag with classes when a row names a component. §0 in
`COMPONENTS.md` is this same mapping, kept in sync; if you add a row here, add it
there too.

| Markup shape                                                    | Recipe                                                                                                                                                                                                                                                                        | Note                                                                                                                 |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Page wrapper**<br>`main`                                      | `flex-1 min-w-0 flex flex-col gap-10 px-[30px] py-10 max-w-[1100px] mx-auto`                                                                                                                                                                                                  | Left nav and right panel are siblings of `main`, not children.                                                       |
| **Screen heading row**<br>`h1` + optional `button`              | `flex flex-wrap items-center justify-between gap-4`                                                                                                                                                                                                                           | The `h1` needs no class. Button is shadcn `<Button>` — see row below.                                                |
| **Primary action**<br>`button`, first / only                    | shadcn `<Button variant="cta">` if it's the single highest-priority action on the screen; `<Button variant="outline">` for secondary; `<Button variant="ghost">` for tertiary. Never a bare `<button>` with classes.                                                          | The gradient (`cta`) is **one per screen**.                                                                          |
| **Filter row**<br>`nav > button` ×3–5                           | row `flex flex-wrap gap-3`<br>chip `h-[42px] px-4 rounded-lg bg-muted text-[13px] font-medium text-fg-muted`<br>active `bg-accent-soft text-accent-solid font-semibold`                                                                                                       | No shadcn toggle-chip primitive — stays a local `<button>`. No border on chips, the fill carries them.               |
| **Search field**<br>`input[type=search]`                        | shadcn `<Input>` with an `unstyled` variant inside a wrapper: `flex items-center gap-3 h-14 px-[18px] rounded-xl bg-background border border-line focus-within:border-accent-solid`, Lucide `Search` 20px `text-fg-subtle`, `<Input variant="unstyled" className="flex-1" />` | Reset the Input's own border/ring/height inside the wrapper, or it double-counts.                                    |
| **Card, any kind**<br>`article` / `section` in a list           | `rounded-xl border border-line bg-background p-9 shadow-card hover:border-accent-solid`                                                                                                                                                                                       | `p-9` = 36px, mobile `p-5`. `shadow-card` = 0 2px 4px / 0 12px 20px at 2–3% black.                                   |
| **Tag list**<br>`ul` of short words                             | ul `flex flex-wrap gap-2 pl-0 list-none`<br>li `h-[29px] px-4 inline-flex items-center rounded-md bg-muted text-[10px] font-semibold uppercase tracking-[0.04em] text-fg-subtle`                                                                                              | Local `Tag` component, not shadcn `Badge` — kill the base `ul` padding and markers explicitly.                       |
| **Status label**<br>single word, coloured, pill-shaped          | shadcn `<Badge variant="success"\|"warning"\|"info"\|"danger"\|"accent"\|"neutral">`                                                                                                                                                                                          | Pills mean status. If it names a topic instead, it's a Tag, not a Badge.                                             |
| **Card footer meta**<br>`footer` with `img` + spans             | footer `flex flex-wrap items-center justify-between gap-4`<br>author `flex items-center gap-1.5`, avatar shadcn `<Avatar>` size-5, name `text-base font-medium`<br>meta `flex items-center gap-4 text-sm text-fg-subtle`, each `flex items-center gap-1.5` + Lucide icon      | Votes / Answers / Views, always that order, always icon-first.                                                       |
| **Field group**<br>`label` + `input` + `small`                  | `flex flex-col gap-2.5`<br>required marker `<span class="text-accent-solid">*</span>` inside the label                                                                                                                                                                        | `<label>` is base layer; `input` is shadcn `<Input>`; `<small>` is base layer. Only the wrapper gets a class.        |
| **Stat / count strip**<br>`dl` or number+word pairs             | `grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3`<br>cell `flex flex-col gap-1.5 p-4 rounded-xl border border-line`<br>number `text-2xl font-semibold tabular-nums`, label `text-sm text-fg-subtle`                                                                 |                                                                                                                      |
| **Empty / error block**<br>`section` with img + h2 + p + button | `flex flex-col items-center gap-6 py-20 text-center`<br>illustration `max-w-[270px]`, `h2` `text-2xl`, `p` `max-w-[46ch]`, button `<Button variant="cta">`                                                                                                                    | Centre-aligned only here; everywhere else text is left.                                                              |
| **Auth shell**<br>`main` wrapping an auth card                  | `min-h-screen bg-[image:var(--auth-grad)]` + `grid place-items-center px-6 py-10`                                                                                                                                                                                             | Our addition, not in the handoff — the backdrop the auth cards in §3 sit on. Dark in both themes. Auth screens only. |
| **Anything else**                                               | **STOP — ask instead of improvising.**                                                                                                                                                                                                                                        | An invented recipe is what breaks the system. A question costs one message.                                          |

---

## 3 · Auth screens — the missing recipes

Three shapes cover Welcome, Sign in, Sign up, Forgot password, Check your email,
Set new password, Account exists. None is a shadcn primitive — build as local
components in `components/devflow/auth/`. Their field height (48px) and input
radius (8px) are intentionally **not** the same as the rest of the app's shadcn
`Input` (14px/10px, patched in COMPONENTS.md) — auth screens are their own
enclosed surface. Do not unify the two; do not patch shadcn `Input` to match this,
and do not restyle this card's fields to `h-14` to match shadcn.

**`AuthCard`** — the shell for every screen except Welcome:

    card     w-full max-w-[520px] flex flex-col gap-10 p-[40px_32px] rounded-[10px]
             bg-subtle shadow-[0_29px_59px_rgba(0,0,0,0.16)]
    header   flex items-start justify-between gap-5
    title    h1, text-2xl leading-[1.3] tracking-[-0.4px] font-bold
    subtitle p, text-base leading-[1.4] text-fg-muted
    mark     size-[50px] rounded-[14px] bg-[image:var(--accent-grad)]
             flex items-center justify-center — 26px white glyph, centered

**`AuthField`** — local, not shadcn `Input` (see height note above):

    label    text-base font-medium tracking-[-0.2px]
    input    w-full h-12 px-4 rounded-lg border border-line bg-background text-[15px]
             outline-none focus:border-accent-solid
    hint     text-[13px] text-fg-subtle

**Auth primary button** — same Sheen family as `Button variant="cta"`, but at
`rounded-lg` (8px) inside this card, not the button component's own 11px —
a deliberate exception scoped to `AuthCard`, not a drift to fix:

    button   h-[45px] rounded-lg bg-[image:var(--accent-grad)] text-white text-base
             font-semibold shadow-[0_6px_16px_color-mix(in_srgb,var(--red-500)_26%,transparent)]
             hover:bg-accent-fg

**OAuth row** — divider + two full-width provider buttons, always GitHub then Google:

    divider  flex items-center gap-3.5, "or" in text-[13px] text-fg-subtle,
             1px bg-line rules on both sides
    button   flex items-center justify-center gap-2.5 h-[45px] rounded-lg
             border border-line-strong bg-background text-fg text-[15px] font-medium
             hover:border-accent-solid
             icon Lucide-equivalent brand mark, 20px, before the label

**`WelcomeCard`** — Welcome only, the one dark/frosted exception:

    card     w-full max-w-[488px] min-h-[572px] flex flex-col items-center
             justify-center gap-10 (centered column, not the AuthCard shell)
    mark     size-11 rounded-[13px] bg-[image:var(--accent-grad)], 24px glyph
    provider row: flex items-center gap-6, 3× circular icon button
             size-[67px] rounded-2xl border border-[rgb(63,67,84)] bg-transparent
             text-white — fixed dark colour, does not follow the theme token
    footnote text-[13px] text-[rgb(133,142,173)] max-w-[34ch] text-center
             — also a fixed colour, intentional on this screen only

---

## 3 · Worked example

**In** — what the author writes:

    <article>
      <h2>Is there a Math function to calculate the root?</h2>
      <ul><li>javascript</li><li>react.js</li></ul>
      <footer>
        <img src="/av.png" alt="Marcus"><span>Marcus Webb</span><span>asked 2 mins ago</span>
        <span>1.2k Votes</span><span>900 Answers</span><span>5.2k Views</span>
      </footer>
    </article>

**Out** — what comes back:

    <article class="flex flex-col gap-6 rounded-xl border border-line bg-background p-9
                    shadow-card hover:border-accent-solid">
      <h2>…</h2>                             <!-- base layer, untouched -->
      <ul class="flex flex-wrap gap-2 pl-0 list-none">
        <li class="h-[29px] px-4 inline-flex items-center rounded-md bg-muted
                   text-[10px] font-semibold uppercase tracking-[0.04em]
                   text-fg-subtle">…</li>
      </ul>
      <footer class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-1.5">…author, Avatar…</div>
        <div class="flex items-center gap-4 text-sm text-fg-subtle">…meta, Lucide icons…</div>
      </footer>
    </article>

Three blocks matched three rows. The `h2` was left alone because the base layer had
already handled it. Nothing was styled twice.

---

## 4 · Hard rules

1. No hex, no `rgb()`, no arbitrary colour. Every colour through a theme token.
2. No new CSS file, no `style` attribute. Classes only.
3. Never restyle what the base layer covers.
4. Keep the author's markup shape — add classes and wrappers, don't rewrite.
5. Both themes must work. Check `.dark` before finishing.
6. No match → ask. Then add the new row to this file **before** using it.

---

## 5 · The prompt to use

    Style app/<file>.html against the DevFlow system.

    Read STYLING.md first. Apply the recognition table — if a block matches a row,
    use that row's recipe verbatim, and use the shadcn component it names (Button,
    Input, Badge, Avatar…) instead of a bare tag with classes. Do not invent values.

    Constraints:
      · shadcn primitives for anything the table maps to one — don't hand-roll it
      · classes only otherwise, no new CSS file, no inline style attributes
      · every colour through a theme token — no hex, no arbitrary rgb()
      · do not restyle anything the @layer base rules already cover
      · both themes must work: check the .dark class before you finish
      · if a block matches no row, say so and ask — do not improvise

    Report which rows you used and anything you had to ask about.
