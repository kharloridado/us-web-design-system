# Ref — `sg-palette-specimen` (Live Style Guide colour specimen)

**Source: written spec (no Figma node).** This item has no design node because it is not a
design deliverable — it is Live Style Guide tooling for the preview harness. That is a
legitimate ref per `loop/refs/README.md`: a written spec of record, not a guess.

## Provenance

| Field | Value |
|---|---|
| Source | written spec |
| Requested by | Kharlo Ridado, in session, 2026-08-20 |
| Reason | The checker flagged, on item `tok-color-palette`, that the preview had no palette specimen — so `rendered.png` showed only harness chrome and the screenshot half of the rendered-fidelity gate was empty. Three consecutive token items (colours, font sizes, typography) would each have produced no visual output. |
| Ships to ODC | **No.** Preview-only chrome. |

## Item

| Field | Value |
|---|---|
| Tier | `foundations` (supports the foundations review; must land before the tier closes) |
| Artifacts | `build/gen-palette-specimen.mjs`, `style-guide/palette-specimen.css` (generated), `preview/index.html` (generated block) |
| Depends on | `tok-color-palette` — the specimen renders that palette, so it cannot be cut from `main` until those tokens land |

## The spec

1. Render **every** `--color-*` token declared in `tokens/colors.css` as a swatch in
   `preview/index.html`, grouped by ramp, in two sections — **Theme palette** then **State
   palette** — mirroring the grouping and order of the design's own Colors page
   (`loop/refs/tok-color-palette/figma.png`).
2. Each swatch shows the token name and its hex.
3. **The swatch must be painted by `var(--token)` through the real cascade**, never by a
   literal copied into the specimen stylesheet. The point of the specimen is to show what the
   theme actually emits; a specimen holding its own copy of the values would agree with itself
   no matter how broken the cascade was.
4. The hex appears as **text content** beside the swatch, never as a CSS value — so a chip that
   disagrees with its own label is visible to the eye.
5. Both outputs are **generated from `tokens/colors.css`**, never hand-written. The harness rule
   is that preview chrome stays token-only and class-only, because "a preview that cheats cannot
   tell you whether the tokens are right". A hand-maintained specimen drifts the moment a token
   moves, and a drifted specimen is worse than none.
6. The generator **fails loudly** rather than silently omitting a token: if any `--color-*`
   matches no known ramp, it exits non-zero and names the token.

## Not in scope

- Any change to `tokens/colors.css` or to a token value.
- Contrast pairings. The palette ref states none, and swatch-vs-label is documentation chrome,
  not a design pairing. Alert/button pairings are covered by FND-001 and belong to the Alert item.
- Specimens for font sizes or typography — those are their own items, alongside their own
  token items.

## Verification

- `npm run build:theme` exits 0.
- Every chip is painted: 0 chips with a transparent or empty computed `background-color`.
- 0 failed requests in the preview (a missing stylesheet would invalidate the whole render).
- Swatch count equals the token count in `tokens/colors.css`, and ramp counts match the ref:
  Base 7 · Primary 6 · Secondary 6 · Accent cool 5 · Accent warm 5 · Info 5 · Error 5 ·
  Warning 5 · Success 5 · Disabled 3.
