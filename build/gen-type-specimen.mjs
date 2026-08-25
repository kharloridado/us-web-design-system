#!/usr/bin/env node
/* gen-type-specimen.mjs — the Live Style Guide typography specimen.
 *
 * GENERATED, never hand-written, and derived from tokens/typography.css itself. Outputs:
 *
 *   style-guide/odc-type-screen.css   the ODC Screen's Style Sheet (a paste target)
 *   style-guide/odc-type-screen.html  the rendered reference (NOT a paste target)
 *
 * Why generated, same reason as the palette: a hand-maintained specimen drifts from the
 * ramp the moment a token moves, and a drifted specimen is worse than none — it shows you
 * a size the build no longer emits. Deriving it from the token file makes drift impossible.
 *
 * THE DISCIPLINE THAT MAKES THIS A CHECK RATHER THAN DECORATION — the same two properties
 * the colour specimen has, carried over to type:
 *
 *   1. Every sample is RENDERED through `var(--font-size-*)` / `var(--font-weight-*)` /
 *      `var(--line-height-*)` in the live cascade. It shows what the theme actually emits,
 *      not a copy of it.
 *   2. Every value beside a sample is TEXT CONTENT read out of tokens/typography.css, never
 *      a CSS value. Sample and label therefore arrive by two independent paths — the sample
 *      from the cascade, the label from the token file. If they disagree, you can see it.
 *
 * If the screen is published but the theme is not, the samples render at the browser's
 * default size next to labels confidently naming a step. That is the failure mode being
 * tested for, made visible.
 *
 * THE TYPEFACE ROW IS A LOAD-BEARING SPECIAL CASE. `--font-family-base` names Public Sans,
 * but the face IS NOT SELF-HOSTED YET (see the long note in tokens/typography.css): with no
 * @font-face and no client-side install, the declaration silently resolves to the first
 * available fallback and the page renders in the framework's default sans, looking perfectly
 * fine. Nothing in the build gate catches that. So the specimen renders the SAME sentence
 * twice — once in var(--font-family-base), once in the fallback tail of that stack with
 * Public Sans removed — and states the test in words: if the two rows are identical, the
 * face is not loading. That is the only way this page can tell the truth about a font it
 * cannot itself install.
 *
 *   node build/gen-type-specimen.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const src = readFileSync(join(root, 'tokens', 'typography.css'), 'utf8');

/* Declaration lines only, never comment lines — the same anchor the utilities generators
 * use. tokens/typography.css discusses many values in prose that it does not emit (OSUI's
 * own 300/600 weights, the h1-h6 role mapping); matching a comment would put a token on
 * this page that the theme never declares, which is precisely the lie the specimen exists
 * to catch. */
const declOf = (name) => {
  const m = src.match(new RegExp(`^\\s*--${name}\\s*:\\s*([^;]+);`, 'm'));
  return m ? m[1].trim().replace(/\s*\n\s*/g, ' ') : null;
};
const allOf = (prefix) => {
  const out = [];
  for (const m of src.matchAll(new RegExp(`^\\s*(--${prefix}-([\\w-]+))\\s*:\\s*([^;]+);`, 'gm'))) {
    out.push({ varName: m[1], leaf: m[2], value: m[3].trim() });
  }
  return out;
};

const family = declOf('font-family-base');
const sizes = allOf('font-size');
const weights = allOf('font-weight');
const lineHeights = allOf('line-height');

/* Refuse to emit a specimen that silently omits a tier. A page missing its weight section
 * looks complete; it just quietly stops testing weights. */
for (const [label, list] of [['font-size', sizes], ['font-weight', weights], ['line-height', lineHeights]]) {
  if (!list.length) {
    console.error(`gen:type-specimen — no --${label}-* tokens found in tokens/typography.css`);
    process.exit(1);
  }
}
if (!family) {
  console.error('gen:type-specimen — --font-family-base not found in tokens/typography.css');
  process.exit(1);
}

/* The fallback tail: the declared stack with the named face removed. Rendering this beside
 * the real stack is what makes "Public Sans is not actually loading" visible. */
