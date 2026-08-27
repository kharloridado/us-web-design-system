# Changelog

All notable changes to this design system are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) in the **0.x** range —
pre-1.0, so token and class renames are expected and are **not** treated as breaking. Bump the
MINOR for a new component or feature tier; bump the PATCH for fixes only.

The version lives in one place: the `version` field in `package.json`. The theme build reads it
and stamps it at the top of `dist/theme.css`, so the file a developer pastes into the ODC Theme
editor self-identifies and matches its entry below. See [`RELEASING.md`](./RELEASING.md) for how
a release is cut.

"Shipped" means merged to `main`. Merging is not the same as delivered: **only board-Approved
items reach an OutSystems build**, and only a human moves an item to Approved.

Use these section headings, in this order, under each version: `Added`, `Changed`,
`Deprecated`, `Removed`, `Fixed`, `Security`. Write entries for the person integrating the
component, not for the person who wrote the commit — say what changed in the rendered result
and what they have to re-paste.

## [Unreleased]

## [0.3.1] — 2026-08-27

### Fixed

- **USWDS button variants no longer render as raw browser buttons.** The button base rule
  matched only `.btn`, while every visual declaration (background, border, padding, radius,
  type) lives on that base and the variants set nothing but `--uswds-button-*` custom
  properties. An ODC Button whose Style property is `uswds-btn--secondary` **without** the
  `btn` base therefore set nine custom properties that nothing read, and fell back to the
  browser's own `2px outset` / `padding: 1px 6px` chrome. On the live `ButtonSpecimen`
  screen that was 14 of 25 buttons.

  The base selector is now `:is(.btn, [class*="uswds-btn--"])`, so a `uswds-btn--*` modifier
  is self-sufficient whether or not whoever placed the widget remembered the base class.
  `:is()` keeps specificity at 0,1,0 — identical to a bare `.btn` — so nothing else about the
  cascade changes. The framework's own modifiers (`.btn-primary`, `.btn-error`, `.btn-large`)
  still require `.btn`; making OutSystems UI's own classes standalone is not this file's job.

  **Re-paste `dist/theme.css`.** No screen edits are needed — this fixes the existing
  widgets in place.

- **Specimen notes on the `ButtonSpecimen` screen ran into the next section heading.** ODC
  emits a Text widget as an inline `<span>`, and inline boxes ignore block margins, so
  `.uswds-btnspec__note`'s `margin-block-end` did nothing. It is now `display: block`.
  **Re-paste `style-guide/odc-button-screen.css`** into that screen's own Style Sheet.


### Added

- **Public Sans is self-hosted** — the design system finally renders in its own face.
  `tokens/font-faces.css` declares five `@font-face` rules (400 / 500 / 700 roman, 400 / 700
  italic) against the Public Sans v2.001 `woff2` now vendored at `vendor/public-sans/`
  (SIL OFL 1.1, so the binaries are committed). `dist/theme.css` gains a
  **Typography / Font faces** section, listed in the Section Index as 3.1.

  **What you have to do, and it is not only a paste:** upload five `woff2` files as
  **Resources** on the app *before* pasting the theme, with exactly these names —
  `PublicSans-Regular.woff2`, `PublicSans-Italic.woff2`, `PublicSans-Medium.woff2`,
  `PublicSans-Bold.woff2`, `PublicSans-BoldItalic.woff2`. A misnamed Resource does not error;
  the app just quietly keeps rendering in the system sans. Full steps in
  `handover/public-sans-font-face.md`.

  The declared family is **`"Public Sans Web"`**, upstream USWDS's own name for the
  self-hosted face, ahead of a plain `"Public Sans"` that still catches a local install.

- **`npm run gen:font-faces`** — generates `tokens/font-faces.css` and `preview/fonts.css`
  from one table, so the theme and the local harness can never declare different faces. The
  preview copy points at the vendored files and is linked after `dist/theme.css`, which is
  what lets the harness render the real face even though the theme's ODC Resource paths
  cannot resolve off-platform.

- **`--letter-spacing-1: 0.025em`** — USWDS's `ls-1` token, minted because `h6` uses it.

### Changed

