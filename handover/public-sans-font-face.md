# Handover — Public Sans self-hosting + USWDS type roles

Two halves of one change, which is why they are one ticket:

1. **Ship the face.** The theme has named `Public Sans` since `tok-typography`, but naming a
   family loads nothing — until now every heading and paragraph in the app silently rendered
   in OutSystems UI's default system sans. Five `@font-face` rules now point at five ODC
   Resources.
2. **Point the roles at it.** OutSystems UI's own heading and body slots kept their framework
   sizes, weights and line-heights, so even with the face loaded nothing would have looked
   like USWDS. `h1`–`h6`, `display` and `body` are now mapped onto the USWDS ramp.

Half 1 without half 2 renders the right face at the wrong sizes. Half 2 without half 1 renders
the right sizes in the wrong face. **Do both, in the order below.**

| | |
|---|---|
| Item | type roles + brand face · tier `foundations` · level L1 (theme) |
| Source | `tokens/font-faces.css` + `tokens/outsystems-ui-overrides.css` → `dist/theme.css` |
| Font binaries | `vendor/public-sans/webfonts/*.woff2` (Public Sans v2.001, SIL OFL 1.1) |
| Spec of record | upstream USWDS (see *Where the values came from*), corroborated by `loop/refs/tok-typography/` and `loop/refs/tok-font-sizes/` |
| ODC target | app **`SandboxKharlo`** → Resources, **and** theme **`SandboxKharlo`** → Theme editor |

---

## Step 1 — upload five Resources (do this FIRST)

In ODC Studio, on the **`SandboxKharlo`** app, add each of these files as a **Resource**:

| File in this repo | Upload as | Deploy action |
|---|---|---|
| `vendor/public-sans/webfonts/PublicSans-Regular.woff2` | `PublicSans-Regular.woff2` | Deploy to Target Directory |
| `vendor/public-sans/webfonts/PublicSans-Italic.woff2` | `PublicSans-Italic.woff2` | Deploy to Target Directory |
| `vendor/public-sans/webfonts/PublicSans-Medium.woff2` | `PublicSans-Medium.woff2` | Deploy to Target Directory |
| `vendor/public-sans/webfonts/PublicSans-Bold.woff2` | `PublicSans-Bold.woff2` | Deploy to Target Directory |
| `vendor/public-sans/webfonts/PublicSans-BoldItalic.woff2` | `PublicSans-BoldItalic.woff2` | Deploy to Target Directory |

**The names must match exactly.** The theme references them by literal filename; a Resource
uploaded as `publicsans-regular.woff2` or `PublicSans-Regular (1).woff2` will not be found, and
the symptom is not an error — it is text quietly rendering in a system sans.

### This is a HARD PREREQUISITE, not a tidy ordering — measured 2026-08-26

The original draft of this ticket said pasting the theme first was harmless. **It is not.** ODC
resolves `url(...)` against the app's Resources at **design time**, not only at compile time.
With the theme pasted and the Resources absent, the theme validates with **five `Unknown Object`
errors — exactly one per `@font-face`**, and the app cannot be published cleanly until they
clear.

That was observed directly: the theme paste landed byte-exact and reported
`error_count: 5, first_messages: ["Unknown Object" × 5]`. So the order is not a preference:

> **Upload the five Resources, then paste the theme, then publish.**

If you have already pasted the theme and are staring at five `Unknown Object` errors, nothing is
broken — upload the Resources and they resolve. Do **not** delete the `@font-face` rules to make
the errors go away; that ships the theme without the face and reintroduces exactly the silent
fallback this deliverable exists to fix.

### Why exactly five, and not the nine weights Public Sans ships

This design system declares three weights — 400, 500, 700 — and uses italic at two of them.
Every other face upstream ships is deliberately absent; shipping them would be more Resources
to upload and cache-bust for no rendered difference. The full table and the reasoning are in
`vendor/public-sans/README.md`.

Adding a weight later is a code change (`build/gen-font-faces.mjs`), not just an upload.

