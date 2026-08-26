# Handover — USWDS buttons (item `cmp-buttons`)

The USWDS button set, built as a restyle of the **native OutSystems UI button**. No new Block,
no Web Component, no parallel `uswds-button` system — `.btn` and the framework's own modifier
classes are re-dressed in place.

| | |
|---|---|
| Item | `cmp-buttons` · tier `primitives` · level L3 (`ExtendedClass` + BEM over the native widget) |
| Source | `src/blocks/button.css` |
| Spec of record | `loop/refs/cmp-buttons/spec.md` (Figma `tJnXUZbEL3fRWG7h1z0ij7`, node `1868-83`) |
| ODC target | Theme module **`SandboxKharlo`** → Theme editor, below OutSystems UI |
| Depends on | `tok-color-palette`, `tok-font-sizes`, `tok-typography` — all merged and live in the theme |

## Variant mapping — what a developer actually does with this

Nothing, for most of it. Seven of the eleven variants are the framework's own classes, so an
existing **Button** widget with `Style = Primary` re-brands with no change to the screen at all.

Only the variants OutSystems UI has no class for need an `ExtendedClass`:

| USWDS variant | How you get it in ODC |
|---|---|
| primary | Button `Style = Primary` — **nothing to add** |
| error | Button `Style = Error` — **nothing to add** |
| success | Button `Style = Success` — **nothing to add** |
| **outline** | Button with **no Style** — a bare `.btn` already IS the outline button |
| big | Button `Style = Large` |
| small | Button `Style = Small` (framework geometry, see below) |
| secondary | `ExtendedClass = "uswds-btn--secondary"` |
| accent-cool | `ExtendedClass = "uswds-btn--accent-cool"` |
| accent-warm | `ExtendedClass = "uswds-btn--accent-warm"` |
| base | `ExtendedClass = "uswds-btn--base"` |
| inverse | `ExtendedClass = "uswds-btn--inverse"` — for use on a dark surface |
| outline-inverse | `ExtendedClass = "uswds-btn--outline-inverse"` — for use on a dark surface |

`ExtendedClass` only. Never reach into the widget's own classes — hard rule 7.

### The `btn` base class is not automatic — this WILL bite you

The Button widget's **Style** property is emitted as a **verbatim class string**. The platform
does not prepend `btn` for you. Verified against the platform's own Login screen, which renders:

```html
<button class="btn btn-primary OSFillParent">Log in</button>
```

So the Style value is `btn btn-primary`, **not** `btn-primary`. For the six variants with no
native OutSystems UI class, Style is plain `btn` and the modifier goes in ExtendedClass.

| Variant | Style | ExtendedClass |
|---|---|---|
| primary | `btn btn-primary` | — |
| error | `btn btn-error` | — |
| success | `btn btn-success` | — |
| outline | `btn` | — |
| big | `btn btn-large` | — |
| small | `btn btn-small` | — |
| cancel | `btn btn-cancel` | — |
| secondary | `btn` | `uswds-btn--secondary` |
| accent-cool | `btn` | `uswds-btn--accent-cool` |
| accent-warm | `btn` | `uswds-btn--accent-warm` |
| base | `btn` | `uswds-btn--base` |
| inverse | `btn` | `uswds-btn--inverse` |
| outline-inverse | `btn` | `uswds-btn--outline-inverse` |

**Why a missing `btn` is fatal rather than cosmetic here.** This CSS puts every visual property
on `.btn` and only custom-property *assignments* on the variant classes. A button carrying
`btn-primary` without `btn` therefore sets nine custom properties that **nothing reads**, and
renders as a raw unstyled browser button. There is no partial result and no graceful
degradation — it either has the base class or it has nothing.

This is not hypothetical: the first build of the `ButtonSpecimen` screen shipped with the base
class missing on 22 of 25 buttons, and every caption rendered twice (`ButtonButton`) because the
caption was supplied by two mechanisms at once. The deterministic build gate passed and Mentor
reported `change_applied: true`. **Neither defect is visible to any check except the rendered
page.**

