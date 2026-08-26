# Spec of record — `cmp-buttons` (item 4)

**Frozen 2026-08-26.** Figma file `tJnXUZbEL3fRWG7h1z0ij7`, node
[`1868-83`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1868-83&m=dev)
("Buttons"). Render: `figma.png` (688×1258). Values: `variables.json`.

First `primitives`-tier item, and the first item in the engagement that produces **block CSS**
rather than tokens.

This ref is the authority for the build. Do not re-pull live Figma mid-build; if this ref is
wrong, re-freeze it and say so, the way `tok-font-sizes` did.

## How this ref was sourced

The page node (`1868-83`) is a documentation page, so — per
[`loop/refs/README.md`](../README.md) — it was **not** pulled in one `get_design_context`
call. It was snapshotted (screenshot + variables), and the value-bearing code was
**deep-pulled from the two component-set sublayers**:

| Sublayer | Component set | Axes | Symbols |
|---|---|---|---|
| [`1868-121`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1868-121&m=dev) | `button` | `Type` × `State` | 34 |
| [`1868-112`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1868-112&m=dev) | `button-big` | `State` only | 4 |

Every colour below is a **bound Figma variable**. Nothing on this node had to be read off a
sample layer's own styles the way `tok-typography`'s `h3`/`h6` did, and nothing was taken
from a printed label — the page's row and column labels are recorded in `variables.json`
under `_design_annotations` as **provenance only**, because that is exactly the sourcing that
made `tok-font-sizes` ship a wrong value in round 1.

## Scope — what this item owns

The **restyle of the native OutSystems UI button** (`.btn` and its modifiers), delivered as
`src/blocks/*.css` per [CLAUDE.md](../../../CLAUDE.md)'s "restyle the native widget, do not
build a parallel system" rule. Audit class: **exists, not exact** → dual-track.

**Not in scope here:**

- **Button group** — item 5 (`cmp-button-group`, node `1892-3789`), a separate row in the
  inventory that depends on this one.
- **Icon-bearing or link-style buttons.** This node shows neither. `.btn` variants OSUI ships
  that this ref says nothing about are **not** re-styled on guesswork; they keep the
  framework's own appearance until a ref covers them.
- **The colour primitives.** All 27 colours resolve to tokens `tok-color-palette` already
  built — see `variables.json._token_mapping`. This item **consumes** them, and must not
  re-declare a hex. The single exception is discussed under "The white gap" below.

## Geometry and type — measured, not inferred

Two sizes exist, and they are **different component sets**, not two variants of one:

| | `button` (regular) | `button-big` |
|---|---|---|
| Padding | **12px 20px** | **16px 24px** |
| Border radius | **4px** | **4px** |
| Font family | Public Sans | Public Sans |
| Font weight | **Bold / 700** | **Bold / 700** |
| Font size | **16px** | **22px** |
| Line-height | **0.9** | **0.9** |
| Text align | center | center |
| Wrapping | `whitespace-nowrap` | `whitespace-nowrap` |
| Overflow | clip | clip |
| Rendered symbol box | 93 × 38 | 120 × 52 |

- **Line-height 0.9 is what the design states**, on both sizes. It is unusual (sub-1 leading
  on a control) but it is bound and consistent across all 38 symbols, so it is built as
  stated. `tokens/typography.css` has no 0.9 step — the line-heights `tok-typography` froze
  are 1.62 / 1.2 / 1.15 — so this is a **component-level** value, not a missing primitive.
- **The type ramp already owns every type value here**, and the maker must consume the
  tokens rather than restate the numbers. Verified against `tokens/typography.css` on
  2026-08-26:

  | Design value | Token |
  |---|---|
  | 16px | `--font-size-sm` — **not** `--font-size-md`, which is 17px |
  | 22px | `--font-size-lg` |
  | Bold 700 | `--font-weight-bold` |
  | Public Sans | `--font-family-base` |
  | line-height 0.9 | **no token** — component-level, see above |

  The `sm`/`md` trap is worth the callout: this ramp is the sparse USWDS scale, so the step
  names do not line up with the sizes a reader would guess.
- **Padding has no confirmed spacing convention to satisfy.** `conventions.spacingBase` is
  `TBD` in `project.config.json`, so 12/20/16/24 are built exactly as measured and the
  checker **may not** raise a finding about multiples of anything. (Rule 9.)

## The full variant matrix

Sourced from `get_design_context` on `1868-121`. Backgrounds and borders are mutually
exclusive: **outline variants have no fill**, filled variants have no border.

### Filled types — component set `button`

