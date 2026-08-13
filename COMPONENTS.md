# COMPONENTS.md — recipes for extraction

Read this at extraction time, when a styled block becomes a React component.
**Check the shadcn column first.** If shadcn has the primitive, install it and wire
our variants into its own `cva()` config — do not rebuild the primitive by hand and
do not override it with call-site classes. Only components with no shadcn equivalent
(bottom of this file) get built from scratch, in `components/devflow/`.

Every size below is a real value from the design. Do not round to a 4/8px grid.

---

## §0 · Shape → component + variant (the table, shadcn edition)

The recognition table in `STYLING.md` maps markup shape to a recipe. This is the
same table's other half: which shadcn component, which variant, verbatim, every time.

| Shape                                           | Component            | Variant / size                     | Notes                                                                                                   |
| ----------------------------------------------- | -------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Primary action, 1 per screen                    | `Button`             | `variant="cta"`                    | Sheen gradient. Never more than one visible at once.                                                    |
| Secondary / outlined action                     | `Button`             | `variant="outline"`                |                                                                                                         |
| Tertiary / low-emphasis action                  | `Button`             | `variant="ghost"`                  |                                                                                                         |
| Filled brand action (not the hero CTA)          | `Button`             | `variant="primary" size="md"`      | e.g. "Submit answer"                                                                                    |
| Small inline action (job apply, card action)    | `Button`             | `variant="soft" size="sm"`         |                                                                                                         |
| Icon-only button                                | `Button`             | `variant="icon" size="icon"`       |                                                                                                         |
| Text field                                      | `Input`              | patched default (see §Input below) |                                                                                                         |
| Multi-line field                                | `Textarea`           | patched default                    |                                                                                                         |
| Dropdown field                                  | `Select`             | patched trigger                    |                                                                                                         |
| Field label                                     | `Label`              | patched default                    |                                                                                                         |
| Avatar / profile photo                          | `Avatar`             | default                            | size via `className="size-5\|size-[100px]"` per context                                                 |
| Status pill (success/warn/info/danger/neutral)  | `Badge`              | matching variant                   | never for a topic — that's `Tag`                                                                        |
| Overflow / kebab menu                           | `DropdownMenu`       | default                            |                                                                                                         |
| Confirm / form modal                            | `Dialog`             | default                            |                                                                                                         |
| Mobile nav / filter drawer                      | `Sheet`              | default                            |                                                                                                         |
| Hover hint on icon-only controls                | `Tooltip`            | default                            |                                                                                                         |
| Loading placeholder                             | `Skeleton`           | default                            |                                                                                                         |
| Toast on submit/error                           | `Sonner` (`toast()`) | default                            |                                                                                                         |
| Tab set (Questions/Answers/Activity on profile) | `Tabs`               | default                            |                                                                                                         |
| Divider                                         | `Separator`          | default                            | replaces bare `<hr>` inside shadcn-composed screens; `<hr>` base-layer rule still applies to plain HTML |
| Card wrapper                                    | `Card`               | `variant="static"\|"interactive"`  | patched to the card recipe — see §Card below. `interactive` adds the hover border, for cards in a list  |
| Field group (label + control + hint/error)      | `Field`              | patched default (see §Field below) | `FieldGroup` stacks them; `FieldError` replaces the `<small class="text-danger">` in the recipe         |