---

## Step 2 — paste the theme

```bash
npm run build:theme        # or build:theme:ship for the customer-facing copy
```

Paste the full contents of `dist/theme.css` into the **`SandboxKharlo`** theme in ODC.

**No separate code block in this ticket, on purpose.** The `@font-face` rules and the role
mapping are both *inside* `dist/theme.css`, so they travel with the theme paste like every
other token — which is why `handover/handover-map.json` has no entry for this item and
`npm run embed:handover` correctly embeds nothing here. A second copy in this document would be
a second copy to drift.

Keep the `/*!` header, Section Index and section banners intact. The index now lists
**3.1 Font faces** and **3.2 Type**, which is how anyone later finds the face declarations.

---

## The one trap: the font URLs 404 outside ODC, and that is correct

The theme declares `src: url("/SandboxKharlo/PublicSans-Regular.woff2")`. **ODC rewrites and
fingerprints that URL at compile time**, so the literal path resolves only inside the published
app. Fetching it from anywhere else and getting a 404 is *expected* and is not evidence of a
bug — and "fixing" the path is what breaks the rewrite. This is `docs/LESSONS.md` §1.7, and it
has already cost this project's predecessor a day.

**If the published app renders in a system sans, do not touch the URL.** In order, check:

1. Are all five Resources present, with exactly those filenames?
2. Open DevTools → Network → Font. A face that never appears was never *requested*, which means
   nothing on the page used that weight — not that the path is wrong.
3. A face requested and 404ing means the Resource is missing or misnamed.
4. Text in the wrong face with **no** failed request almost always means a weight is used but
   never declared. Check the used weights against the five above.

The local preview sidesteps all of this: `preview/fonts.css` re-declares the same five faces
against `/vendor/public-sans/webfonts/`, is linked after `dist/theme.css`, and wins outright
(two `@font-face` rules for one family+weight+style do not cascade on failure — the last one
declared wins). Both files are generated together by `npm run gen:font-faces`, so they cannot
drift apart.

---

## What this changes in ODC

### The face

`html` now sets `font-family: var(--font-family-base)`. OutSystems UI hard-codes a system stack
on `html` and reads no variable, so this rule is what actually switches the app over. The stack
is `"Public Sans Web", "Public Sans", <OSUI's own system stack>` — the first name is the
self-hosted face, the second catches a locally installed copy, the third is the framework's
original fallback.

`"Public Sans Web"`, not `"Public Sans"`, is upstream USWDS's own name for the self-hosted face.
It keeps the webfont we ship distinct from whatever version a user may have installed.

### The type roles — expect app-wide visual change on publish

| Slot | OutSystems UI default | Now | Weight | Line-height |
|---|---|---|---|---|
| `--font-size-display` | 36px | **48px** | 700 | 1.2 |
| `--font-size-h1` | 32px | **40px** | 700 | 1.2 |
| `--font-size-h2` | 28px | **32px** | 700 | 1.2 |
| `--font-size-h3` | 26px | **22px** | 700 | 1.2 |
| `--font-size-h4` | 22px | **16px** | 700 | 1.2 |
| `--font-size-h5` | 20px | **15px** | 700 | 1.2 |
| `--font-size-h6` | 18px | **13px** | 400 | 1.15 |
| `body` | 14px / 1.5 | **16px / 1.62** | — | — |

Every number above was **measured in headless Chrome on the real cascade**, not read off the
source.

Two consequences worth bracing for:

- **h4 and h5 get smaller, h1/h2/display get bigger.** USWDS's ramp is more top-heavy than
  OutSystems UI's: it separates h1–h3 dramatically and lets h4–h6 sit near body size, because
  they are section labels rather than titles. Screens laid out against OSUI's flatter ramp will
  re-proportion.
- **`h6` is now an uppercase, letter-spaced 13px label**, not a small heading. That is what
  USWDS's `h6` is — the only heading step that typesets from the body role. If a screen uses
  `h6` as "a slightly smaller h5", it will look wrong, and the fix is to use `h5` there.

