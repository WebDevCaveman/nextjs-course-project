# COMPONENTS.md — recipes for extraction

Read this at extraction time, when a styled block becomes a React component. The
class strings here are **the same strings** `STYLING.md` produced — extraction moves
them into a component file, it does not restyle anything.

Every size below is a real value from the design. Do not round to a 4/8px grid.

---

## Button

    base       inline-flex items-center gap-2 font-semibold tracking-[-0.1px]
               transition-colors select-none disabled:cursor-not-allowed

    size.cta   h-[45px] px-[18px] rounded-[11px] text-base   // page-level primary
    size.md    h-[42px] px-[22px] rounded-md    text-base
    size.sm    h-[38px] px-[15px] rounded-md    text-sm
    size.icon  size-[34px] rounded-md justify-center px-0

    cta        bg-[image:var(--accent-grad)] text-white
               shadow-[0_6px_16px_color-mix(in_srgb,var(--color-accent)_26%,transparent)]
               → size.cta only. ONE per screen, the single highest-priority action.
    primary    bg-accent text-white hover:bg-accent-fg
    outline    border border-line-strong bg-base text-fg hover:bg-subtle
    soft       bg-accent-soft text-accent hover:bg-accent hover:text-white
    ghost      bg-transparent font-medium text-fg-muted hover:bg-muted hover:text-fg
    icon       border border-line bg-subtle text-[var(--icon-secondary)]

    disabled   disabled:bg-[var(--bg-disabled)] disabled:text-[var(--text-disabled)]

---

## Tag

Square-ish, never a pill. Pills mean status; tags mean topic.

    sm         h-[29px] px-4 rounded-md bg-muted text-[10px] font-semibold
               uppercase tracking-[0.04em] text-fg-subtle
    md         px-[10px] py-1 rounded-sm bg-muted text-sm font-medium text-fg-muted
    selected   bg-accent-soft text-accent font-semibold
    add        h-8 rounded-[9px] border border-dashed border-line-strong px-3 text-sm
               hover:border-solid hover:border-accent hover:text-accent
    removable  pr-1.5 pl-[10px] py-1 + <X className="size-[11px]" />

    count      ml-auto text-sm text-fg-subtle tabular-nums

---

## Filter chip · Badge

    filter     h-[42px] px-4 rounded-lg bg-muted text-[13px] font-medium text-fg-muted
    active     bg-accent-soft text-accent font-semibold

    badge      inline-flex items-center gap-[5px] rounded-full px-2 py-[3px]
               text-2xs font-semibold whitespace-nowrap
      accent   bg-accent-soft text-accent
      success  bg-success-bg text-success
      warning  bg-warning-bg text-warning
      info     bg-info-bg text-info
      danger   bg-danger-bg text-danger
      neutral  bg-muted text-fg-muted
      icon     always 11px inside a badge

---

## Input · Textarea · Search

The base layer covers bare fields. These recipes are for the composed cases.

    group      flex flex-col gap-2.5
    required   <span class="text-accent">*</span> inside the label
    error      border-[var(--border-error-primary)] on the field
               + <small class="text-danger"> for the message
    disabled   bg-muted text-[var(--text-disabled)] cursor-not-allowed

    search     wrap  flex items-center gap-3 h-14 px-[18px] rounded-xl bg-base
                     border border-line focus-within:border-accent
               icon  size-5 text-fg-subtle
               input flex-1 border-0 bg-transparent h-auto px-0
               → reset the base height, or the wrapper double-counts it

    editor     wrap  rounded-xl border border-line bg-base overflow-hidden
               bar   flex flex-wrap items-center gap-1 px-3 py-2 border-b border-line
                     bg-subtle
               tool  size-[30px] rounded-md text-fg-subtle hover:bg-muted hover:text-fg
               area  border-0 rounded-none min-h-[240px]

---

## Question card

    card       flex flex-col gap-6 rounded-xl border border-line bg-base p-9
               shadow-card hover:border-accent
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

## Tag card · User card · Job card

    tag-card   flex flex-col gap-3.5 rounded-xl border border-line bg-base p-9
               shadow-card hover:border-accent
               name  w-fit rounded-sm bg-muted px-5 py-2 text-base font-semibold
               desc  text-sm line-clamp-2
               count text-sm font-semibold text-accent

    user-card  flex flex-col items-center gap-3.5 rounded-xl border border-line
               bg-base p-9 shadow-card text-center
               avatar size-[100px] rounded-full object-cover
               name   text-lg font-semibold
               handle text-sm text-fg-subtle
               tags   flex gap-2 pt-1

    job-card   flex gap-6 rounded-xl border border-line bg-base p-9 shadow-card
               logo  size-[54px] rounded-xl object-contain bg-subtle p-2 shrink-0
               body  flex-1 min-w-0 flex flex-col gap-3
               head  flex items-start justify-between gap-4
               chips flex flex-wrap gap-2.5 — Badge.neutral each
               apply Button size.sm variant soft + ArrowUpRight 14px

---

## App shell

Three siblings. Not nested.

    shell      flex min-h-screen bg-subtle
    nav        w-[266px] shrink-0 sticky top-0 h-screen overflow-y-auto
               border-r border-line bg-base flex flex-col
               → below md: fixed bottom-0 inset-x-0 h-auto flex-row border-t border-r-0
    main       flex-1 min-w-0 flex flex-col gap-10 px-[30px] py-10
               max-w-[1100px] mx-auto
    panel      w-[350px] shrink-0 sticky top-0 h-screen overflow-y-auto
               border-l border-line bg-base p-6 hidden xl:flex flex-col gap-9
    header     sticky top-0 z-40 h-[80px] flex items-center gap-6 px-6
               border-b border-line bg-base

    nav item   h-[52px] px-4 rounded-lg flex items-center gap-4 text-md
               inactive font-medium text-fg-muted hover:bg-muted
               active   bg-accent text-white font-semibold   ← flat, not gradient
    logout     mt-auto — pinned to the bottom of the nav, always visible

Neither side column scrolls with the page. Each owns its own scroll.

---

## Icons

    UI         @phosphor-icons/react, regular weight
               <House size={21} /> — the design library is Phosphor-named, 1:1
               sizes: 14 meta · 16 button · 20 search · 21 nav

    tech logos devicon — <i class="devicon-react-plain colored" />
               original brand colours, never recoloured to the accent

Never hand-write SVG paths for an icon either package covers.