Paste this in the browser console on your published screen — both counts must be `0`:

```js
const b = [...document.querySelectorAll('button[data-button]')];
({ total: b.length,
   missingBase: b.filter(x => !x.classList.contains('btn')).length,
   dupCaption: b.filter(x => [...x.childNodes].filter(n => n.nodeType===3).length > 1).length })
```

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>button.css</code> → Theme CSS — paste BELOW OutSystems UI, after dist/theme.css</summary>

```css
/* @section Widget Overrides / Button */
/* button.css — USWDS restyle of the NATIVE OutSystems UI button.
 *
 * Item `cmp-buttons` (inventory row 4). Spec of record: loop/refs/cmp-buttons/spec.md,
 * frozen from Figma node 1868-83 on 2026-08-26. Every value below traces to that ref or to
 * a token an earlier item built; nothing here is invented, and nothing is normalised.
 *
 * ── MECHANISM ────────────────────────────────────────────────────────────────────────
 * This file restyles `.btn` and the framework's own modifier classes. It does NOT build a
 * parallel `uswds-button` block — that is hard rule #1 and CLAUDE.md's "restyle the native
 * widget" rule. It wins by loading after outsystems-ui.css at equal specificity, so
 * SOURCE ORDER IS LOAD-BEARING: this file is appended to dist/theme.css after the
 * consolidated :root, and in ODC the theme is pasted below OutSystems UI.
 *
 * The colour of a button is carried entirely by custom properties set on `.btn` and
 * reassigned by each variant. Only the base rule touches `background-color`, `color` and
 * `border-color`. That is deliberate: a variant that assigned those properties directly
 * would have to out-specify every other variant, and the 38 states in the ref would become
 * 38 specificity arguments. Reassigning a custom property is order-dependent, not
 * specificity-dependent, so the cascade stays flat and readable.
 *
 * ── GEOMETRY: WHY THE PADDING IS NOT THE NUMBER IN THE REF ────────────────────────────
 * The ref states padding 12px/20px and a 2px stroke on the outline variants — but reports
 * the SAME 93x38 symbol box for filled and outline alike. A stroke that added to the box
 * would make the outline symbols 97x42. It does not, so the Figma stroke is inside-aligned:
 * the text sits 20px from the OUTER edge in both cases.
 *
 * CSS borders always add to the box, so the faithful translation subtracts the border from
 * the padding and gives every button the same 2px border — transparent when the variant is
 * filled. Outer box then reproduces the ref exactly:
 *
 *   regular  2 + 10 + (16 x 0.9) + 10 + 2 = 38.4  ->  ref says 38   ✓
 *            2 + 18 +   ~53      + 18 + 2 = 93    ->  ref says 93   ✓
 *   big      2 + 14 + (22 x 0.9) + 14 + 2 = 51.8  ->  ref says 52   ✓
 *            2 + 22 +   ~72      + 22 + 2 = 120   ->  ref says 120  ✓
 *
 * Keeping the border on filled buttons also means filled and outline are interchangeable
 * without the layout shifting by 4px, which is what a same-size symbol box is telling us
 * the designer intended.
 *
 * `conventions.spacingBase` is TBD in project.config.json, so these are built exactly as
 * measured and are NOT a convention violation — hard rule #9.
 *
 * ── WHAT THIS FILE DELIBERATELY DOES NOT RESTYLE ──────────────────────────────────────
 * `.btn-small`, `.btn-loading`, `.btn-provider-login` and the `.phone .layout` full-width
 * behaviour. The ref draws none of them. They appear below only where the base rule would
 * otherwise have destroyed them — see "Framework sizes the ref does not draw".
 */

/* ══════════════════════════════════════════════════════════════════════════════════════
   BASE — geometry, type, and the custom properties every variant reassigns.

   Defaults are the ref's `outline` type, because a bare `.btn` in OutSystems UI already IS
   the low-emphasis outline button (white ground, currentColor border, primary text). A
   developer who drops in a Button with no Style therefore lands on a correct USWDS outline
   button rather than on something off-brand.
   ══════════════════════════════════════════════════════════════════════════════════════ */
.btn {
  /* Component-level geometry. Derived above; not a primitive, so it lives here. */
  --uswds-button-border-width: 2px;
  --uswds-button-padding-block: 10px;   /* ref 12px, less the 2px border */
  --uswds-button-padding-inline: 18px;  /* ref 20px, less the 2px border */
  --uswds-button-line-height: 0.9;      /* the ref states this on all 38 symbols */
  /* The ref states a 4px radius, and OutSystems UI's own `--border-radius-soft` is already
   * 4px — so the framework token is consumed rather than a competing one declared. The
   * fallback carries the ref's value for the case the theme is pasted somewhere the
   * framework variable is not defined; this project has no radius primitive layer yet, and
   * inventing one for a single value the framework already agrees with would be the "two
   * places to maintain the same number" mistake CLAUDE.md exists to prevent. */
  --uswds-button-radius: var(--border-radius-soft, 4px);

  /* Colour, per state. Variants below reassign these and nothing else. */
  --uswds-button-bg: transparent;
  --uswds-button-bg-hover: transparent;
  --uswds-button-bg-active: transparent;
  --uswds-button-fg: var(--color-primary);
  --uswds-button-fg-hover: var(--color-primary-dark);
  --uswds-button-fg-active: var(--color-primary-darker);
  --uswds-button-border: var(--color-primary);
  --uswds-button-border-hover: var(--color-primary-dark);
  --uswds-button-border-active: var(--color-primary-darker);

  /* Focus ring colour. Ink reads on the light ground every variant but the two inverse
     ones sits on; those two reassign it. See "Focus" at the foot of this file. */
  --uswds-button-focus-ring: var(--color-base-ink);

  border: var(--uswds-button-border-width) solid var(--uswds-button-border);
  border-radius: var(--uswds-button-radius);
  color: var(--uswds-button-fg);
  padding: var(--uswds-button-padding-block) var(--uswds-button-padding-inline);

  /* OSUI pins .btn to height:40px. The ref sizes the button from its padding instead, so
     the fixed height has to go or every value above is decorative. */
  height: auto;

  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);      /* 16px — NOT --font-size-md, which is 17px */
  font-weight: var(--font-weight-bold); /* 700. OSUI reaches for --font-semi-bold, which
                                         * this theme maps to 500 by brand-owner decision
                                         * (PR #9). The ref says every button is Bold, so
                                         * the button opts out of that mapping explicitly. */
  line-height: var(--uswds-button-line-height);
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden; /* the ref's `overflow: clip` */
}

/* Background is guarded so the framework's `.background-*` utility path still works.
   `.btn[class*=background-]` is 0,2,0 in OutSystems UI and would otherwise be beaten by a
   plain `.btn` rule loading later — silently breaking every utility-coloured button. */
.btn:not([class*=background-]) {
  background-color: var(--uswds-button-bg);
}

/* ── State ──────────────────────────────────────────────────────────────────────────────
   OutSystems UI expresses hover and active as `filter: brightness()`. USWDS names a
   distinct colour for each state, so the filter has to be switched off — left on, it would
   multiply the ref's own hover colour and land on neither value. The selectors match OSUI's
   specificity exactly (`.desktop .btn:hover` is 0,3,0) and win on source order. */
.desktop .btn:hover,
.btn:hover:active {
  filter: none;
}

.btn:hover {
  background-color: var(--uswds-button-bg-hover);
  border-color: var(--uswds-button-border-hover);
  color: var(--uswds-button-fg-hover);
}

.btn:active {
  background-color: var(--uswds-button-bg-active);
  border-color: var(--uswds-button-border-active);
  color: var(--uswds-button-fg-active);
}

/* ══════════════════════════════════════════════════════════════════════════════════════
   FILLED VARIANTS

   Three of these are OutSystems UI's own classes (.btn-primary, .btn-success, .btn-error);
   the rest have no native counterpart and are applied through ExtendedClass — hard rule #7,
   never by mutating framework internals.

       ExtendedClass = "uswds-btn--accent-cool"
   ══════════════════════════════════════════════════════════════════════════════════════ */

/* primary — native class, native role. */
.btn-primary {
  --uswds-button-bg: var(--color-primary);
  --uswds-button-bg-hover: var(--color-primary-dark);
  --uswds-button-bg-active: var(--color-primary-darker);
  --uswds-button-fg: var(--color-white);
  --uswds-button-fg-hover: var(--color-white);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;
}

.uswds-btn--secondary {
  --uswds-button-bg: var(--color-secondary);
  --uswds-button-bg-hover: var(--color-secondary-dark);
  --uswds-button-bg-active: var(--color-secondary-darker);
  --uswds-button-fg: var(--color-white);
  --uswds-button-fg-hover: var(--color-white);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;
}

/* accent-cool — INK at rest, white once you touch it. The ref inverts the foreground
 * mid-interaction and that is deliberate: #00BDE3 is too bright to carry white text
 * (2.24:1), while its -dark and -darker steps are not. Do not normalise this to one
 * foreground. See spec.md, "Four things the design says that the build must not tidy". */
.uswds-btn--accent-cool {
  --uswds-button-bg: var(--color-accent-cool);
  --uswds-button-bg-hover: var(--color-accent-cool-dark);
  --uswds-button-bg-active: var(--color-accent-cool-darker);
  --uswds-button-fg: var(--color-base-ink);
  --uswds-button-fg-hover: var(--color-white);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;
}

.uswds-btn--base {
  --uswds-button-bg: var(--color-base);
  --uswds-button-bg-hover: var(--color-base-dark);
  --uswds-button-bg-active: var(--color-base-darker);
  --uswds-button-fg: var(--color-white);
  --uswds-button-fg-hover: var(--color-white);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;
}

/* accent-warm — built as designed. White on #FA9441 measures 2.24:1 against WCAG 2.2
 * SC 1.4.3's 4.5:1 bar for 16px Bold, which is normal text. That is a design conflict, and
 * hard rule #4 says it is flagged, never quietly repaired: see FND-010 in
 * findings/findings-register.md. Do not "fix" it here. */
.uswds-btn--accent-warm {
  --uswds-button-bg: var(--color-accent-warm);
  --uswds-button-bg-hover: var(--color-accent-warm-dark);
  --uswds-button-bg-active: var(--color-accent-warm-darker);
  --uswds-button-fg: var(--color-white);
  --uswds-button-fg-hover: var(--color-white);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;
}

/* error — native class, native role. */
.btn-error {
  --uswds-button-bg: var(--color-error);
  --uswds-button-bg-hover: var(--color-error-dark);
  --uswds-button-bg-active: var(--color-error-darker);
  --uswds-button-fg: var(--color-white);
  --uswds-button-fg-hover: var(--color-white);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;
}

/* success — native class, and the resting foreground here CLOSES THE `.btn-success` HALF
 * OF FND-001 (issue #1). OutSystems UI paints white on --color-success, which under this
 * palette is #FFFFFF on #00A91C = 3.14:1 and fails AA for normal text. The ref specifies
 * ink, which measures 5.49:1. That is not a repair invented to satisfy the finding — it is
 * what the design itself draws, which is why it can land in code rather than in a comment.
 * The `.alert-info` / `.alert-success` half of FND-001 stays open for cmp-alert (item 7). */
.btn-success {
  --uswds-button-bg: var(--color-success);
  --uswds-button-bg-hover: var(--color-success-dark);
  --uswds-button-bg-active: var(--color-success-darker);
  --uswds-button-fg: var(--color-base-ink);
  --uswds-button-fg-hover: var(--color-white);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;
}

/* inverse — for use on a dark ground (the ref paints #1B1B1B behind it). This is the one
 * variant that gets LIGHTER as you interact with it. Correct for a control on dark; do not
 * reverse the ramp to match the others. */
.uswds-btn--inverse {
  --uswds-button-bg: var(--color-base-lighter);
  --uswds-button-bg-hover: var(--color-base-lightest);
  --uswds-button-bg-active: var(--color-white);
  --uswds-button-fg: var(--color-base-ink);
  --uswds-button-fg-hover: var(--color-base-ink);
  --uswds-button-fg-active: var(--color-base-ink);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;
  --uswds-button-focus-ring: var(--color-white);
}

/* ══════════════════════════════════════════════════════════════════════════════════════
   OUTLINE VARIANTS

   The bare `.btn` is already the light-ground outline button (see BASE above), so only the
   inverse one needs declaring. In every outline row of the ref the border and the text are
   the SAME colour in the same state, which is why they move together here.
   ══════════════════════════════════════════════════════════════════════════════════════ */
.uswds-btn--outline-inverse {
  --uswds-button-bg: transparent;
  --uswds-button-bg-hover: transparent;
  --uswds-button-bg-active: transparent;
  --uswds-button-fg: var(--color-base-light);
  --uswds-button-fg-hover: var(--color-base-lightest);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: var(--color-base-light);
  --uswds-button-border-hover: var(--color-base-lightest);
  --uswds-button-border-active: var(--color-white);
  --uswds-button-focus-ring: var(--color-white);
}

/* ══════════════════════════════════════════════════════════════════════════════════════
   BIG BUTTON — the ref's second component set (1868-112), mapped onto `.btn-large`.

   PRIMARY ONLY. The design provides no big secondary, big outline or big anything else, so
   the cross-product is not generated. `.btn-large` on its own carries primary colour here
   because that is the only big button the ref draws; pair it with another variant class and
   the colour tokens of that variant win, which is the closest thing to a defined answer.
   ══════════════════════════════════════════════════════════════════════════════════════ */
.btn-large {
  --uswds-button-padding-block: 14px;   /* ref 16px, less the 2px border */
  --uswds-button-padding-inline: 22px;  /* ref 24px, less the 2px border */
  --uswds-button-bg: var(--color-primary);
  --uswds-button-bg-hover: var(--color-primary-dark);
  --uswds-button-bg-active: var(--color-primary-darker);
  --uswds-button-fg: var(--color-white);
  --uswds-button-fg-hover: var(--color-white);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;

  font-size: var(--font-size-lg); /* 22px */
  height: auto;                   /* OSUI pins .btn-large to 48px */
}

/* ══════════════════════════════════════════════════════════════════════════════════════
   DISABLED

   `disabled` is a TYPE in the ref, not a state drawn per colour: one shared symbol, plus
   its own cell for inverse and for the two outline types. There is no disabled cell for
   secondary, accent-cool, base, accent-warm, error or success.

   A `.btn` restyle cannot dodge that gap — `:disabled` fires for whatever variant the
   developer applied. DECISION (Kharlo Ridado, 2026-08-26): the shared appearance wins for
   every variant the ref does not draw, because one shared `Type=disabled` symbol is what
   that most plausibly means, and it gives a predictable result for the six undrawn
   combinations. The alternative considered and rejected was leaving those six on the
   framework's own disabled styling, which invents nothing but renders disabled buttons
   inconsistently across colours.

   `[disabled]` and `:disabled` are both matched: OutSystems UI's own rule keys off the
   attribute, and a Button widget bound to a disabled expression renders it, but an
   `aria-disabled` composite or a `<button disabled>` written by hand should land the same.

   Contrast is NOT computed against AA here. WCAG 2.2 SC 1.4.3 exempts inactive controls, so
   #FFFFFF on #C9C9C9 (1.66:1) and ink on #71767A (3.75:1) are not defects. Recorded so they
   are not re-derived as findings on the next pass.
   ══════════════════════════════════════════════════════════════════════════════════════ */
/* MEASURED, not assumed. The custom-property indirection every other variant relies on is
 * NOT enough here, and the first build of this file got it wrong: OutSystems UI's own
 * `.btn[disabled]` sets `color` and `border` as REAL properties at 0,2,0, which outranks the
 * `color: var(--uswds-button-fg)` on `.btn` at 0,1,0. Reassigning the custom property alone
 * left every disabled button rendering the framework's #ADB5BD on a correct #C9C9C9 fill —
 * a half-applied override that looks deliberate. The real properties are therefore restated
 * here at matching specificity; they still READ the custom properties, so the four disabled
 * appearances below continue to work by reassignment. */
.btn[disabled],
.btn:disabled {
  border-color: var(--uswds-button-border);
  border-width: var(--uswds-button-border-width);
  color: var(--uswds-button-fg);

  --uswds-button-bg: var(--color-disabled);
  --uswds-button-bg-hover: var(--color-disabled);
  --uswds-button-bg-active: var(--color-disabled);
  --uswds-button-fg: var(--color-white);
  --uswds-button-fg-hover: var(--color-white);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;
}

.uswds-btn--inverse[disabled],
.uswds-btn--inverse:disabled {
  --uswds-button-bg: var(--color-base);
  --uswds-button-bg-hover: var(--color-base);
  --uswds-button-bg-active: var(--color-base);
  --uswds-button-fg: var(--color-base-ink);
  --uswds-button-fg-hover: var(--color-base-ink);
  --uswds-button-fg-active: var(--color-base-ink);
}

/* The light-ground outline button — i.e. a bare `.btn`. Scoped away from every filled
   variant so it does not steal their shared disabled appearance. */
.btn[disabled]:not([class*=btn-]):not([class*=uswds-btn--]),
.btn:disabled:not([class*=btn-]):not([class*=uswds-btn--]) {
  --uswds-button-bg: transparent;
  --uswds-button-bg-hover: transparent;
  --uswds-button-bg-active: transparent;
  --uswds-button-fg: var(--color-disabled);
  --uswds-button-fg-hover: var(--color-disabled);
  --uswds-button-fg-active: var(--color-disabled);
  --uswds-button-border: var(--color-disabled);
  --uswds-button-border-hover: var(--color-disabled);
  --uswds-button-border-active: var(--color-disabled);
}

.uswds-btn--outline-inverse[disabled],
.uswds-btn--outline-inverse:disabled {
  --uswds-button-bg: transparent;
  --uswds-button-bg-hover: transparent;
  --uswds-button-bg-active: transparent;
  --uswds-button-fg: var(--color-base);
  --uswds-button-fg-hover: var(--color-base);
  --uswds-button-fg-active: var(--color-base);
  --uswds-button-border: var(--color-base);
  --uswds-button-border-hover: var(--color-base);
  --uswds-button-border-active: var(--color-base);
}

/* ══════════════════════════════════════════════════════════════════════════════════════
   FOCUS — applied without a finding.

   The ref draws default / hover / active / disabled and NO focus state. Per CLAUDE.md,
   implementation-level accessibility that does not change the visual design is applied
   automatically rather than raised as a finding, and WCAG 2.2 SC 2.4.7 / 2.4.11 require a
   visible focus indicator. The ring is drawn in the ref's OWN colours — ink on the light
   ground, white on the two variants that sit on #1B1B1B — so no new value is introduced.

   `:focus-visible`, not `:focus`, so a pointer click does not leave a ring behind.

   OutSystems UI's own accessibility hook recolours the BORDER on focus
   (`.has-accessible-features .btn:focus`, 0,3,0). On a filled button that border is
   transparent, so the framework's indicator would appear as a stray dark outline fighting
   this ring. It is pinned back to the variant's own border colour at matching specificity.
   ══════════════════════════════════════════════════════════════════════════════════════ */
.btn:focus-visible {
  outline: var(--uswds-button-border-width) solid var(--uswds-button-focus-ring);
  outline-offset: var(--uswds-button-border-width);
}

.has-accessible-features .btn:focus {
  border-color: var(--uswds-button-border);
}

/* ══════════════════════════════════════════════════════════════════════════════════════
   FRAMEWORK SIZES AND VARIANTS THE REF DOES NOT DRAW

   These rules exist only because the base rule above would otherwise have destroyed a
   working framework feature. Each restores or maps, and says which.
   ══════════════════════════════════════════════════════════════════════════════════════ */

/* RESTORE. `.btn-small` has no counterpart in the ref. OutSystems UI gives it its own fixed
 * height and padding, both of which the base rule now overrides at equal specificity and
 * later source order — collapsing small buttons into regular ones. The framework's geometry
 * is put back rather than a small USWDS button being invented.
 *
 * font-size is restored too — MEASURED: without it the base rule's `--font-size-sm` won on
 * source order and small buttons rendered at the regular 16px, silently erasing the size.
 * `--font-size-xs` is the framework's own choice for it, which this theme retints from 12px
 * to 15px (register entry FND-007) — a known consequence of the palette item, not a new one. */
.btn-small {
  font-size: var(--font-size-xs);
  height: 32px;
  padding: var(--space-none) var(--space-s);
}

/* MAP, NOT A TRANSLATION. `.btn-cancel` is OutSystems UI's neutral, lower-emphasis button
 * and the ref draws nothing called "cancel". The base rule would have left it rendering as
 * the primary-blue outline button, which is worse than either honest option, so it is
 * mapped onto the ref's `base` type — the design's own neutral button. Every value comes
 * from the ref; only the ROLE assignment is a judgment, and it is recorded here and in the
 * handover so a designer can overrule it. */
.btn-cancel {
  --uswds-button-bg: var(--color-base);
  --uswds-button-bg-hover: var(--color-base-dark);
  --uswds-button-bg-active: var(--color-base-darker);
  --uswds-button-fg: var(--color-white);
  --uswds-button-fg-hover: var(--color-white);
  --uswds-button-fg-active: var(--color-white);
  --uswds-button-border: transparent;
  --uswds-button-border-hover: transparent;
  --uswds-button-border-active: transparent;
}

/* RESTORE. OutSystems UI re-pins button heights on tablet and phone (0,2,0), which would
 * beat the `height: auto` above and reintroduce the fixed box on small screens. The ref
 * specifies no responsive behaviour at all — one value per variant, no device modes — so
 * the faithful build is the same button at every width. Font-size is left to the framework
 * on those breakpoints only where it already agrees with the ref (16px). */
.tablet .btn,
.phone .btn {
  font-size: var(--font-size-sm);
  height: auto;
}

.tablet .btn-small,
.phone .btn-small {
  height: 32px;
}

.tablet .btn-large,
.phone .btn-large {
  height: auto;
}

/* ── Motion ─────────────────────────────────────────────────────────────────────────── */
/* OutSystems UI transitions `all 100ms linear` on every button. Honouring a reduced-motion
   preference is implementation-level accessibility with no visual change at rest, so it is
   applied without a finding. */
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
```

