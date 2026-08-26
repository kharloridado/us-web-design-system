# Ref — `tok-font-sizes` (Font sizes)

**This file is the spec of record.** The maker builds to it; the checker judges against it.
Neither has Figma access — whatever is frozen here is all there is.

## Provenance

| Field | Value |
|---|---|
| Figma file key | `tJnXUZbEL3fRWG7h1z0ij7` |
| Node id | `1892-7566` |
| Node name | Font sizes |
| Pulled | 2026-08-20 |
| Source | `get_design_context` per sample node — the **text style**. See the section below: the first freeze used text-layer names and was wrong. |
| Render | `figma.png` — 595 × 460, the full Font sizes page |
| Variables | `variables.json` — only 2, and **neither is a font size** |

**Staleness check:** if this file key ever differs from `project.config.json → figma.fileKey`,
this ref is stale (`needs-re-ref`).

## How these values were obtained — READ THIS, IT WAS WRONG ONCE

The sizes are **not Figma variables**. `get_variable_defs` on this node returns two colours and
nothing else, because the page's sizes are literal text styles.

**Corrected 2026-08-20, after the checker caught a bad row.** The first freeze of this ref took the
values from the node's **text-layer names** (`get_metadata` reports layers literally named
`13px`, `42px`, …) and claimed the rendered `figma.png` was an independent confirmation. **That
claim was false.** The layer name and the label printed in the render are *the same design-authored
string*; neither measures a glyph, so they fail together when a designer mislabels a row. That is
exactly what had happened.

Every row below is now taken from the **actual text style** via `get_design_context` on each
sample's own node — the authoritative source, and the only one that reports what the type is
rather than what the page says it is. Eight rows were confirmed unchanged; **`2xl` was 40px, not the
42px its label claims** (see the finding below).

| Token | Sample node | Text style (authoritative) | Layer name / printed label |
|---|---|---|---|
| `3xs` | `1892:7624` | 13px | 13px ✅ |
| `2xs` | `1892:7625` | 14px | 14px ✅ |
| `xs` | `1892:7626` | 15px | 15px ✅ |
| `sm` | `1892:7627` | 16px | 16px ✅ |
| `md` | `1892:7628` | 17px | 17px ✅ |
| `lg` | `1892:7629` | 22px | 22px ✅ |
| `xl` | `1892:7630` | 32px | 32px ✅ |
| `2xl` | `1892:7631` | **40px** | 42px ❌ **design mislabels its own row** |
| `3xl` | `1892:7632` | 48px | 48px ✅ |

**How it was caught, and why that matters for the next ref.** The checker had no Figma access. It
decoded `figma.png` and measured the ink of each sample, fitting width against the stated size:
k = 5.51 across eight rows within ±0.5%, and `2xl` at 5.21 — a 5.4% outlier. Ink height agreed
independently (30px measured; 31.5 expected at 42px, 30.0 at 40px). It returned BLOCKED rather
than FAIL, correctly: the maker had built the spec faithfully, and the defect was in this file.

**The lesson for freezing any type ref: a layer name is not a measurement.** Pull the text style.

Also recorded from the same pull, for item 3 (`tok-typography`, node `63-49`) rather than this one:
every sample is **Public Sans Regular**, weight normal, `leading: normal`.

## Item

| Field | Value |
|---|---|
| Tier | `foundations` |
| Target artifact | `tokens/typography.css` — the **size ramp only** |
| Section header | The file already declares `@section Typography / Type`; keep it |
| **Shares its file with item 3** | `tok-typography` (node `63-49`) owns families, weights and line-heights in the *same* file. This item must not emit those, and must not delete the placeholders item 3 will replace. |

## Key values — the nine-step size ramp

Read straight from the design's own table, in its order.

| Token | USWDS scale index | Size | Role stated by the design |
|---|---|---|---|
| `3xs` | 2 | **13px** | h6 |
| `2xs` | 3 | **14px** | *(none — the design prints `//`)* |
| `xs` | 4 | **15px** | h5 |
| `sm` | 5 | **16px** | h4 + body |
| `md` | 6 | **17px** | *(none — the design prints `//`)* |
| `lg` | 9 | **22px** | h3 + intro |
| `xl` | 12 | **32px** | h2 |
| `2xl` | 14 | **40px** | h1 |
| `3xl` | 15 | **48px** | Display |

