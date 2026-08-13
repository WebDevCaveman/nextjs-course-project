# ICONS.md — the Huge Icons set

UI icons are **Huge Icons (outline)**: 1349 icons vendored in `components/devflow/icons/huge/`,
every one a 24×24 artboard of filled paths painted with `currentColor`. There is no icon
package to install and nothing to configure.

`lucide-react` is no longer imported anywhere. It stays in `package.json` only because a
component pulled in by the shadcn CLI arrives with Lucide imports — swap them for this set
before the component lands. The package is uninstalled at the end of the project.

**Devicons are untouched.** They were never a UI icon — they render technology/stack logos on
tags and job cards, in original brand colour (`devicon-<name>-plain colored`). Nothing here
affects them.

## Use it

In a Server Component — the category chunk loads on the server, nothing ships to the client:

```tsx
import { HugeIcon } from "@/components/devflow/icons/huge";

<HugeIcon name="interface/search-01" size={20} className="text-muted-foreground" />;
```

In a `"use client"` component — **never** import `data/<category>`, that ships up to 336 KB to
the browser for one glyph. Use the client-safe subset:

```tsx
"use client";
import { HugeIconSvg } from "@/components/devflow/icons/huge/HugeIconSvg";
import { uiIcons } from "@/components/devflow/icons/huge/data/ui";

<HugeIconSvg icon={uiIcons.check} size={16} />;
```

`data/ui.ts` holds only the entries client components actually use. Need one that isn't there?
Copy its entry out of `data/<category>.ts` and keep the `// <category>/<name>` comment above it —
that comment is the only mapping back to the source.

- Sizes unchanged: **14 meta · 16 button · 20 search · 21 nav**.
- Colour is `currentColor`: set it with a token class (`text-foreground`, `text-muted-foreground`,
  `text-accent-solid`). Never a hex, never `fill=`.
- No `strokeWidth` — these are filled outlines, not stroked paths. Don't add one.
- `aria-hidden="true"` by default. For a standalone, meaningful icon pass `role="img"` + `aria-label`.

## Finding a name — look at the icon, don't trust the name

`components/devflow/icons/huge/ICON-NAMES.md` is the full list, grouped by category — grep it.
At runtime: `HUGE_ICON_NAMES`, `HUGE_ICON_CATEGORIES`, `HUGE_ICON_COUNT_BY_CATEGORY`.

Names come from the Figma file and **several of them are wrong about what they draw**. The
hamburger is `menu/menu-user`; `arrows/direction-right` is a chevron pointing _down_;
`interface/remove-circle` is a bare X with no circle. Render a candidate before you commit to it.
A trailing `-01`/`-02` is a design variant of the same idea, not a size or weight.

## What the project uses today

| shape            | name                                    | used in                  |
| ---------------- | --------------------------------------- | ------------------------ |
| House            | `interface/home-01`                     | Nav                      |
| Two people       | `user/users-01`                         | Communities, Profile     |
| Star             | `interface/star`                        | Collections              |
| Briefcase        | `business/briefcase`                    | Find Jobs                |
| Tag              | `ecommerce/tag`                         | Tags                     |
| Plus             | `interface/plus-01`                     | Ask a Question           |
| Hamburger ≡      | `menu/menu-user`                        | Mobile nav trigger       |
| Door with arrow  | `interface/login`                       | Log In                   |
| Person +         | `user/user-circle-add`                  | Sign Up                  |
| Sun              | `weather/sun`                           | Theme switch             |
| Crescent         | `weather/half-moon-phase`               | Theme switch             |
| Monitor          | `device/computer`                       | Theme switch (System)    |
| X                | `interface/remove-circle`               | Sheet, Dialog close      |
| Checkmark        | `interface/tick`                        | Select, DropdownMenu     |
| Chevron down     | `arrows/direction-right`                | Select trigger, scroll   |
| Chevron up       | `arrows/direction-left-01`              | Select scroll            |
| Chevron right    | `arrows/direction-down-rectangle`       | DropdownMenu sub-trigger |
| Check in circle  | `interface/check-mark-circle`           | Toast success            |
| (i)              | `interface/information-circle`          | Toast info               |
| Warning triangle | `interface/warning`                     | Toast warning            |
| Warning hexagon  | `interface/warning-error`               | Toast error              |
| Spinner          | `interface/loading`                     | Toast loading            |
| Triangle up/down | `arrows/up-arrow` / `arrows/down-arrow` | VoteControl              |

## Watch out

- **`social/` is monochrome.** Brand marks were flattened to `currentColor`. Do not use them
  where a brand's own colour is required — that is what devicons are for.
- **`data/*.ts` and `names.ts` are generated** from the Figma source. Don't patch a path by hand.
- Only the outline style was imported. Solid and bulk exist in the Figma file (~1300 each) and can
  be added the same way if a design needs them.
