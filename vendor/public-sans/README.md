# Public Sans — self-hosted brand face

The typeface the USWDS design system names on every type step (`loop/refs/tok-typography/`,
Figma node `63-49`). Declaring the family name in `tokens/typography.css` was never enough:
until these files ship, every `--font-family-base` declaration resolves to the first
available fallback and the app renders in the framework's default sans.

## What is here, and why exactly these five

| File | `font-weight` | `font-style` | Why it is shipped |
| --- | --- | --- | --- |
| `PublicSans-Regular.woff2`    | 400 | normal | `--font-weight-regular`. Body, h6, most UI text. |
| `PublicSans-Italic.woff2`     | 400 | italic | `<em>` / `<i>` at body weight. |
| `PublicSans-Medium.woff2`     | 500 | normal | `--font-weight-medium` — the brand-owner decision behind `--font-semi-bold`, so it is a **used** weight across 33 OutSystems UI emphasis rules. |
| `PublicSans-Bold.woff2`       | 700 | normal | `--font-weight-bold`. Display, h1–h5. |
| `PublicSans-BoldItalic.woff2` | 700 | italic | `<em>` inside a heading. |

Public Sans ships nine weights plus italics. Every face that is **not** in the table above is
deliberately absent: this design system declares three weights (400 / 500 / 700) and nothing
in `tokens/` or `src/` asks for 100–300, 600, or 800–900. Shipping them would be five more
ODC Resources to upload and cache-bust for no rendered difference.

`PublicSans-MediumItalic` is the one judgement call — italic *at* 500 is not synthesised from
a *different family*, only obliqued from the 500 roman we do ship, so the family never breaks.
Add it if a design ever specifies emphasised text at medium weight.

**woff2 only.** USWDS's own `font-sources()` emits woff/ttf siblings when
`$theme-font-browser-compatibility` is true; it is false by default, and every browser ODC
supports has had woff2 since 2016.

## Licence — OFL 1.1, so these ARE committed

`OFL.txt` is the SIL Open Font License 1.1 as shipped in the upstream release. It **permits
redistribution** of the font binaries, bundled or standalone.

That is why this directory breaks the rule in [`../LICENSING.md`](../LICENSING.md) §1 that
font binaries are never committed. That rule exists for **licensed proprietary** faces (a Pro
icon font), where redistributing the binary in a repo — even a private one — is a breach.
Public Sans is public-domain-adjacent US government work under an open licence; keeping it out
of the repo would buy nothing and would mean a fresh clone could not build a correct preview.
Keep `OFL.txt` next to the binaries: the licence requires the copyright and licence notice to
travel with the fonts.

## Provenance

- Upstream: <https://github.com/uswds/public-sans>
- Release: **v2.001**, published 2022-05-11
- Asset: `public-sans-v2.001.zip` → `fonts/webfonts/*.woff2`, copied verbatim, unmodified
- Pulled: 2026-08-26

## Where these files go

1. **ODC** — uploaded as five Resources on the `SandboxKharlo` app (see
   `handover/public-sans-font-face.md`). `tokens/typography.css` references them as
   `/SandboxKharlo/PublicSans-*.woff2`; ODC rewrites and fingerprints that URL at compile
   time, so **the literal path 404ing is expected** and "fixing" it breaks the rewrite
   (`docs/LESSONS.md` §1.7).
2. **Local preview** — `preview/fonts.css` re-declares the same five faces against
   `/vendor/public-sans/webfonts/*.woff2` and is linked *after* `dist/theme.css`, so the
   working local URL wins and the harness renders in the real face.

Both copies are the same five files; only the `src` differs.