</details>

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the US Federal Government "US Web Design System" styling for Buttons to the native
OutSystems UI widget(s) it restyles.

Context (already done): button.css and dist/theme.css are already pasted into the ODC
Theme editor (below OutSystems UI). The look is pure CSS + tokens — there is nothing for
you to style, and you must not write or edit CSS.

Task — this component RESTYLES a native OutSystems widget, so the work is using the right
widget, not generating styles. Referencing elements by name:
1. Use the native OutSystems widget this maps to (see this handover's "When to use" /
   "Variant mapping" section), not a custom element.
2. Apply each variant via the Extended Class property only (e.g. ExtendedClass =
   "<documented-modifier>") — never mutate OutSystems UI internals.
3. Build any screen/Block logic the screen needs around it.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values. After
generating, list what you created by name and flag anything you could not finish.
```

## Three decisions baked into this CSS that a reviewer should look at

These are judgments, not translations. Each is reversible; each is written down so it is not
discovered later by surprise.

**1. Disabled uses one shared appearance for every variant.** The design draws `disabled` as
its own TYPE — a single shared symbol — plus its own cell for `inverse` and for the two outline
types. It draws no disabled cell for secondary, accent-cool, base, accent-warm, error or
success. But `:disabled` fires on the native widget whatever colour a developer applied, so the
gap had to be closed one way or the other. Decided (Kharlo Ridado, 2026-08-26): the shared
`#C9C9C9` / white appearance wins for the six undrawn combinations. The alternative — leaving
them on OutSystems UI's own disabled styling — invents nothing but renders disabled buttons
inconsistently across colours.