- **Headings and body now follow the USWDS type roles.** `tokens/outsystems-ui-overrides.css`
  maps the nine-step ramp onto OutSystems UI's own heading slots and sets the weight,
  line-height, tracking and case that OSUI hard-codes rather than reads from a variable.

  **What you have to re-paste:** `dist/theme.css`. Nothing else.

  **What changes in a screen you already built, without you touching it — all of it, app-wide:**

  | Slot | Was | Now |
  |---|---|---|
  | display | 36px / 500 / 1.25 | **48px / 700 / 1.2** |
  | `h1` | 32px / 500 / 1.25 | **40px / 700 / 1.2** |
  | `h2` | 28px / 500 / 1.25 | **32px / 700 / 1.2** |
  | `h3` | 26px / 500 / 1.25 | **22px / 700 / 1.2** |
  | `h4` | 22px / 500 / 1.25 | **16px / 700 / 1.2** |
  | `h5` | 20px / 500 / 1.25 | **15px / 700 / 1.2** |
  | `h6` | 18px / 500 / 1.25 | **13px / 400 / 1.15, UPPERCASE, 0.025em tracking** |
  | `body` | 14px / 1.5 | **16px / 1.62** |

  Two things will surprise you. **`h4` and `h5` get smaller while `h1`/`h2`/display get
  bigger** — USWDS's ramp is far more top-heavy than OutSystems UI's, because its lower
  heading steps are section labels rather than titles; screens laid out against the flatter
  OSUI ramp will re-proportion. And **`h6` is now an uppercase, letter-spaced 13px label**,
  not a small heading — if a screen used `h6` as "a slightly smaller `h5`", use `h5` there.

  Body 14px → 16px moves only the INHERITED default, so it reaches prose, container text and
  table cells. `--font-size-s` is deliberately **not** redefined, so OutSystems UI's 25
  small-variant rules keep their 14px.

  Every number above was measured in headless Chrome on the real cascade, not read off the
  source. Values come from upstream USWDS — `_settings-typography.scss`, `headings.scss`,
  `line-height.scss` and the published token pages — which corroborate the frozen Figma refs
  exactly: all nine `$theme-type-scale-*` pixel values are identical to the nine steps
  measured out of Figma, and every role lands on the step the design's own role column states.

- **`h3` builds Bold 700, departing from the Figma ref's Regular 400** — the one deliberate
  departure, signed off by the brand owner on 2026-08-26 and recorded in `project-context.md`.
  Upstream's `@mixin h3` is bold like `h1`/`h2`/`h4`/`h5`, and `h3` is one of only two steps
  bound to no Figma variable, which is the drift **FND-008** suspected. `h6` is *not* changed
  with it: upstream really does make `h6` Regular + uppercase + `ls-1`, and `ls-1` × 13px =
  0.325px — the ref's own measured tracking, to the third decimal. FND-008 is now
  `resolved (code changed)`.

- **The Live Style Guide typeface test has flipped its expected result.** Its two rows were
  expected to render *identically* while the face was unshipped. They should now **differ**;
  identical rows mean a Resource is missing or misnamed. `build/gen-type-specimen.mjs` also
  had to stop slicing exactly one entry off the font stack — with `"Public Sans Web"` ahead of
  `"Public Sans"`, the control row would still have asked for the face it exists to prove
  absent, making the test unable to fail.

### Fixed

- **`--font-family-base` had no effect at all before this release.** OutSystems UI hard-codes
  a system stack on `html` and reads no variable, so naming a family changed nothing anywhere.
  An `html { font-family: var(--font-family-base) }` rule is what actually switches the app
  over; the token had been inert since it was introduced.


## [0.3.0] — 2026-08-26

First `primitives`-tier release, and the first one that ships block CSS as well as tokens.
Paste `dist/theme.css` — it now carries a **Widget Overrides / Button** section below the
consolidated `:root`.

### Added

- **USWDS buttons** (item `cmp-buttons`, Figma node `1868-83`) — the first `primitives`-tier
  deliverable, and the first block CSS in the project. `src/blocks/button.css` restyles the
  **native** OutSystems UI button; there is no new Block and no Web Component.

  **What you have to re-paste:** `dist/theme.css` (it now carries the button section), and
  nothing else. Full instructions in `handover/uswds-buttons.md`.

  **What changes in a screen you already built, without you touching it:** every Button widget
  re-skins. `Style = Primary` becomes `#005EA2` with a 4px radius and a Bold 16px label; hover
  and active become distinct USWDS colours instead of OutSystems UI's brightness filter; a
  Button with **no Style** now renders as the USWDS blue *outline* button; `Style = Success`
  gets a **dark** label instead of white; `Style = Large` becomes the 22px big button. Buttons
  are no longer a fixed 40px tall — height comes from padding, and no longer changes on tablet
  or phone.

  **What needs an `ExtendedClass`:** the six variants OutSystems UI has no class for —
  `uswds-btn--secondary`, `uswds-btn--accent-cool`, `uswds-btn--accent-warm`,
  `uswds-btn--base`, `uswds-btn--inverse`, `uswds-btn--outline-inverse`.

  **Two judgment calls worth knowing about:** `.btn-cancel` is mapped onto the USWDS neutral
  `base` type (the design draws no "cancel"), and disabled buttons all share one appearance,
  including the six colour variants the design never drew a disabled cell for.

- `--color-white` (`#FFFFFF`) in `tokens/colors.css`. The palette node contained no white and
  correctly invented none; the buttons node binds `Base/white` as the label of 19 of its 38
  states, so the blank is now filled from a ref rather than from a default.

- A keyboard focus ring on buttons — 2px in the design's own ink, white on the two inverse
  variants. The design draws no focus state; this is implementation-level accessibility
  (WCAG 2.2 SC 2.4.7 / 2.4.11) applied without changing the visual design.

### Fixed

