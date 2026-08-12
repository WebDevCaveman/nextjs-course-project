# ICONS.md — Phosphor → Lucide migration

shadcn ships with `lucide-react`. We are dropping `@phosphor-icons/react` for UI icons
and standardising on Lucide, because every shadcn primitive already expects it —
running two icon packages for one role is the thing that breaks first.

**Devicons are untouched.** They were never a UI icon — they render technology/stack
logos on tags and job cards, in original brand colour. Nothing here affects them.

## Direct swap — same shape, new import

| Phosphor (old)                                                     | Lucide (new)                                           | Used in                  |
| ------------------------------------------------------------------ | ------------------------------------------------------ | ------------------------ |
| `House`                                                            | `Home`                                                 | Nav                      |
| `MagnifyingGlass`                                                  | `Search`                                               | Search field             |
| `Star`                                                             | `Star`                                                 | Collections              |
| `SuitcaseSimple`                                                   | `Briefcase`                                            | Jobs nav, JobCard        |
| `ChatCircleText`                                                   | `MessageSquare`                                        | Answers count            |
| `Eye`                                                              | `Eye`                                                  | Views count              |
| `User`                                                             | `User`                                                 | Profile                  |
| `UsersThree`                                                       | `Users`                                                | UsersRow                 |
| `Bell`                                                             | `Bell`                                                 | Notifications            |
| `Gear`                                                             | `Settings`                                             | Settings                 |
| `SignOut`                                                          | `LogOut`                                               | Logout                   |
| `Plus`                                                             | `Plus`                                                 | Add tag, ask question    |
| `X`                                                                | `X`                                                    | Remove tag, close        |
| `CaretDown`                                                        | `ChevronDown`                                          | Select, dropdown         |
| `CaretRight`                                                       | `ChevronRight`                                         | Breadcrumb               |
| `ArrowUpRight`                                                     | `ArrowUpRight`                                         | Job apply                |
| `PencilSimple`                                                     | `Pencil`                                               | Edit                     |
| `Trash`                                                            | `Trash2`                                               | Delete                   |
| `Check`                                                            | `Check`                                                | Success, selected state  |
| `WarningCircle`                                                    | `AlertCircle`                                          | Error state              |
| `Envelope`                                                         | `Mail`                                                 | Email fields             |
| `LockKey`                                                          | `Lock`                                                 | Password fields          |
| `TextB` / `TextItalic` / `Link` / `ListBullets` / `Code` / `Image` | `Bold` / `Italic` / `Link` / `List` / `Code` / `Image` | Rich text editor toolbar |

Import shape is identical to Phosphor's: `import { Home } from "lucide-react"` then
`<Home size={21} />`. Sizes are unchanged — 14 meta · 16 button · 20 search · 21 nav.

## No direct equivalent — kept as local SVG

Lucide has no exact match for these. Rather than approximate with a generic chevron
(loses the design's shape), the original Figma SVGs live in
`components/devflow/icons/vote-arrows.tsx`, exported as `<VoteUpIcon />` /
`<VoteDownIcon />` — same call shape as a Lucide icon (`size` prop, `currentColor`
stroke), so call sites don't know the difference.

| Phosphor (old)                | Why no Lucide match                                                                                                                                                                   | Resolution                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `ArrowFatUp` / `ArrowFatDown` | Lucide's `ChevronUp/Down` and `ArrowUp/Down` are thin-stroke arrows; the design's vote control uses a filled, rounded triangle at a specific weight that no Lucide variant reproduces | Local SVG, `components/devflow/icons/vote-arrows.tsx` |

That's the only gap. Everything else in the 24 screens maps directly — see the table
above before adding anything new here.