**2. `.btn-cancel` is MAPPED onto the USWDS `base` type.** OutSystems UI's neutral,
lower-emphasis button has no counterpart in the ref. Left alone it would have inherited the
primary-blue outline appearance from the base rule, which is worse than either honest option.
Every value comes from the ref; only the **role** assignment is a judgment, and a designer can
overrule it.

**3. `.btn-small` keeps OutSystems UI's own geometry.** The ref has two sizes, regular and big,
and says nothing about small. Rather than invent a small USWDS button, the framework's 32px
height, padding and `--font-size-xs` are restored. Note that this theme retints `--font-size-xs`
from 12px to 15px (register entry FND-007), so small buttons are larger than stock OutSystems UI.

## Two accessibility findings ride along with this — do not "fix" them in ODC

The code is faithful to the design, which means it ships two contrast failures on purpose.
Hard rule 4: never silently substitute a brand value for accessibility. If someone edits the
theme in ODC to fix these, that edit will be overwritten by the next paste and the finding will
be lost.

- **[#15](https://github.com/kharloridado/us-web-design-system/issues/15) · FND-010 · high** —
  `accent-warm` at rest paints white on `#FA9441` = **2.24:1** against a 4.5:1 bar. Awaiting a
  designer. Recommendation on the issue: ink foreground, which measures 7.69:1 and matches what
  the design already does on its two other bright fills.
- **FND-011 · medium, register-only** — `accent-cool` on hover paints white on `#28A0CB` =
  **3.01:1**. See `findings/findings-register.md`.

Conversely, one contrast problem **is** fixed here, and by the design rather than by us:
`.btn-success` goes from OutSystems UI's white-on-green (3.14:1) to the ref's ink-on-green
(5.49:1), which closes the `.btn` half of
[#1](https://github.com/kharloridado/us-web-design-system/issues/1). The `.alert-*` half of that
issue is untouched and belongs to `cmp-alert`.

## Accessibility applied without a finding

Implementation-level only — nothing that changes the visual design:

- **A visible focus ring**, which the design does not draw. `outline: 2px solid` at 2px offset,
  in the ref's own ink — or white on the two inverse variants, which sit on a dark ground.
  `:focus-visible`, so a mouse click does not leave a ring behind. WCAG 2.2 SC 2.4.7 / 2.4.11.
- **`prefers-reduced-motion`** honoured against OutSystems UI's `transition: all 100ms`.
- Native `<button>` semantics are untouched — this is CSS over the real widget.

## How to check it landed

Publish, then open a real browser — never Service Studio Preview (hard rule 2).

1. A `Style = Primary` button should be **`#005EA2`, 4px radius, Public Sans Bold 16px**, and
   should go **`#1A4480` on hover** — a distinctly different blue, not a dimmed one. If hover
   just looks darker-by-filter, this CSS is loading **above** OutSystems UI instead of below it.
2. A button with **no Style** should render as a blue **outline** button, not a grey box.
3. Tab to a button — a 2px ink ring should appear, offset from the edge.
4. `success` should have **dark** label text. If it is white, the paste is stale.

## Known gap: the typeface is not hosted yet

Nothing in this repo loads Public Sans — no `@font-face`, no import — so the theme names the
face and falls back. Buttons will render in the fallback stack until it is hosted against the
theme module. Height and colour are unaffected; **width is not verified** and the measured
91.8px vs the design's 93px is almost certainly the missing face rather than a geometry error.
Re-measure once the font is in place.
