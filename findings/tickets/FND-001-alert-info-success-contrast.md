# FND-001 — `.alert-info` and `.alert-success` fail WCAG 2.1 AA under the USWDS palette

`[node:287-98]`

| Field | Value |
|---|---|
| Type | accessibility (a11y/contrast) |
| Severity | high |
| Raised by | `@outsystems-loop:checker`, item `tok-color-palette`, 2026-08-20 |
| Disposition | filed |
| Status | open — awaiting designer / brand owner |

## Location

- **Design:** Figma `tJnXUZbEL3fRWG7h1z0ij7` node `287-98` (Colors) → `Info/info` `#00BDE3`, `Success/success` `#00A91C`
- **Code:** `tokens/colors.css` → `--color-info`, `--color-success`
- **Rendered by:** `preview/vendor/outsystems-ui/outsystems-ui.css:6953-6964`

## Observed (as designed)

The OutSystems UI `.alert` rule sets a **white** foreground, and the state modifiers take their
fill from the base colour token:

```css
.alert         { color: var(--text-color-neutral-0, var(--color-neutral-0)); }  /* white */
.alert-info    { background-color: var(--background-color-info,    var(--color-info)); }
.alert-success { background-color: var(--background-color-success, var(--color-success)); }
.alert-warning { background-color: var(--background-color-warning, var(--color-warning));
                 color: var(--text-color-neutral-10, var(--color-neutral-10)); }  /* dark */
```

Note the framework **already special-cases `warning`** to a dark foreground, and does not do so
for `info` or `success`.

Measured in headless Chrome against real `.alert-*` markup under the full cascade (OutSystems UI
base + `dist/theme.css`), not computed from source:

| Widget | Foreground | Background | Ratio | AA normal (4.5:1) | AA large (3:1) |
|---|---|---|---|---|---|
| `.alert-info` | `#FFFFFF` | `#00BDE3` | **2.24:1** | ✗ fail | ✗ fail |
| `.alert-success` / `.btn-success` | `#FFFFFF` | `#00A91C` | **3.14:1** | ✗ fail | ✓ pass |
| `.alert-error` | `#FFFFFF` | `#D54309` | 4.53:1 | ✓ pass (narrowly) | ✓ pass |
| `.alert-warning` | `#101213` | `#FFBE2E` | 11.32:1 | ✓ pass | ✓ pass |

This needs **no developer opt-in**: it is what the native Alert widget renders once the theme is
applied. Alerts are status components, so the failure lands on exactly the content a user most
needs to read.

## Rule violated

WCAG 2.1 SC 1.4.3 Contrast (Minimum) — 4.5:1 for normal text, 3:1 for large text.
`info` fails both thresholds; `success` fails the normal-text threshold.

## Recommendation (for design / brand owner)

Every proposed value below was **recomputed before being proposed**. Both options pass AA.

**Option A — dark foreground on info/success alerts.** Mirrors the framework's own existing
`.alert-warning` treatment, and is closer to how upstream USWDS uses these colours. Preserves the
brand hue exactly.

| Pair | Ratio |
|---|---|
| `--color-base-ink` `#1B1B1B` on `#00BDE3` | **7.70:1** ✓ |
| `--color-base-ink` `#1B1B1B` on `#00A91C` | **5.49:1** ✓ |

**Option B — keep white text, re-point the fill at the `-darker` step** via the framework's
first-choice hook (`--background-color-info` / `--background-color-success`). Preserves the
framework's white-on-fill pattern.

| Pair | Ratio |
|---|---|
| `#FFFFFF` on `--color-info-darker` `#2E6276` | **6.72:1** ✓ |
| `#FFFFFF` on `--color-success-darker` `#446443` | **6.67:1** ✓ |

**What was built: faithfully, as designed. No hex was altered.** The palette in
`tokens/colors.css` matches the Figma ref byte-for-byte (52/52 measured).

## Implementation note

The remedy does **not** belong in `tokens/colors.css` — that layer is primitives and is correct.
It lands in the semantic-role / `outsystems-ui-overrides` item, or in the Alert item
(`loop/goal.md` #7, node `1879-1235`) once its ref states the intended foreground/background
pairing.

Until a ruling lands, the faithful build stands.

## Why this was raised when the swatch-contrast candidate was not

The Colors ref specifies swatches only and states no foreground/background pairings, so a
contrast finding *against the ref itself* would have to invent a pairing the design never
specified — the manufactured-finding failure mode this project has been burned by before.

This finding is categorically different: the pairing is **declared by the framework**, and it was
**measured on rendered markup** rather than inferred. That is what let it survive the adversarial
challenge.
