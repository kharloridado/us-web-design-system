# Handover — USWDS colour tokens (item `tok-color-palette`)

The 52-colour USWDS palette as OutSystems theme tokens. Foundations tier — 15 downstream
components consume these, so this lands before any component work.

| | |
|---|---|
| Item | `tok-color-palette` · tier `foundations` · level L1 (theme tokens) |
| Source | `tokens/colors.css` → assembled into `dist/theme.css` |
| Spec of record | `loop/refs/tok-color-palette/spec.md` (Figma `tJnXUZbEL3fRWG7h1z0ij7`, node `287-98`) |
| ODC target | Theme module **`SandboxKharlo`** → Theme editor |

## Code to paste into ODC

**One paste: the whole of `dist/theme.css`.**

Tokens deliberately do **not** get embedded in this document. They travel once, via
`dist/theme.css`, which is its own paste — duplicating them here would create a second copy that
drifts from the build the moment a token changes. That is why `handover/handover-map.json` has no
entry for this item, and why `npm run embed:handover` correctly embeds nothing.

Regenerate before pasting, so you are pasting the current build:

```bash
npm run build:theme
```

Then paste the full contents of `dist/theme.css` into the **`SandboxKharlo`** theme in ODC.

Keep the file's `/*!` header, Section Index and section banners intact — they are how anyone
later works out which block of `:root` came from where. `npm run build:theme:ship` produces the
customer-facing variant with ordinary provenance comments stripped and the index kept; use that
one only when handing the file to the customer, not for this paste.

## What this changes in ODC, and what it does not

The palette **redefines ten custom properties OutSystems UI already owns** — `--color-primary`,
`--color-secondary`, `--color-error`, `--color-error-light`, `--color-warning`,
`--color-warning-light`, `--color-success`, `--color-success-light`, `--color-info`,
`--color-info-light`.

That collision is the mechanism, not a mistake. The theme loads after OutSystems UI at equal
`:root` specificity, so it wins, and every native widget re-brands with no framework edit and no
hard-coded value. Measured on the compiled framework: `var(--color-primary)` alone has **149**
consumers (`.btn-primary`, `.dropdown-container`, `.choices`, `.flatpickr-*`, `.carousel`, …).
A namespaced `--uswds-color-*` would have re-branded none of them.

**Expect visible change across the whole app on publish**, not just where you apply a class.

Untouched, because the Colors ref does not define them: `--color-neutral-0..10`,
`--color-primary-hover`, `--color-focus-outer`, `--color-background-body`. Those keep their
OutSystems UI defaults until a later override item re-points them.

## Build in ODC with Mentor Studio

**Nothing for Mentor to do on this item — deliberately, and this section is here to say so
rather than be silently absent.**

Mentor Studio is a logic and data agent: it scaffolds Blocks, attribute bindings, event wiring
and Client Actions. This deliverable is a theme-token paste. It creates no Block, exposes no
input parameter, raises no event and adds no Client Action, so a Mentor prompt here would have
nothing to scaffold and would only invite it to invent structure nobody asked for.

The component items that follow (`cmp-buttons` onward) each carry a real, filled Mentor prompt.

## Checklist

- [ ] `npm run build:theme` run immediately before copying, so the paste matches the branch
- [ ] Full `dist/theme.css` pasted into the `SandboxKharlo` theme
- [ ] Published, then checked in a **real browser** — never Service Studio Preview alone
- [ ] Sanity-check one native widget that consumes a redefined token (an OutSystems UI Button
      renders `#005EA2`, not the framework's default blue)
- [ ] Confirm nothing regressed on screens using `--color-neutral-*`, which this item leaves alone

## Open findings linked to this work

- [#1](https://github.com/kharloridado/us-web-design-system/issues/1) — **a11y / sev:high** —
  `.alert-info` (2.24:1) and `.alert-success` (3.14:1) fail WCAG 2.1 AA once the palette is
  applied, because OutSystems UI puts a white foreground on the base colour token.

  **Do not fix this by changing a colour in the theme.** The palette matches the design exactly;
  the conflict is in the pairing OutSystems UI supplies. The remedy lands in the semantic-role /
  `outsystems-ui-overrides` item or in the Alert item, once a designer has ruled. Until then the
  faithful build stands, and the two AA-clean options are recorded on the issue.
