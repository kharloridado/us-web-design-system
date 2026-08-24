# FND-005 — The Font sizes page labels the `2xl` row `42px`, but its sample is styled `40px`

`[node:1892-7566]`

| Field | Value |
|---|---|
| Type | consistency |
| Severity | medium |
| Raised by | `@outsystems-loop:checker` (detection) + orchestrator (confirmation), item `tok-font-sizes`, 2026-08-20 |
| Disposition | filed |
| Status | open — awaiting designer |

## Location

- **Design:** Figma `tJnXUZbEL3fRWG7h1z0ij7`, node `1892-7566` (Font sizes), the `2xl` row
  - the printed label and the layer name: `1892:7591`-adjacent text layer named `42px`
  - the sample it describes: node `1892:7631`, text style **40px**
- **Code:** `tokens/typography.css` → `--font-size-2xl`

## Observed (as designed)

The Font sizes page documents a nine-step ramp. For the `2xl` step (USWDS scale index 14, mapped
to `h1`), the page **prints `42px`** and its text layer is **named `42px`** — but the "Tallahassee"
sample on that row is actually **styled `40px`**.

Verified from the authoritative source, `get_design_context` on each sample's own node:

| Token | Scale index | Sample node | **Text style** | Printed label |
|---|---|---|---|---|
| `3xs` | 2 | `1892:7624` | 13px | 13px ✅ |
| `2xs` | 3 | `1892:7625` | 14px | 14px ✅ |
| `xs` | 4 | `1892:7626` | 15px | 15px ✅ |
| `sm` | 5 | `1892:7627` | 16px | 16px ✅ |
| `md` | 6 | `1892:7628` | 17px | 17px ✅ |
| `lg` | 9 | `1892:7629` | 22px | 22px ✅ |
| `xl` | 12 | `1892:7630` | 32px | 32px ✅ |
| **`2xl`** | **14** | **`1892:7631`** | **40px** | **42px ❌** |
| `3xl` | 15 | `1892:7632` | 48px | 48px ✅ |

**Eight of nine rows are internally consistent. Only `2xl` disagrees with itself.**

### How it was detected

Worth recording, because no amount of reading the page would have found it. The loop's checker has
no Figma access, so it decoded the exported render and measured the **ink** of every sample,
fitting rendered width against each row's stated size:

```
fitted k = 5.5100 across the eight undisputed rows, all within ±0.5%
2xl      = 5.2143                                   a 5.4% outlier
measured width 219px   ·   predicted at 42px = 231.4   ·   predicted at 40px = 220.4
```

Ink **height** agreed independently: 30px measured, against 31.5 expected at 42px and 30.0 at 40px.
Two orthogonal dimensions, so this could not be a face, weight or letter-spacing difference —
those move width without moving height.

The label and the layer name are the same design-authored string, so they cannot check each other.
Only measuring the glyph, or reading the text style, catches this.

## Rule violated

Internal consistency of the design system's own documentation: a specimen page must state the
value it demonstrates. A downstream consumer reading the label ships a size the design does not use.

There is a corroborating signal, offered as a pointer rather than evidence — upstream USWDS's type
scale index 14 is 40px. With 40, all nine of this page's scale indices map onto upstream exactly;
with 42, index 14 matches nothing.

## Recommendation (for design / brand owner)

**Most likely: correct the label to `42px` → `40px`,** and the layer name with it. That makes the
row self-consistent, and aligns the ramp with upstream USWDS's scale on all nine indices.

**If the intended size really is 42px,** then the sample is wrong rather than the label — restyle
node `1892:7631` to 42px, and note that index 14 then deliberately departs from upstream. Say so
explicitly, because the next person to read this page will otherwise re-raise it.

Either way the design should be self-consistent before more components are built on this ramp:
`2xl` is the `h1` size, so it reaches every page heading in the system.

## What was built

**`--font-size-2xl: 40px`** — the sample's actual text style, not the label.

This is the one case where the *rendered design* and the *documented design* disagree, and the
loop's rule is fidelity to what the design actually is. The choice is recorded here so it can be
reversed in one commit if the designer rules the other way.

## Implementation note

If the ruling is 42px, the change is a single value in `tokens/typography.css` plus a re-freeze of
`loop/refs/tok-font-sizes/`. No component work depends on `2xl` yet — this finding is cheap to act
on now and expensive later, once headings are built against it.