- `.btn-success` no longer fails WCAG AA. It was white on `#00A91C` (3.14:1); the design
  specifies ink, which measures 5.49:1. This closes the `.btn` half of
  [#1](https://github.com/kharloridado/us-web-design-system/issues/1) — by fidelity to the
  design, not by a contrast repair. The `.alert-info` / `.alert-success` half of that issue is
  untouched and belongs to `cmp-alert`.

### Known issues

- `accent-warm` buttons ship failing contrast **on purpose** — white on `#FA9441` is 2.24:1,
  which is what the design specifies. Filed as
  [#15](https://github.com/kharloridado/us-web-design-system/issues/15) and awaiting a designer.
  Do not fix this in the ODC theme editor; the next paste would overwrite it.
- Button **width** is unverified until Public Sans is hosted. Nothing in the repo loads the
  face, so the preview measures the fallback's advance width. Height and colour are unaffected.

## [0.2.0] — 2026-08-25

First tagged release. Everything below is already merged to `main`; this cut is what gets
pasted into the ODC theme and what the `Version` line at the top of `dist/theme.css` now
reports.

**Re-paste `dist/theme.css` into the ODC Theme editor to pick this up.** The whole file —
it is one consolidated `:root` block plus its section index, and a partial paste leaves the
palette and the type ramp disagreeing about which release they came from.

### Added

- **Colour palette — 52 tokens** (`--color-*`, item `tok-color-palette`, #2). The full USWDS
  Theme and State palettes: base 7, primary 6, secondary 6, accent-cool 5, accent-warm 5,
  info 5, error 5, warning 5, success 5, disabled 3. Ten of these names are already declared
  by OutSystems UI (`--color-primary`, `--color-secondary`, `--color-error`,
  `--color-warning`, `--color-success`, `--color-info` and their `-light` steps), so pasting
  the theme **re-brands the native widgets that consume them** — that collision is the
  mechanism, not a defect.
- **Font-size ramp — nine steps** (`--font-size-3xs` … `--font-size-3xl`, item
  `tok-font-sizes`, #6). `--font-size-xs` is the one step that overrides a name OutSystems UI
  already ships (12px → **15px**), and 26 real widget rules resolve through it — expect
  visible change there. The other eight names are new.
- **Type family, weights and line-heights** (item `tok-typography`, #9). `--font-family-base`
  names **Public Sans** ahead of the framework's own stack; `--font-weight-regular|medium|bold`
  (400 / 500 / 700); `--line-height-base` 1.62, `--line-height-heading` 1.2,
  `--line-height-heading-tight` 1.15. **Public Sans is not self-hosted yet** — until an
  `@font-face` ships, every one of these declarations resolves to the first available
  fallback and the page renders in the framework's default sans. Declaring the name is not
  shipping the face.
- **Live Style Guide — colour palette specimen** (item `sg-palette-specimen`, #3, #7), plus the
  `PaletteSpecimen` screen in `SandboxKharlo` and the MCP handover runbook that builds it.
  52 chips painted through the live cascade with their hex printed beside them as text, so a
  theme that did not land cleanly is visible rather than inferred.

### Changed

- **`--font-semi-bold` now resolves to 500, not 600** (`tokens/outsystems-ui-overrides.css`).
  This is the single highest-blast-radius line in the release: **33 OutSystems UI rules**
  resolve through it — emphasis weight across buttons, labels, headings, tabs and list items —
  so emphasised text across the whole app gets lighter on publish, not only where a class of
  ours is applied. That is the re-branding working. It is a brand-owner decision (Kharlo
  Ridado, 2026-08-25, PR #9), recorded under "Known signed-off exceptions" in
  `project-context.md`, because this design system has no 600 step for it to land on.
- **`--line-height-base` 1.5 → 1.62** — the placeholder was never sourced from the design;
  1.62 is the ref's measured body value.
- **Removed the template placeholders `--font-size-s|m|l|xl`**, replaced by the real ramp.
  `s` was redundant (OutSystems UI declares its own identical 14px, so its consumers are
  unchanged); `m`/`l`/`xl` had no framework consumers.

### Fixed

- **Handover route corrected: build ODC UI from native widgets, never an HTML literal** (#8).
  `Escape Content = No` does not exist on the ODC reactive Expression widget — Mentor accepts
  the instruction, reports `change_applied: true` with zero validation errors, and the
  published page renders `<div class="…">` as visible text. The palette handover now
  specifies Containers carrying Style Classes, and `handover-map.json` no longer lists any
  `.html` file as a paste target.
- **Every screen uses the module's default Layout block** — read from the module's default
  theme (`LayoutTopMenu` for `SandboxKharlo`), title in the Title placeholder, everything
  else in Content. A layout-less screen looks identical in a cropped screenshot, which is how
  one shipped.


[Unreleased]: https://github.com/kharloridado/us-web-design-system/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/kharloridado/us-web-design-system/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/kharloridado/us-web-design-system/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kharloridado/us-web-design-system/releases/tag/v0.2.0