const fallbackStack = family.split(',').slice(1).map((s) => s.trim()).join(', ');
const namedFace = family.split(',')[0].trim().replace(/^"|"$/g, '');

/* The role column tokens/typography.css records against each size step, as a trailing
 * comment. Provenance for the reader — NOT emitted as CSS, because the role mapping belongs
 * to the semantic layer and this ramp owns sizes only. */
const roleOf = (leaf) => {
  const m = src.match(new RegExp(`^\\s*--font-size-${leaf}\\s*:[^;]+;\\s*/\\*\\s*\\d+\\s+(.+?)\\s*\\*/`, 'm'));
  const role = m ? m[1].trim() : '';
  return role && role !== '—' ? role : '';
};

const SAMPLE = 'The quick brown fox jumps over the lazy dog';
const PARA =
  'Federal agencies deliver services the public depends on. Clear typography is how ' +
  'that information becomes usable — line length, size and rhythm decide whether a ' +
  'page can be read at all, long before anyone reaches its content.';

/* ---- 1. the ODC Screen stylesheet ----
 *
 * Self-contained on purpose: in ODC the Screen stylesheet is its OWN paste, loaded
 * independently of the theme, so it carries the layout rules AND the per-step classes. The
 * token VALUES still come from the theme, never from here — every rule below is a var().
 *
 * Class-only, so native Containers carrying these classes render identically to the
 * reference markup: there are no element selectors to satisfy. */
const sizeRules = sizes
  .map((t) => `.uswds-type__sample--${t.leaf} { font-size: var(${t.varName}); }`)
  .join('\n');
const weightRules = weights
  .map((t) => `.uswds-type__sample--${t.leaf} { font-weight: var(${t.varName}); }`)
  .join('\n');
const lhRules = lineHeights
  .map((t) => `.uswds-type__para--${t.leaf} { line-height: var(${t.varName}); }`)
  .join('\n');

const css = `/* ${'GENERATED'} by build/gen-type-specimen.mjs — do not edit.
 * Regenerate with \`npm run gen:type-specimen\` after any change to tokens/typography.css.
 *
 * PASTE INTO: the ODC Screen's Style Sheet (Screen > Style Sheet), NOT the theme.
 * Requires dist/theme.css to already be pasted into the theme — this file consumes the
 * --font-* and --line-height-* tokens, it does not define them.
 *
 * Token-only and class-only: no hard-coded design value, no inline style, and nothing
 * attached by mutating OutSystems UI internals. */

.uswds-type {
  font-family: var(--font-family-base);
  line-height: var(--line-height-base);
  color: var(--color-base-ink);
  padding: var(--space-l, 1.5rem);
}

.uswds-type__section {
  margin-block-end: var(--space-2xl, 3rem);
}

.uswds-type__section-title {
  margin: 0 0 var(--space-xs, 0.25rem);
  padding-block-end: var(--space-s, 0.5rem);
  border-block-end: 2px solid var(--color-base-ink);
  font-size: var(--font-size-xl, 2rem);
  font-weight: var(--font-weight-bold, 700);
  line-height: var(--line-height-heading, 1.2);
}

.uswds-type__section-note {
  margin: 0 0 var(--space-l, 1.5rem);
  font-size: var(--font-size-2xs, 0.875rem);
  color: var(--color-base-dark);
  max-inline-size: 42em;
}

/* ---- A specimen row: labels in a fixed gutter, sample in the rest ----
 * The label column is sized in \`ch\` off the longest token name rather than in px, so it
 * stays correct if a later step has a longer name and never needs a magic number. */
.uswds-type__row {
  display: flex;
  align-items: baseline;
  gap: var(--space-m, 1rem);
  padding-block: var(--space-s, 0.5rem);
  border-block-end: 1px solid var(--color-base-lighter);
}

.uswds-type__meta {
  flex: 0 0 24ch;
  min-inline-size: 0;
}

.uswds-type__name {
  display: block;
  font-family: monospace;
  font-size: var(--font-size-2xs, 0.875rem);
  color: var(--color-base-ink);
  /* Break between hyphen segments, never mid-segment. */
  overflow-wrap: break-word;
  word-break: normal;
}

.uswds-type__value {
  display: block;
  font-family: monospace;
  font-size: var(--font-size-2xs, 0.875rem);
  color: var(--color-base-dark);
}

.uswds-type__role {
  display: block;
  font-size: var(--font-size-2xs, 0.875rem);
  color: var(--color-base);
}

.uswds-type__sample {
  flex: 1 1 auto;
  min-inline-size: 0;
  /* The ramp tops out at 48px; let a long sample clip rather than force a page-wide
   * horizontal scrollbar that would make every other row harder to compare. */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: var(--line-height-heading, 1.2);
}

/* ---- The typeface test ----
 * Two rows, same sentence, same size. The first asks for the declared stack; the second
 * asks for that stack with ${namedFace} removed. IDENTICAL RENDERING MEANS THE FACE IS NOT
 * LOADING and everything on this page is really being drawn in the fallback. */
.uswds-type__face {
  font-size: var(--font-size-lg, 1.375rem);
  white-space: normal;
}

.uswds-type__face--declared { font-family: var(--font-family-base); }
.uswds-type__face--fallback { font-family: ${fallbackStack}; }

.uswds-type__stack {
  display: block;
  font-family: monospace;
  font-size: var(--font-size-2xs, 0.875rem);
  color: var(--color-base-dark);
  margin-block-start: var(--space-xs, 0.25rem);
  white-space: normal;
  overflow-wrap: break-word;
}

/* ---- Line-height blocks ----
 * A ratio is only visible across several wrapped lines, so these are paragraphs at a
 * readable measure, not one-liners. */
.uswds-type__para {
  margin: 0;
  max-inline-size: 42em;
  font-size: var(--font-size-sm, 1rem);
}

/* Phones: the fixed label gutter plus a 48px sample does not fit. Stack the label above
 * the sample and let it wrap — the ramp still reads top-to-bottom. */
@media (max-width: 640px) {
  .uswds-type { padding: var(--space-m, 1rem); }
  .uswds-type__row { display: block; }
  .uswds-type__meta { margin-block-end: var(--space-xs, 0.25rem); }
  .uswds-type__sample { white-space: normal; overflow: visible; }
}

/* ---- Per-token classes: one class per token, each a single var() ---- */
${sizeRules}

${weightRules}

${lhRules}
`;