| Type | State | Background | Text |
|---|---|---|---|
| primary | default | `#005EA2` | `#FFFFFF` |
| primary | hover | `#1A4480` | `#FFFFFF` |
| primary | active | `#162E51` | `#FFFFFF` |
| secondary | default | `#D83933` | `#FFFFFF` |
| secondary | hover | `#B51D09` | `#FFFFFF` |
| secondary | active | `#8B1303` | `#FFFFFF` |
| accent-cool | default | `#00BDE3` | **`#1B1B1B`** |
| accent-cool | hover | `#28A0CB` | `#FFFFFF` |
| accent-cool | active | `#07648D` | `#FFFFFF` |
| base | default | `#71767A` | `#FFFFFF` |
| base | hover | `#565C65` | `#FFFFFF` |
| base | active | `#3D4551` | `#FFFFFF` |
| accent-warm | default | `#FA9441` | `#FFFFFF` |
| accent-warm | hover | `#C05600` | `#FFFFFF` |
| accent-warm | active | `#775540` | `#FFFFFF` |
| error | default | `#D54309` | `#FFFFFF` |
| error | hover | `#B50909` | `#FFFFFF` |
| error | active | `#6F3331` | `#FFFFFF` |
| success | default | `#00A91C` | **`#1B1B1B`** |
| success | hover | `#4D8055` | `#FFFFFF` |
| success | active | `#446443` | `#FFFFFF` |
| inverse | default | `#DCDEE0` | `#1B1B1B` |
| inverse | hover | `#F0F0F0` | `#1B1B1B` |
| inverse | active | `#FFFFFF` | `#1B1B1B` |
| inverse | **disabled** | `#71767A` | `#1B1B1B` |
| **disabled** | disabled | `#C9C9C9` | `#FFFFFF` |

### Outline types — same component set, 2px border, no fill

| Type | State | Border (2px solid) | Text |
|---|---|---|---|
| outline | default | `#005EA2` | `#005EA2` |
| outline | hover | `#1A4480` | `#1A4480` |
| outline | active | `#162E51` | `#162E51` |
| outline | disabled | `#C9C9C9` | `#C9C9C9` |
| outline-inverse | default | `#A9AEB1` | `#A9AEB1` |
| outline-inverse | hover | `#F0F0F0` | `#F0F0F0` |
| outline-inverse | active | `#FFFFFF` | `#FFFFFF` |
| outline-inverse | disabled | `#71767A` | `#71767A` |

Outline border and text are **the same colour in every single row**. That is a pattern the
CSS should express once, not thirty-two times.

### `button-big` — component set `1868-112`, one axis

| State | Background | Text |
|---|---|---|
| default | `#005EA2` | `#FFFFFF` |
| hover | `#1A4480` | `#FFFFFF` |
| active | `#162E51` | `#FFFFFF` |
| disabled | `#C9C9C9` | `#FFFFFF` |

`button-big` is **primary-only**. The design provides no big secondary, big outline, or big
anything else. Do not generate the cross-product.

### The backdrop for the inverse rows

Both inverse rows sit on a painted rectangle (`1868:84`, `1868:85`), fill `#1B1B1B`
(`Base/ink`, a bound variable — confirmed by `get_design_context`, not eyeballed), radius 4px.
**Inverse and outline-inverse contrast is judged against ink, not against white.** A checker
that measures them on a white preview ground will get the wrong answer; the preview must paint
that backdrop.

## Four things the design says that the build must not tidy

### 1. `disabled` is a TYPE, not a state of every type

The component set exposes `Type=disabled, State=disabled` as its own symbol
(`1868:188`) — one shared disabled appearance — plus a separate `Type=inverse,
State=disabled` and a `disabled` state on each of the two outline types. There is **no**
`Type=secondary, State=disabled`, no `Type=success, State=disabled`, and so on.

The `:disabled` column is printed above both grids but is only populated for primary/inverse
in the standard grid and for both rows in the outline grid. Reading it as "every row has a
disabled cell" is a misreading of the page.

**Consequence for a `.btn` restyle:** `:disabled` on the native widget is a *state*, and it
will fire for every colour variant a developer applies, whether or not the design drew that
cell. The maker must pick one behaviour and **write down which**: either the shared
`#C9C9C9` / `#FFFFFF` appearance applies to all disabled buttons (the reading this ref
recommends, since that is what a single shared `Type=disabled` symbol means), or undrawn
combinations keep the framework's own disabled styling. This is a genuine ambiguity in the
ref, and it is recorded here rather than resolved silently.

### 2. `accent-cool` and `success` take **ink** text at rest, white on hover/active

This inverts mid-interaction, and it is deliberate in USWDS: the two brightest fills are the
two that get a dark foreground, and their `-dark`/`-darker` hover and active steps go back to
white. Build it exactly. It is not a mistake to "normalise" to one foreground per type.