## Observations recorded at freeze time

Properties of the ref, not instructions.

1. **The scale index column is sparse and that is deliberate.** The indices run
   2, 3, 4, 5, 6, 9, 12, 14, 15 — 7, 8, 10, 11 and 13 are absent. This is upstream USWDS's own
   type scale, of which the design system selects nine steps. **Do not interpolate the gaps** and
   do not renumber the ramp to be contiguous; the index is provenance, not a sequence to complete.

2. **Two steps carry no heading role.** `2xs` (14px) and `md` (17px) print `//` in the role
   column, meaning no heading maps to them. They are still real, in-scope sizes — the absence is
   of a *role*, not of the size.

3. **A role is not a size token.** The right-hand column maps sizes onto h1–h6, body, intro and
   Display. That mapping is a **semantic** concern and belongs to the semantic-role layer or to
   item 3, not here. This item emits the size ramp; it does not emit `--font-size-h1`.

4. **No mode axis was observable** — one value per step, no device or breakpoint variants on this
   node. But `tokens/typography.css` warns in its own header that a type ramp's device axis is
   frequently invisible on the type page and only appears in a component's example frames. Treat
   the single-value reading as an **assumption to re-test** at the first component ref that
   specifies type, not as settled. If it turns out to be device-bound, these become per-breakpoint
   tokens and this ref is stale.

5. **The ref states no line-heights and no font family.** The samples all read "Tallahassee" in
   what is visually one family, but the page does not name it. Both belong to item 3 (`63-49`).
   Emitting a family or a line-height from this ref would be inventing a value the design did not
   state here.

6. **Sizes are stated in `px`.** The design says `13px`, not `0.8125rem`. Any conversion to a
   relative unit is a decision that changes behaviour under user font scaling, and must be
   declared and justified rather than done silently.

---

## Baseline re-judged 2026-08-26 — collateral from `cmp-buttons`

`npm run gate:regression` failed on this item's baseline after
[#16](https://github.com/kharloridado/us-web-design-system/pull/16) merged. Three probes moved
(x2 viewports = 6 regressions). All three are the intended effect of the buttons item, judged
here rather than silently re-recorded.

### 1. `collateral / .btn (base)` — fontSize 14px → **16px**, height 40 → **38.39**

**This probe was named `(base, must be unchanged)`, and that assertion is now retired.** It was
a correct tripwire when this item shipped: nothing had licence to restyle the base button, and
14px/40px was OutSystems UI's own inherited default. `cmp-buttons` is precisely the item that
does have that licence — its ref states 16px Bold with height derived from padding
(2 + 10 + 14.4 + 10 + 2 = 38.4). The tripwire fired correctly and its premise expired.

The probe is **kept**, not deleted — `.btn` base geometry is still worth watching — but renamed
so the record stops carrying a claim that is no longer true.

### 2. `collateral / .btn.btn-small` — lineHeight 15px → **13.5px**

`.btn` now declares `line-height: 0.9` from the buttons ref, and 15px x 0.9 = 13.5px.
`.btn-small` keeps its own 15px `font-size` and its 32px `height` — both unchanged here — so the
size this item owns is intact. Only the leading inside that fixed box moved.

### 3. `overflow / .btn.btn-small` — clientHeight 30 → **28**

Same cause, and the part that matters is unchanged: **`clips_x: false`, `clips_y: false`**. The
probe exists to prove the 12px → 15px retint of `--font-size-xs` (register entry FND-007) does
not clip real content in the framework's small widgets. It still does not. The inner box is 2px
shorter because the line box is 1.5px shorter top and bottom; nothing overflows.

### Not affected

`.badge-small`, `.tag-small`, `.avatar-small`, `.validation-message`, `.breadcrumbs-item .icon`,
`.form-control.input-small` and the `.font-size-xs` utility are all byte-identical. The buttons
item reached the button and nothing else — which is what a scoped restyle should look like.