const cssPath = join(root, 'style-guide', 'odc-type-screen.css');
mkdirSync(dirname(cssPath), { recursive: true });
writeFileSync(cssPath, css);

/* ---- 2. the rendered reference ----
 *
 * NOT A PASTE TARGET, deliberately — see the warning in handover/handover-map.json. The
 * ODC screen is built from Container widgets carrying these classes; this file exists as
 * the picture of what that must look like, and as the source of the widget-tree tables in
 * the handover. Pasting markup into an Expression is the defect that rewrite exists to
 * prevent. */
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const row = (cls, name, value, role, sampleCls, sampleText) =>
  `      <div class="uswds-type__row">\n` +
  `        <div class="uswds-type__meta">\n` +
  `          <code class="uswds-type__name">${esc(name)}</code>\n` +
  `          <code class="uswds-type__value">${esc(value)}</code>\n` +
  (role ? `          <span class="uswds-type__role">${esc(role)}</span>\n` : '') +
  `        </div>\n` +
  `        <div class="${esc(cls)} ${esc(sampleCls)}">${esc(sampleText)}</div>\n` +
  `      </div>`;

const faceSection =
  `    <div class="uswds-type__section">\n` +
  `      <h2 class="uswds-type__section-title">Typeface</h2>\n` +
  `      <p class="uswds-type__section-note">The same sentence twice: first in ` +
  `var(--font-family-base), then in that stack with ${esc(namedFace)} removed. If the two ` +
  `rows look identical, ${esc(namedFace)} is NOT loading and this page — and the app — is ` +
  `rendering in the fallback. The face is not self-hosted yet; declaring the name does not ` +
  `ship it.</p>\n` +
  `      <div class="uswds-type__row">\n` +
  `        <div class="uswds-type__meta">\n` +
  `          <code class="uswds-type__name">--font-family-base</code>\n` +
  `          <span class="uswds-type__role">declared</span>\n` +
  `        </div>\n` +
  `        <div class="uswds-type__face uswds-type__face--declared">${esc(SAMPLE)}` +
  `<code class="uswds-type__stack">${esc(family)}</code></div>\n` +
  `      </div>\n` +
  `      <div class="uswds-type__row">\n` +
  `        <div class="uswds-type__meta">\n` +
  `          <code class="uswds-type__name">(fallback only)</code>\n` +
  `          <span class="uswds-type__role">control</span>\n` +
  `        </div>\n` +
  `        <div class="uswds-type__face uswds-type__face--fallback">${esc(SAMPLE)}` +
  `<code class="uswds-type__stack">${esc(fallbackStack)}</code></div>\n` +
  `      </div>\n` +
  `    </div>`;