**This directly corroborates open finding FND-001** (issue #1: `.alert-info` 2.24:1,
`.alert-success` / `.btn-success` 3.14:1 with OSUI's white foreground). The remedy that
`tokens/colors.css` measured as AA-clean — a dark foreground on those fills — is *what this
design does on its own buttons*. The button item is the natural place for the `.btn-success`
half of FND-001 to land. It does **not** close the `.alert-*` half, which belongs to
`cmp-alert` (item 7).

### 3. `inverse` gets **lighter** as you interact with it

`#DCDEE0` → `#F0F0F0` → `#FFFFFF`. Every other filled type gets darker. Correct for a control
on a dark ground; do not "fix" the direction. `outline-inverse` does the same
(`#A9AEB1` → `#F0F0F0` → `#FFFFFF`).

### 4. `inverse` disabled keeps ink text on a `#71767A` fill

3.75:1 — see the contrast table. Disabled controls are exempt from WCAG 2.2 SC 1.4.3, so this
is **not** a finding. Recorded so nobody re-derives it as one.

## Contrast — computed for all 38 states

sRGB relative luminance per WCAG 2.2. **16px Bold is normal text**, not large: the large-text
thresholds start at 18.66px bold, so the 4.5:1 bar applies to the regular button. `button-big`
at 22px Bold **is** large text (3:1 bar). Disabled states are exempt from SC 1.4.3 entirely
and are marked so.

**Two enabled states fail. Both are candidate findings for the maker to file, not for this
ref to resolve:**

| Variant | Measured | Threshold | Verdict |
|---|---|---|---|
| `accent-warm` **default** — `#FFFFFF` on `#FA9441` | **2.24:1** | 4.5:1 | **FAIL** — also below the 3:1 large bar |
| `accent-cool` **hover** — `#FFFFFF` on `#28A0CB` | **3.01:1** | 4.5:1 | **FAIL** at 16px; clears 3:1 only |

Everything else passes, some of it narrowly: `error` default 4.53:1, `base` default 4.59:1,
`accent-warm` hover 4.59:1, `secondary` default 4.61:1, `success` hover 4.63:1. Those are
**passes** — the checker must not round them into findings.

Exempt (disabled), recorded for completeness: `disabled`/`outline` disabled 1.66:1,
`button-big` disabled 1.66:1, `inverse`/`outline-inverse` disabled 3.75:1.

`accent-warm` at 2.24:1 is the more serious of the two — it is the resting state of a
component, and it is the identical arithmetic to the `.alert-info` half of FND-001. Note the
shape of the fix the design already knows: `accent-cool` and `success` solved exactly this
problem with an ink foreground, and `#1B1B1B` on `#FA9441` measures **8.99:1**. That
observation belongs in the finding as a recommendation to design — **not** in the CSS. Rule 4:
build it as designed, flag the conflict.

## Focus is not drawn — apply it anyway, without a finding

The design shows `default` / `hover` / `active` / `disabled` and **no focus state**.

Per [CLAUDE.md](../../../CLAUDE.md), implementation-level accessibility that does not change
the visual design is applied automatically and does **not** generate a finding. A visible
focus indicator is required by WCAG 2.2 SC 2.4.7 and 2.4.11, so the maker **adds one, in the
design's own colours**, drawn from the tokens on this node rather than from a new value. Say
so in the decision log; do not file a finding about its absence.

The same applies to `:hover`/`:active` being expressed as real CSS pseudo-classes rather than
the Figma variant names, to `prefers-reduced-motion`, and to preserving the native `<button>`
semantics OSUI already ships.

## No mode axis observed

One value per variant. No device, breakpoint or theme modes on this node, and the two sizes
are separate component sets rather than a bound size axis — so nothing here varies by mode in
the way `loop/refs/README.md` warns about.

This is now the **third** ref in a row to record "no mode axis". It remains an assumption to
re-test at the first ref that actually specifies responsive behaviour, not a settled property
of the library.

## The white gap

`Base/white` = `#FFFFFF` is a **bound variable on this node** and is the foreground of 19 of
the 38 states. `tok-color-palette` deliberately invented no white — its ref contained none,
and CLAUDE.md's "a credible-looking default is worse than a blank" rule kept it out.

That gap is now closed by evidence: a ref states it. Whether the token lands in
`tokens/colors.css` (extending the palette the ref now justifies) or is consumed from OSUI's
existing `--color-neutral-0` is a **mapping decision** and therefore belongs in
`tokens/outsystems-ui-overrides.css`, per that file's own header. Either way it must not be
written as a bare `#FFFFFF` in the block CSS — that would be a `design-token` finding against
Rule 3.

`Base/ink` `#1B1B1B` needs no such decision: `--color-base-ink` already exists.
