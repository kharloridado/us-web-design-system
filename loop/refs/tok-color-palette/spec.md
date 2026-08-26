# Ref — `tok-color-palette` (Colors)

**This file is the spec of record.** The maker builds to it; the checker judges against it.
Neither has Figma access — whatever is frozen here is all there is. Do not consult live Figma.

## Provenance

| Field | Value |
|---|---|
| Figma file key | `tJnXUZbEL3fRWG7h1z0ij7` |
| Node id | `287-98` |
| Node name | Colors |
| Pulled | 2026-08-20 |
| Pulled by | orchestrator (subagents have no Figma MCP access) |
| Source | `get_variable_defs` + `get_screenshot` |
| Render | `figma.png` — 624 × 661, the full Colors page |
| Variables | `variables.json` — 52, values verified byte-for-byte against the raw MCP response |

**Staleness check:** if this file key ever differs from `project.config.json → figma.fileKey`,
this ref is stale (`needs-re-ref`) and neither the maker nor the checker may trust it.

## Item

| Field | Value |
|---|---|
| Tier | `foundations` |
| Target artifact | `tokens/colors.css` (replaces the template's placeholder palette) |
| Section header | The file already declares `@section Colors / Primitives`; keep it — `index.css` has no second table to sync |
| Downstream | 15 components will consume these. A wrong value here cascades into all of them, which is why the run stops at `after_tokens`. |

## Key values — the 52 palette variables

The design groups them into a **Theme palette** and a **State palette**, in that order on the page.
Values are given light → dark within each ramp, matching the swatch order in `figma.png`.

### Theme palette

| Ramp | Variable | Value |
|---|---|---|
| Base | `Base/base-lightest` | `#F0F0F0` |
| Base | `Base/base-lighter` | `#DCDEE0` |
| Base | `Base/base-light` | `#A9AEB1` |
| Base | `Base/base` | `#71767A` |
| Base | `Base/base-dark` | `#565C65` |
| Base | `Base/base-darker` | `#3D4551` |
| Base | `Base/base-ink` | `#1B1B1B` |
| Primary | `Primary/primary-lighter` | `#D9E8F6` |
| Primary | `Primary/primary-light` | `#73B3E7` |
| Primary | `Primary/primary` | `#005EA2` |
| Primary | `Primary/primary-vivid` | `#0050D8` |
| Primary | `Primary/primary-dark` | `#1A4480` |
| Primary | `Primary/primary-darker` | `#162E51` |
| Secondary | `Secondary/secondary-lighter` | `#F8DFE2` |
| Secondary | `Secondary/secondary-light` | `#F2938C` |
| Secondary | `Secondary/secondary` | `#D83933` |
| Secondary | `Secondary/secondary-vivid` | `#E41D3D` |
| Secondary | `Secondary/secondary-dark` | `#B51D09` |
| Secondary | `Secondary/secondary-darker` | `#8B1303` |
| Accent cool | `Accent cool/accent-cool-lighter` | `#E1F3F8` |
| Accent cool | `Accent cool/accent-cool-light` | `#97D4EA` |
| Accent cool | `Accent cool/accent-cool` | `#00BDE3` |
| Accent cool | `Accent cool/accent-cool-dark` | `#28A0CB` |
| Accent cool | `Accent cool/accent-cool-darker` | `#07648D` |
| Accent warm | `Accent warm/accent-warm-lighter` | `#F2E4D4` |
| Accent warm | `Accent warm/accent-warm-light` | `#FFBC78` |
| Accent warm | `Accent warm/accent-warm` | `#FA9441` |
| Accent warm | `Accent warm/accent-warm-dark` | `#C05600` |
| Accent warm | `Accent warm/accent-warm-darker` | `#775540` |

### State palette

| Ramp | Variable | Value |
|---|---|---|
| Info | `Info/info-lighter` | `#E7F6F8` |
| Info | `Info/info-light` | `#99DEEA` |
| Info | `Info/info` | `#00BDE3` |
| Info | `Info/info-dark` | `#009EC1` |
| Info | `Info/info-darker` | `#2E6276` |
| Error | `Error/error-lighter` | `#F4E3DB` |
| Error | `Error/error-light` | `#F39268` |
| Error | `Error/error` | `#D54309` |
| Error | `Error/error-dark` | `#B50909` |
| Error | `Error/error-darker` | `#6F3331` |
| Warning | `Warning/warning-lighter` | `#FAF3D1` |
| Warning | `Warning/warning-light` | `#FEE685` |
| Warning | `Warning/warning` | `#FFBE2E` |
| Warning | `Warning/warning-dark` | `#E5A000` |
| Warning | `Warning/warning-darker` | `#936F38` |
| Success | `Success/success-lighter` | `#ECF3EC` |
| Success | `Success/success-light` | `#70E17B` |
| Success | `Success/success` | `#00A91C` |
| Success | `Success/success-dark` | `#4D8055` |
| Success | `Success/success-darker` | `#446443` |
| Disabled | `Disabled/disabled-light` | `#E6E6E6` |
| Disabled | `Disabled/disabled` | `#C9C9C9` |
| Disabled | `Disabled/disabled-dark` | `#ADADAD` |

## Observations recorded at freeze time

These are properties of the ref, not instructions. They exist so the checker judges the same
facts the maker saw.

1. **No mode axis was exposed.** `get_variable_defs` returned exactly one value per variable, so
   nothing here is size-, device- or theme-bound as pulled. These are therefore single tokens,
   not per-size tokens. If a mode axis appears upstream later, this ref is stale.

2. **`Accent cool/accent-cool` and `Info/info` are both `#00BDE3`.** Two distinct semantic names
   resolving to one literal is deliberate in the source design system, not a duplicate to
   collapse. Emit both tokens. Aliasing one to the other would silently couple them, so a future
   change to one would move the other.

3. **The ref specifies swatches only — no foreground/background pairings.** The Colors page shows
   colour chips with black label text beneath them, on white. It does **not** state which colours
   carry text, or on what. Contrast is therefore **not judgeable from this ref**: a WCAG finding
   raised here would have to invent a pairing the design never specified, which is exactly the
   manufactured-finding failure mode the loop exists to avoid. Contrast becomes judgeable when a
   component ref states a real pairing (button fill vs label, alert background vs body text) —
   raise it then, against that usage.

4. **Ramp naming is not uniform across families.** `Base` runs `lightest → ink` (7 steps, no
   `vivid`); `Primary` and `Secondary` carry a `vivid` step and no `lightest`; the accents and
   the state ramps run `lighter → darker` (5 steps); `Disabled` has only 3. Preserve the source
   names exactly. Normalising them into a synthetic uniform scale would break the mapping back
   to the design and to upstream USWDS.

5. **`base-ink` is the darkest Base step and is named for its role, not its position.** It is
   `#1B1B1B`, the design's body-text colour. Keep the name.

---

## Baseline re-judged 2026-08-26 — collateral from `cmp-buttons`

`npm run gate:regression` failed on this item's baseline after
[#16](https://github.com/kharloridado/us-web-design-system/pull/16) merged. The comparator has
no `--update` flag on purpose — a refreshed baseline is a *judged* artifact — so both changed
probes are judged here and the record says why.

**Neither is a defect. Both are the intended, traceable effect of the buttons item.**

### 1. `themeRootColorCount` 52 → **53**

`--color-white: #FFFFFF` was added to `tokens/colors.css`. This ref contains no white and
correctly invented none; the buttons ref (node `1868-83`) binds `Base/white` as the foreground
of 19 of its 38 states, so the blank was filled from evidence. See the AMENDED note in the
header of `tokens/colors.css`.

The cascade invariant this probe actually guards is **unchanged**:
`themeOrderedAfterOsui: true`, `rootColorRedefinitionsAfterTheme: 0`, `offenders: []`. Only the
count moved, and it moved for a reason recorded in the file it counts.

### 2. `Button / success` — white → ink, contrast **3.14 → 5.49**

This is the `.btn` half of **FND-001** (#1), and it landed as *fidelity*, not as a contrast
repair: node `1868-83` binds `Base/ink` as the label of `Type=success, State=default`. The
design specifies the dark foreground; we did not choose it to satisfy WCAG.

**What did NOT change is the load-bearing part of this probe.** `Alert / info` is still
**2.24:1** and `Alert / success` is still **3.14:1** — confirming the buttons item touched the
button and left the Alert widget alone, which is exactly the boundary FND-001 draws between
`cmp-buttons` and `cmp-alert` (row 7, not yet built). Issue #1 stays open for that half.

Every other pair in the probe is byte-identical.