**Body 14px → 16px is app-wide**, wherever text inherits from `body` rather than setting its own
size: prose, container text, table cells. Widgets that set `var(--font-size-base)` (16px) or
`var(--font-size-s)` (14px) are untouched — `--font-size-s` is deliberately *not* redefined, so
OutSystems UI's 25 small-variant rules keep their size.

### What is deliberately NOT changed

- **OutSystems UI's `.tablet` / `.phone` heading deltas are left in place**, so headings still
  shrink 2–4px on smaller devices (`.phone` renders h1 36 / h6 11). Neither USWDS nor the Figma
  ref defines a device axis at all, so overriding fourteen framework selectors would be
  inventing one. Logged as **FND-012**; it needs a designer's answer about the whole ramp, not a
  patch on one value.
- `--font-size-base`, `--font-size-s`, `--font-size-label` — see the override file for why each
  is left alone.
- **lead / intro (22px)** has no OutSystems UI slot to land on. It needs a class, which needs its
  own item and ref.

---

## Where the values came from

The roles are sourced from **upstream USWDS, not from a Figma ref** — a deliberate change of
authority requested by the brand owner on 2026-08-26 and recorded in `project-context.md`. Read
verbatim on that date:

- `uswds/uswds@develop` `packages/uswds-core/src/styles/settings/_settings-typography.scss`
- `uswds/uswds@develop` `packages/uswds-core/src/styles/mixins/typography/headings.scss`
- `uswds/uswds@develop` `packages/uswds-core/src/styles/tokens/font/line-height.scss`
- `designsystem.digital.gov/design-tokens/typesetting/font-size/` and `/font-family/`

The two sources corroborate each other: all nine published `$theme-type-scale-*` pixel values
are identical to the nine steps `tok-font-sizes` measured out of Figma, and every role lands on
the step the design's own role column already stated.

**One departure from the Figma ref, and it is signed off.** The ref measures `h3` at Regular
400; upstream's `@mixin h3` is bold like h1/h2/h4/h5, and h3 is one of only two steps bound to
no Figma variable — the drift FND-008 suspected. `h3` builds **Bold 700**. `h6` is *not* changed
with it: upstream really does make h6 Regular + uppercase + `ls-1` tracking, and `ls-1` × 13px =
**0.325px, the ref's own measured tracking to the third decimal**. Same investigation, opposite
answers. See FND-008 and `project-context.md`.

---

## Build in ODC with Mentor Studio

**Nothing for Mentor to do on this item, and this section says so rather than being absent.**

Mentor Studio is a logic and data agent: it scaffolds Blocks, attribute bindings, event wiring
and Client Actions. This deliverable is a Resource upload plus a theme paste. It creates no
Block, exposes no input parameter and raises no event.

Mentor also **cannot** do step 1: uploading a binary Resource is a Studio action, not something
a prompt can carry.

If you want Mentor to verify the result rather than build it, the useful prompt is a *reading*
one:

> Open the `SandboxKharlo` app. List the Resources on it and tell me whether all five of
> `PublicSans-Regular.woff2`, `PublicSans-Italic.woff2`, `PublicSans-Medium.woff2`,
> `PublicSans-Bold.woff2` and `PublicSans-BoldItalic.woff2` are present with exactly those
> names. Do not change anything.

---

## Definition of done

- [ ] Five Resources on `SandboxKharlo`, names matching exactly
- [ ] `dist/theme.css` pasted into the `SandboxKharlo` theme, `/*!` header and Section Index intact
- [ ] App published
- [ ] In a **real browser** (never Service Studio Preview): DevTools → Network → Font shows
      `PublicSans-*.woff2` served 200
- [ ] A heading's computed `font-family` reads `Public Sans Web`
- [ ] `h1` computes 40px/700, `h6` computes 13px/400 uppercase, `body` computes 16px/1.62