**Not used — build local instead, nothing to install:** `Form` (`Field` +
react-hook-form's `Controller` covers it), `Command`/`Combobox`,
`Calendar`/`DatePicker`, `Chart`, `Table` (base-layer `<table>` covers it).
If a screen seems to need one of these, ask before installing it.

---

## Install list

    npx shadcn@latest add button input textarea select label badge avatar
        separator tabs dropdown-menu dialog sheet tooltip skeleton sonner
        card field

This is the full set used across the 24 screens, plus a small margin (`sheet`,
`tooltip`, `skeleton`, `sonner`) for near-term screens that reuse the same patterns.
Each lands in `components/ui/*.tsx`, already reading the tokens from `globals.css` —
no further colour work needed, only the variant edits below.

---

## Button — shadcn `Button`, variants replaced

`components/ui/button.tsx` ships with `default/destructive/outline/secondary/ghost/
link` × `default/sm/lg/icon`. Replace both variant groups — do not keep shadcn's
defaults alongside ours, they map to nothing in this design.

    variant  cta      bg-[image:var(--accent-grad)] text-white
                       shadow-[0_6px_16px_color-mix(in_srgb,var(--red-500)_26%,transparent)]
                       hover:brightness-[1.03]
                       → ONE per screen, the single highest-priority action.
    variant  primary  bg-accent-solid text-white hover:bg-accent-fg
    variant  outline  border border-line-strong bg-background text-fg hover:bg-subtle
    variant  soft     bg-accent-soft text-accent-solid hover:bg-accent-solid hover:text-white
    variant  ghost     bg-transparent font-medium text-fg-muted hover:bg-muted hover:text-fg
    variant  icon      border border-line bg-subtle text-[var(--icon-secondary)]

    size     cta      h-[45px] px-[18px] rounded-[11px] text-base
    size     auth     h-[45px] px-[18px] rounded-lg     text-base
                       → cta at the 8px radius STYLING.md §3 asks for inside an auth
                         card. Same height, same Sheen — only the corner differs.
                         Auth screens only; everywhere else the hero button is `cta`.
    size     md       h-[42px] px-[22px] rounded-md    text-base   (shadcn "default")
    size     sm       h-[38px] px-[15px] rounded-md    text-sm
    size     icon     size-[34px] rounded-md justify-center px-0

    base (shared across all variants, keep shadcn's own)
             inline-flex items-center gap-2 font-semibold tracking-[-0.1px]
             transition-colors select-none disabled:cursor-not-allowed
             disabled:bg-[var(--bg-disabled)] disabled:text-[var(--text-disabled)]

Call sites: `<Button variant="cta">`, `<Button variant="soft" size="sm">`. Never
`<Button className="bg-...">` — that's the override this system exists to prevent.

---

## Card — shadcn `Card`, patched to the card recipe

Nova's `Card` ships as `ring-1 ring-foreground/10 bg-card` with a `--card-spacing`
of 16px and a tinted `CardFooter` — none of which is our card. Patched once, so the
recipe from `STYLING.md` ("Card, any kind") comes out of the component itself:

    base       flex flex-col gap-6 rounded-xl border border-line bg-background shadow-card
               py-(--card-spacing) + children px-(--card-spacing)
               --card-spacing: 20px mobile → 36px at sm  (the recipe's p-5 → p-9)

    variant  static       no hover — confirmation panels, auth, anything not clickable
    variant  interactive  hover:border-accent-solid — cards in a list

    CardTitle        text-xl font-semibold tracking-[-0.3px] leading-[1.24]  (matches h2)
    CardDescription  text-sm text-fg-muted
    CardFooter       flex flex-wrap items-center justify-between gap-4 — the card-footer-meta
                     recipe, no tinted background and no top border

`QuestionCard`/`TagCard`/`UserCard`/`JobCard` stay local components — they compose
`Card` rather than re-declaring the shell.

---

## Field — shadcn `Field`, patched to the field-group recipe

Covers label + control + hint/error. `Field` is the group wrapper, `FieldGroup`
stacks several, `FieldLabel` is our patched `Label`. Three values differ from
shadcn's default and are patched in `components/ui/field.tsx`:

    Field             gap-2 → gap-2.5              (the field-group recipe)
    FieldDescription  text-sm text-muted-foreground → text-xs text-fg-subtle   (our <small>)
    FieldError        text-sm text-destructive → text-xs text-danger           (recipe's error line)
    FieldSeparator    text-sm text-muted-foreground → text-[13px] text-fg-subtle    (the "or" rule)

Required marker stays the recipe's `<span class="text-accent-solid">*</span>` inside
the label. Auth screens do **not** use this — they have their own `AuthField` at
h-12, see `STYLING.md` §3.

---

## Auth card · Confirmation card · OAuth row · Dark card — local, no shadcn equivalent

Full recipes moved to `STYLING.md` §3 — read there before building. Summary of the
component boundary:

    components/devflow/auth/auth-card.tsx      Sign in, Sign up, Forgot password,
                                                Set new password, Check your email,
                                                Account exists — same shell, fields
                                                and social row optional per screen.
                                                ("confirmation card" in SCREENS.md is
                                                this same component with no fields.)
    components/devflow/auth/auth-field.tsx     h-12 field, NOT shadcn Input — see
                                                the height note in STYLING.md §3.
    components/devflow/auth/oauth-row.tsx      divider + GitHub/Google buttons
    components/devflow/auth/welcome-card.tsx   Welcome only — dark, fixed colours,
                                                circular provider icons, own layout

---

## Tag — local, no shadcn equivalent (`components/devflow/tag.tsx`)

Square-ish, never a pill. Pills mean status; tags mean topic. Devicon goes inside a
tag when it names a technology (`<i class="devicon-typescript-plain colored" />`
before the label) — Lucide never appears inside a Tag.

    sm         h-[29px] px-4 rounded-md bg-muted text-[10px] font-semibold
               uppercase tracking-[0.04em] text-fg-subtle
    md         px-[10px] py-1 rounded-sm bg-muted text-sm font-medium text-fg-muted
    selected   bg-accent-soft text-accent-solid font-semibold
    add        h-8 rounded-[9px] border border-dashed border-line-strong px-3 text-sm
               hover:border-solid hover:border-accent-solid hover:text-accent-solid
    removable  pr-1.5 pl-[10px] py-1 + <X className="size-[11px]" /> (Lucide)

    count      ml-auto text-sm text-fg-subtle tabular-nums

---

## Filter chip · Badge

    filter     h-[42px] px-4 rounded-lg bg-muted text-[13px] font-medium text-fg-muted
               → local button, not a shadcn primitive (no toggle-chip in shadcn)
    active     bg-accent-soft text-accent-solid font-semibold

Badge — shadcn `Badge`, variants replaced (shadcn ships `default/secondary/
destructive/outline`; swap for ours):

    variant  accent   bg-accent-soft text-accent-solid
    variant  success  bg-success-bg text-success
    variant  warning  bg-warning-bg text-warning
    variant  info     bg-info-bg text-info
    variant  danger   bg-danger-bg text-danger
    variant  neutral  bg-muted text-fg-muted
    base     inline-flex items-center gap-[5px] rounded-full px-2 py-[3px]
             text-2xs font-semibold whitespace-nowrap
    icon     always 11px inside a badge

---

## Input · Textarea · Select · Search

shadcn's own defaults do NOT match this design — `Input`/`Textarea` ship at
`h-9 rounded-md text-sm px-3`, ours is `h-14 rounded-xl text-base px-4`. This is a
real conflict, not a maybe: **patch the component files directly**, once, right after
install — do not leave the shadcn default and override at each call site.

    components/ui/input.tsx     replace the base className:
                                 h-14 w-full rounded-xl border border-input bg-background
                                 px-4 text-base placeholder:text-muted-foreground
                                 outline-none focus-visible:border-ring
                                 disabled:cursor-not-allowed (keep shadcn's disabled: opacity)
                                 + add variant "unstyled": border-0 bg-transparent h-auto
                                   px-0 shadow-none focus-visible:ring-0 (for search/editor)
                                 + add variant "auth": h-12 rounded-lg border border-line
                                   bg-background px-4 text-[15px] focus:border-accent-solid
                                   → the `AuthField` sizing from STYLING.md §3, as a
                                     variant rather than a separate component. Auth
                                     screens only — never mix it with the default on
                                     one screen.

    components/ui/textarea.tsx  h-auto min-h-[160px] w-full rounded-xl border border-input
                                 bg-background px-4 py-4 text-base leading-[1.5]
                                 + variant "unstyled": border-0 rounded-none shadow-none
                                   min-h-[240px] (for the rich text editor)

    components/ui/select.tsx    SelectTrigger → h-14 rounded-xl px-4 text-base
                                 (matches Input exactly — same field height everywhere)

    components/ui/label.tsx     shadcn's default already reads close to ours
                                 (text-sm font-medium) — repoint to text-base
                                 font-semibold tracking-[-0.15px] text-foreground

After this patch, every future `<Input>`/`<Textarea>`/`<Select>` call is correct by
construction — the base layer no longer touches form fields at all (see globals.css).

    group      flex flex-col gap-2.5
    required   <span class="text-accent-solid">*</span> inside the label
    error      border-[var(--border-error-primary)] on the field
               + <small class="text-danger"> for the message
    disabled   shadcn's own disabled: state — do not add a custom one

    search     wrap  flex items-center gap-3 h-14 px-[18px] rounded-xl bg-background
                     border border-line focus-within:border-accent-solid
               icon  size-5 text-fg-subtle (Lucide `Search`)
               input `<Input variant="unstyled" className="flex-1" />`

    editor     wrap  rounded-xl border border-line bg-background overflow-hidden
               bar   flex flex-wrap items-center gap-1 px-3 py-2 border-b border-line
                     bg-subtle
               tool  size-[30px] rounded-md text-fg-subtle hover:bg-muted hover:text-fg
                     → local button, not shadcn Button (icon-only toolbar toggle)
               area  `<Textarea variant="unstyled" />`

---

## Question card — local, no shadcn equivalent (`components/devflow/question-card.tsx`)

    card       flex flex-col gap-6 rounded-xl border border-line bg-background p-9
               shadow-card hover:border-accent-solid
               → mobile p-5
    title      h2, base layer — no class
    tags       ul flex flex-wrap gap-2 pl-0 list-none  +  Tag.sm on each li
    footer     flex flex-wrap items-center justify-between gap-4
    author     flex items-center gap-1.5
               img size-5 rounded-full object-cover
               name text-base font-medium text-fg
               time text-sm text-fg-subtle
    meta       flex items-center gap-4 text-sm text-fg-subtle
               item flex items-center gap-1.5, icon size-4
               → Votes / Answers / Views, always that order, always icon-first

---

## Tag card · User card · Job card — local, no shadcn equivalent

`components/devflow/tag-card.tsx` · `user-card.tsx` · `job-card.tsx`. Composed from
shadcn `Avatar` (user-card) and `Badge`/`Button` (job-card) — not built from scratch.

    tag-card   flex flex-col gap-3.5 rounded-xl border border-line bg-background p-9
               shadow-card hover:border-accent-solid
               name  w-fit rounded-sm bg-muted px-5 py-2 text-base font-semibold
               desc  text-sm line-clamp-2
               count text-sm font-semibold text-accent-solid

    user-card  flex flex-col items-center gap-3.5 rounded-xl border border-line
               bg-background p-9 shadow-card text-center
               avatar shadcn `Avatar`, size-[100px]
               name   text-lg font-semibold
               handle text-sm text-fg-subtle
               tags   flex gap-2 pt-1 — Tag.sm each

    job-card   flex gap-6 rounded-xl border border-line bg-background p-9 shadow-card
               logo  size-[54px] rounded-xl object-contain bg-subtle p-2 shrink-0
               body  flex-1 min-w-0 flex flex-col gap-3
               head  flex items-start justify-between gap-4
               chips flex flex-wrap gap-2.5 — Badge variant="neutral" each
               apply Button size="sm" variant="soft" + Lucide ArrowUpRight 14px

---

## Vote control — local, no shadcn equivalent (`components/devflow/vote-control.tsx`)

    wrap       flex flex-col items-center gap-1
    button     size-[30px] rounded-md flex items-center justify-center
               hover:bg-muted text-fg-subtle
    active     text-accent-solid bg-accent-soft
    icon       VoteUpIcon / VoteDownIcon from components/devflow/icons/vote-arrows.tsx
               (no Lucide equivalent — see ICONS.md)
    count      text-base font-semibold tabular-nums text-fg

---

## App shell

Three siblings. Not nested.

    shell      flex min-h-screen bg-subtle
    nav        w-[266px] shrink-0 sticky top-0 h-screen overflow-y-auto
               border-r border-line bg-background flex flex-col
               → below md: fixed bottom-0 inset-x-0 h-auto flex-row border-t border-r-0
    main       flex-1 min-w-0 flex flex-col gap-10 px-[30px] py-10
               max-w-[1100px] mx-auto
    panel      w-[350px] shrink-0 sticky top-0 h-screen overflow-y-auto
               border-l border-line bg-background p-6 hidden xl:flex flex-col gap-9
    header     sticky top-0 z-40 h-[80px] flex items-center gap-6 px-6
               border-b border-line bg-background

    nav item   h-[52px] px-4 rounded-lg flex items-center gap-4 text-md
               inactive font-medium text-fg-muted hover:bg-muted
               active   bg-accent-solid text-white font-semibold   ← flat, not gradient
    logout     mt-auto — pinned to the bottom of the nav, always visible

Neither side column scrolls with the page. Each owns its own scroll.

---

## Icons

    UI         lucide-react, stroke width 2 (shadcn default)
               <Home size={21} /> — see ICONS.md for the Phosphor→Lucide map
               sizes: 14 meta · 16 button · 20 search · 21 nav
               no-match gap (vote arrows): components/devflow/icons/vote-arrows.tsx

    tech logos devicon — <i class="devicon-react-plain colored" />, unchanged
               original brand colours, never recoloured to the accent

Never hand-write SVG paths for an icon Lucide already covers.
