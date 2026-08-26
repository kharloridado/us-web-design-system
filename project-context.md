# Project Context

The human prose companion to [`project.config.json`](./project.config.json). Fill it in at
kickoff and keep it current — the loop reads it.

**This file does not restate machine values.** The class prefix, JS namespace, design-system
name, ODC theme module, repo, Figma file, findings routing, and the conventions (spacing
base, grid, breakpoints, default component size) all live in `project.config.json`, which is
the single source of truth that the build scripts and the agents read. Two files that both
"own" the prefix is exactly how the previous project ended up shipping two configs that
disagreed about it for its entire life. Values there; context, judgment and history here.

## Identity

- Customer: `US Federal Government`
- Project: `USWDS`
- Design system: `US Web Design System`
- Repo: `kharloridado/us-web-design-system`
- Start date: `<YYYY-MM-DD>`
- Target environment: ODC (if this project is O11, change it here **and** in `project.config.json`)

## Brand source of truth

- Brand guidelines: `design/brand-guidelines.md`
- Figma library: `design/figma-links.md` (the file key and URL are also in `project.config.json`)
- **Designer / brand owner** — the human every finding goes back to: `<name / channel>`
- **Developer** — the human every handover Task is assigned to: `<name>`

Findings are a conversation, not a filing exercise. If nobody is named here, a finding has
nowhere to land and flag-don't-fix quietly becomes flag-and-forget.

## Framework reference — OutSystems UI

