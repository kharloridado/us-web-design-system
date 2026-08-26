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


[Unreleased]: https://github.com/kharloridado/us-web-design-system/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/kharloridado/us-web-design-system/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kharloridado/us-web-design-system/releases/tag/v0.2.0