const sizeSection =
  `    <div class="uswds-type__section">\n` +
  `      <h2 class="uswds-type__section-title">Font size — the nine-step ramp</h2>\n` +
  `      <p class="uswds-type__section-note">Each sample is rendered at var(--font-size-*) ` +
  `through the live cascade; the px value beside it is text read out of the token file. ` +
  `They arrive by two independent paths, so a mismatch is visible. The role column is the ` +
  `mapping the design states — it is provenance, not something this ramp emits.</p>\n` +
  sizes
    .map((t) =>
      row('uswds-type__sample', t.varName, t.value, roleOf(t.leaf), `uswds-type__sample--${t.leaf}`, SAMPLE)
    )
    .join('\n') +
  `\n    </div>`;

const weightSection =
  `    <div class="uswds-type__section">\n` +
  `      <h2 class="uswds-type__section-title">Font weight</h2>\n` +
  `      <p class="uswds-type__section-note">400 and 700 are the design's own weights. 500 ` +
  `is a brand-owner decision (Kharlo Ridado, 2026-08-25, PR #9), not a value from the ref — ` +
  `it exists so OutSystems UI's --font-semi-bold has a step to land on. A weight only ` +
  `renders if the loaded face actually ships it; with the face falling back, expect the ` +
  `browser to synthesise or snap these.</p>\n` +
  weights
    .map((t) =>
      row('uswds-type__sample uswds-type__face', t.varName, t.value, '', `uswds-type__sample--${t.leaf}`, SAMPLE)
    )
    .join('\n') +
  `\n    </div>`;

const lhSection =
  `    <div class="uswds-type__section">\n` +
  `      <h2 class="uswds-type__section-title">Line height</h2>\n` +
  `      <p class="uswds-type__section-note">Unitless ratios, as the design states them — a ` +
  `unitless line-height inherits as a ratio and re-computes per element, so a child at a ` +
  `different size stays proportional. Shown across several wrapped lines, because that is ` +
  `the only place a ratio is visible.</p>\n` +
  lineHeights
    .map(
      (t) =>
        `      <div class="uswds-type__row">\n` +
        `        <div class="uswds-type__meta">\n` +
        `          <code class="uswds-type__name">${esc(t.varName)}</code>\n` +
        `          <code class="uswds-type__value">${esc(t.value)}</code>\n` +
        `        </div>\n` +
        `        <p class="uswds-type__para uswds-type__para--${esc(t.leaf)}">${esc(PARA)}</p>\n` +
        `      </div>`
    )
    .join('\n') +
  `\n    </div>`;

const html = `<!-- GENERATED by build/gen-type-specimen.mjs — do not edit.
     Regenerate with \`npm run gen:type-specimen\`.

     NOT A PASTE TARGET. The ODC screen is built from Container widgets carrying these
     classes — never from this markup dropped into an Expression widget. This file is the
     rendered reference for what that screen must look like, and the source of the
     widget-tree tables in handover/odc-type-screen.md. -->
<div class="uswds-type">
${faceSection}
${sizeSection}
${weightSection}
${lhSection}
</div>
`;

writeFileSync(join(root, 'style-guide', 'odc-type-screen.html'), html);

console.log(
  `gen:type-specimen → style-guide/odc-type-screen.{css,html} ` +
    `(${sizes.length} sizes, ${weights.length} weights, ${lineHeights.length} line-heights, ` +
    `family "${namedFace}")`
);
