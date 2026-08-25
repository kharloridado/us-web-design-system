# Spec of record — `tok-typography` (item 3)

**Frozen 2026-08-25.** Figma file `tJnXUZbEL3fRWG7h1z0ij7`, node
[`63-49`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=63-49&m=dev)
("Typography"). Render: `figma.png` (1248×1441). Values: `variables.json`.

This ref is the authority for the build. Do not re-pull live Figma mid-build; if this ref is
wrong, re-freeze it and say so, the way `tok-font-sizes` did.

## Scope — what this item owns

`tokens/typography.css` is **shared by two items**. The nine-step size ramp is
`tok-font-sizes` (node `1892-7566`) and is **final and already built**. This item owns the
declarations that file still carries as template placeholders:

- `--font-family-base`
- the weight scale
- line-height

**Sizes are out of scope here.** This node states sizes too, and they must not be re-emitted
or "reconciled" — the ramp is owned elsewhere and a second source for one value is how the
two drift.

## What the ref actually states

Six of the eight Prose steps are **bound Figma variables**, read with `get_variable_defs`.
Two — `h3` and `h6` — expose **no variable at all**, and were read from the sample nodes'
own text styles with `get_design_context`.

**This distinction is load-bearing.** The `tok-font-sizes` ref was first sourced from layer
names and printed labels, and shipped a wrong value because a mislabelled row agrees with
itself. Layer names and callout text on this node are recorded in `variables.json` under
`_design_annotations` as **provenance only** — they are USWDS utility-class names, not
measurements.

| Step | Family | Style | Weight | Size | Line-height | Source |
|---|---|---|---|---|---|---|
| body  | Public Sans | Regular | 400 | 16 | **1.62** | variable |
| intro | Public Sans | Regular | 400 | 22 | **1.62** | variable |
| h1    | Public Sans | Bold    | 700 | 40 | **1.2**  | variable |
| h2    | Public Sans | Bold    | 700 | 32 | **1.2**  | variable |
| h3    | Public Sans | **Regular** | **400** | 22 | **1.2** | measured (`12:115`) |
| h4    | Public Sans | Bold    | 700 | 16 | **1.2**  | variable |
| h5    | Public Sans | Bold    | 700 | 15 | **1.2**  | variable |
| h6    | Public Sans | **Regular** | **400** | 13 | **1.15** | measured (`12:119`) |

`h6` additionally carries `letter-spacing: 0.325px` and `text-transform: uppercase`.

### One family, two weights, three line-heights

- **Family:** `Public Sans` — every step, no exceptions. The design names it, so unlike
  `tok-font-sizes` (whose ref named no face) a family **can** be emitted here.
- **Weights:** only **400** and **700** appear anywhere on this node.
- **Line-heights:** **1.62** (body/intro), **1.2** (h1–h5), **1.15** (h6 only).

## Two conflicts to carry into the build — flag, don't resolve

Both are recorded here so the build does not silently normalise them.

### 1. `h3` and `h6` are Regular, not Bold

Every other heading step is Bold 700. `h3` (22px) and `h6` (13px) measure **Regular 400**.
That is what the design says, so **build it**, but it is unusual enough to be worth a
`consistency` finding back to design — it may be intentional (USWDS annotates them
`font-sans-*` while h4/h5 get `font-heading-*`, which are different type ramps upstream) or
it may be that the two unbound steps drifted precisely because nobody bound them to a
variable.

Note the correlation: **the two steps with no bound variable are exactly the two that break
the weight pattern.** That is suggestive, not proof.

### 2. `--font-weight-medium: 500` has no source in this ref

`tokens/typography.css` currently declares `--font-weight-medium: 500` as a template
placeholder. **Nothing on this node uses a 500 weight.** Under
[CLAUDE.md](../../../CLAUDE.md)'s rule that a credible-looking default is worse than a blank,
it does not survive this item on the design's authority.

It is referenced in-repo by `style-guide/odc-palette-screen.css`
(`.uswds-specimen__ramp-title`), which carries an explicit `var(--font-weight-medium, 500)`
fallback and so renders identically with the token gone.

## No mode axis observed

One value per step; no device, breakpoint or theme variants on this node. Treat as an
**assumption to re-test** at the first component ref that specifies type — the same standing
caveat `tok-font-sizes` recorded — not as settled.

## Not in this ref, on purpose

The node also shows **text-link colours** (`usa-link`, `usa-link:visited`, `usa-link--light`,
annotated `color-primary` / `color-violet-70v` / `color-primary-light`) and **margin
utilities** (`margin-top-1em`, `margin-top-05em`, `margin-top-105em`, `measure-6`).

- The link colours belong to the colour/semantic-role layer, not here. Note that
  `Link/link-visited` = `#562B97` is **not** in the 52-colour palette built by
  `tok-color-palette` — a gap for whichever item owns link roles, not something to invent a
  token for now.
- The margin and measure utilities are spacing/layout, not typography tokens.