- **Source of truth for framework conventions:** [`OutSystems/outsystems-ui`](https://github.com/OutSystems/outsystems-ui),
  vendored read-only as a git submodule at `vendor/outsystems-ui`. **Pin it to the
  OutSystems UI version that your target ODC environment actually runs**, and record the
  version and the date it was confirmed:
  - Pinned version: `<vX.Y.Z>` — confirmed against the target environment on `<YYYY-MM-DD>`

  We build *on top of* the framework and never edit it (hard rule 1). Run `git submodule
  update --init` after cloning.

- **Brand inheritance — how the framework ends up wearing the customer's brand.** OutSystems
  UI declares its entire design-token system as `:root` custom properties (the foundations
  layer of the submodule's SCSS); its components resolve `var(--color-…)`, `var(--space-…)`,
  `var(--border-radius-…)` and `var(--shadow-…)` rather than literal values. So we do not
  restyle the framework — we **redefine its variables**. `tokens/outsystems-ui-overrides.css`
  points every one of those framework variables at this project's own tokens, and it is
  imported **last** in `tokens/index.css` so its `:root` block wins. Cover, at minimum:
  colour (a full retint), spacing (a 1:1 name remap), border-radius, and shadow/elevation.

  The result is the whole point of the approach: every native widget renders in the
  customer's brand with **no framework edits and no hard-coded values**, and an OutSystems UI
  upgrade does not undo the branding. This is also why restyling a native widget by
  overriding its own classes always beats building a parallel component system.

## Known signed-off exceptions

Approved deviations from the rules: accessibility conflicts the brand owner has accepted,
off-palette colours that are deliberate, values the designer has confirmed are correct as
drawn.

**Record them here.** The loop reads this file, so an exception written down here is
respected. A decision that only lives in a meeting note or a Slack thread will be re-flagged
as a bug on every run, forever — and the developer will keep re-litigating a settled
question.

One row per decision. Cite the finding ID or issue number it settles, who signed it off, and
when; an exception with no owner and no date is indistinguishable from an oversight.

| Exception | Applies to | Rationale | Signed off by | Date | Finding / issue |
| --- | --- | --- | --- | --- | --- |
| **`--font-weight-medium: 500` exists although no ref states it.** Node `63-49` (Typography) contains only weights 400 and 700. The token was removed as unsourced during `tok-typography`, then restored on this decision. It is a brand-owner value, not a design-derived one. | `tokens/typography.css` | It is the value `--font-semi-bold` is mapped to (row below). Without it the override has nothing to point at. | Kharlo Ridado | 2026-08-25 | [#9](https://github.com/kharloridado/us-web-design-system/pull/9) |
| **OutSystems UI's `--font-semi-bold` is re-pointed from 600 to the medium weight (500).** | `tokens/outsystems-ui-overrides.css` | `--font-semi-bold` has **33** consumers — OSUI's emphasis weight across buttons, labels, headings, tabs, list items — and this design system has no 600 step, so the framework default is off-brand by construction. It had to land somewhere. 500 rather than 700 keeps a step between "emphasised" and "heading"; 700 would flatten all 33 roles to full bold. Node `63-49` is a prose type page and states nothing about widget roles, so this is a mapping decision, not a translation. Expect app-wide visual change on publish. | Kharlo Ridado | 2026-08-25 | [#9](https://github.com/kharloridado/us-web-design-system/pull/9) |
| **Type ROLES are sourced from upstream USWDS documentation, not from a frozen Figma ref.** Which ramp step is h1, what weight a heading carries, and what body's size and line-height are, all come from `designsystem.digital.gov` and the `uswds/uswds` repo, read 2026-08-26. | `tokens/outsystems-ui-overrides.css` — the `--font-size-h1…h6` / `--font-size-display` mapping and the `html` / `body` / `h1-h5` / `h6` rules | The ref (node `1892-7566`) prints a role column, but a specimen page makes claims about the design system, not about OutSystems UI's slots — nothing in Figma knows what `--font-size-h4` is. Upstream defines the roles and is this design system's actual source. The two corroborate: all nine published `$theme-type-scale-*` px values are identical to the nine steps measured out of Figma, and every role lands on the step the design's own role column states. | Kharlo Ridado | 2026-08-26 | resolves FND-008; corroborates FND-005 |
| **h3 builds Bold 700, although the Figma ref measures it Regular 400.** The one place the type build departs from the frozen ref. | `tokens/outsystems-ui-overrides.css`, the `h1…h5` rule | Upstream's `@mixin h3` is `fw("bold")`, exactly like h1/h2/h4/h5; the community Figma kit's Regular h3 is a kit deviation, and it is one of the only two steps bound to no Figma variable — precisely the drift FND-008 suspected. **h6 is NOT changed with it**: upstream really does make h6 Regular + uppercase + `ls-1` tracking, and `ls-1` × 13px = 0.325px, the ref's own measured tracking. Two steps, one investigation, opposite answers. Reverting h3 is one line, documented in place. | Kharlo Ridado | 2026-08-26 | FND-008 |
| **Body text moves from OutSystems UI's 14px/1.5 to 16px/1.62 app-wide.** | `tokens/outsystems-ui-overrides.css`, the `body` rule | USWDS's guidance is explicit — "use at least an effective size of 16px (font-size 5)" for most text — and `$theme-body-font-size` is the 16px step. OSUI's 14px default is below that bar for running text. Only the INHERITED default moves; `--font-size-s` is deliberately left at 14px so OSUI's 25 small-variant rules are untouched. Expect visible change wherever text inherits rather than sets its own size. | Kharlo Ridado | 2026-08-26 | n/a |
| **Public Sans is self-hosted from the repo, so its binaries ARE committed** — an explicit exception to `vendor/LICENSING.md` §1. | `vendor/public-sans/` | That rule targets **licensed proprietary** faces, where redistributing a binary is a breach. Public Sans v2.001 is SIL OFL 1.1, which permits redistribution; `OFL.txt` travels with the files as the licence requires. Keeping them out would buy nothing and would leave a fresh clone unable to build a truthful preview. | Kharlo Ridado | 2026-08-26 | n/a |

> **Both rows are open to evidence, not closed.** Neither is derived from a ref, so the first
> component ref that states a real weight against a real widget is the first real test of
> them. `cmp-buttons` (node `1868-83`) is next in the queue and will state a button label
> weight directly. If it disagrees with 500, that is a **finding against these rows** — raise
> it and bring it back here, rather than quietly re-pointing the token or deleting the
> exception.

The machine-readable sibling of this table is `knownFalsePositiveClasses` in
`project.config.json` — a class of finding that has been adversarially refuted and must
never be filed again.

## Notes

Project-specific context the loop and the next developer should know: brand quirks, naming
oddities, provider components in play (date-picker or dropdown providers), environment
constraints, anything surprising about how the Figma library is structured.

`<notes>`
