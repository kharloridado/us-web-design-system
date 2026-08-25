# Findings Register — `US Federal Government` / `USWDS`
> Next ID: FND-010
>
> Local mirror of design-conformance findings. Live tracker = GitHub Issues labeled `finding`.
> The implementation always matches the approved design; rows here track conflicts awaiting a design/brand decision.

Increment **Next ID** every time you add a row. IDs are never reused, never renumbered, and never deleted —
a withdrawn or not-reproduced finding keeps its row and its ID, and the disposition records why. The
register is the audit trail of everything that was raised, not only of what is still open.

## Column schema

| Column | What goes in it |
|---|---|
| **ID** | `FND-NNN`, taken from the Next ID counter above. |
| **Type** | `a11y/contrast`, `a11y/brand`, `brand/token`, `design-token`, `consistency` — or a slash-combination of them. |
| **Sev** | `blocker` / `high` / `medium` / `low`. This drives the gate (below). |
| **Location** | Where it appears: the design node id and/or the code path. Specific enough that someone else can go and look at it. |
| **Observed** | What the design actually does — the measured, quoted fact, with its measurement (the computed contrast ratio, the two conflicting values, the exact hex). Not an opinion. |
| **Rule** | The rule it conflicts with: the WCAG success criterion, the brand rule, or the token rule. |
| **Recommendation** | What we propose, **with the measured result of the proposal**, plus a note of what was actually built (which is always: faithfully, as designed). Every value you recommend must have been recomputed first — see the warning in `DESIGNER-DECISION-TEMPLATE.md`. |
| **Disposition** | One value from the vocabulary below. |
| **Issue** | Link to the GitHub bug, or `n/a` when the gate kept it register-only. |

## Disposition vocabulary

Use exactly these values. Anything else and the register stops being greppable.

| Disposition | Meaning |
|---|---|
| `filed` | Raised and opened as a GitHub bug; awaiting triage. The landing state for any gated finding. |
| `resolved` | A human (designer or brand owner) ruled on it and the ruling needed **no code change** — the faithful build stands, or the cleanup lives in the design file. |
| `resolved (code changed)` | A human ruled on it and the ruling **changed the code**. The row records the new spec and where it was applied. |
| `withdrawn` | We raised it in error: the rule we cited was not actually a rule on this project (an unconfirmed convention, a misread spec). Ours to own, not the designer's. |
| `closed (not reproduced)` | It survived initial suspicion but failed the adversarial challenge — audited against real rendered usage, the problem does not materialise. Register-only; any bug opened for it gets closed. |
| `open (awaiting designer)` | Presented to the designer with measured options; no ruling yet. The only disposition that legitimately blocks a deliverable. |
| `open (register-only, medium)` | Real, below the `high+` gate, but consequential enough to want a ruling before work builds on it. Logged, not ticketed; raise it at the next design review rather than batching it indefinitely. |
| `open (register-only, low)` | Real, but below the gate. Logged, not ticketed, not chased; batched into the next design-hygiene pass. |

## The gate

`findings.gate` in `project.config.json` (default **`high+`**) decides what becomes a GitHub bug: only
**high** and **blocker** findings open issues and notify. **Medium** and **low** findings stay here in the
register.

That is deliberate, and it is what keeps the board from drowning. A real design library will generate
dozens of low-severity token-naming and consistency observations; if every one becomes a board item, the
two findings that genuinely block a release get lost among them. The register keeps them all; the gate
keeps most of them off the board.

Raise the gate to `medium+` only if the customer has explicitly asked for medium findings to be triaged.

## Before you add a row

Check the finding does not already exist — here, and on the board. Re-filing an existing finding under a
new ID is the most common way this file goes wrong.

Check it against `knownFalsePositiveClasses` in `project.config.json`, and against any convention marked
`assumed` or `TBD`. **A convention that is not `confirmed` is not a rule, and nothing can be a finding
against it.**

Every finding — raised or merely suspected — must survive a refutation against **real rendered usage**
before it is filed. A colour that fails contrast as text is not a finding if nothing in the build ever
renders it as text. A finding that fails that challenge gets a row with `closed (not reproduced)`, never a
bug.

---

| ID | Type | Sev | Location | Observed | Rule | Recommendation | Disposition | Issue |
|---|---|---|---|---|---|---|---|---|

| FND-001 | a11y/contrast | high | node `287-98` → `tokens/colors.css` `--color-info` / `--color-success`; rendered at `outsystems-ui.css:6953-6958` | Native Alert renders white on the base token: `.alert-info` #FFFFFF on #00BDE3 = **2.24:1**; `.alert-success` / `.btn-success` #FFFFFF on #00A91C = **3.14:1**. Measured in headless Chrome on real `.alert-*` markup under the full cascade. OSUI already special-cases `.alert-warning` to dark text and does not for info/success. No developer opt-in required. | WCAG 2.1 SC 1.4.3 Contrast (Minimum) — 4.5:1 normal, 3:1 large. `info` fails both; `success` fails normal. | A: dark foreground — `--color-base-ink` #1B1B1B on #00BDE3 = **7.70:1**, on #00A91C = **5.49:1**. B: keep white, re-point fill to `-darker` — #2E6276 = **6.72:1**, #446443 = **6.67:1**. All recomputed; all pass AA. Built faithfully as designed — no hex altered. | `filed` | [#1](https://github.com/kharloridado/us-web-design-system/issues/1) |
| FND-002 | consistency | low | `tokens/colors.css` — unprefixed `--color-*` custom-property names | Ten emitted token names collide with OutSystems UI `:root` names (`--color-primary`, `--color-error`, …). Suspicion: they should be namespaced `--uswds-color-*`. | n/a — the suspicion cited no actual rule. | Refuted against rendered usage: theme.css is stylesheet order 2 vs OSUI order 1 at equal `:root` specificity, so all ten resolve to USWDS values in the live page. The override reaches **149** `var(--color-primary)` consumers and 25 `--color-error` consumers; a prefix would re-brand **zero** of them and would break `gen-color-utilities.mjs:36`, whose regex is anchored at `--color-`. `classPrefix` governs BEM class names, not custom properties. The collision IS the re-branding mechanism. | `closed (not reproduced)` | n/a |
| FND-003 | consistency | low | `tokens/colors.css` — the `-light` ramp step vs OSUI's `-light` | OSUI `--color-error-light` is a pale wash `#fceaea`; USWDS `-light` is a mid-tone `#F39268`. Suspicion: redefining it shifts OSUI alert/badge surfaces from wash to mid-tone. | n/a — the suspicion cited no actual rule. | Refuted against rendered usage: `var(--color-*-light)` has exactly two consumers per state — `.background-*-light` and `.text-*-light` (`outsystems-ui.css:16648`, `:16673`). The alert widget consumes the **base** step, never `-light`. The badge has no state-colour rule and takes whichever `.background-*` utility is applied, so it *is* reachable by `-light` — but badge white-on-light-fill measures 1.08–1.16:1 on OSUI's own defaults and 1.24–2.30:1 under USWDS, i.e. a pre-existing upstream defect this palette **improves** rather than creates. And the two utilities measure **6.19:1** (`.background-error-light`) and **9.49:1** (`.background-info-light`) under USWDS values — contrast improves. Downgraded to a documentation correction in `tokens/colors.css`; the real consequence of the same mechanism is FND-001, on the base step. | `closed (not reproduced)` | n/a |
| FND-004 | brand/token | low | `tokens/colors.css` — `--color-secondary` | OSUI ships `--color-secondary` as navy `#303d60`; USWDS defines it as red `#D83933`. Suspicion: a semantic inversion that would surprise developers. | n/a — the suspicion cited no actual rule. | Refuted against rendered usage: only two consumers exist, both opt-in utilities (`.background-secondary`, `.text-secondary`, `outsystems-ui.css:15991`/`:16001`), and nothing in this repo applies them. Real but never rendered. Kept as a forward note for the override layer. | `closed (not reproduced)` | n/a |

| FND-005 | consistency | medium | node `1892-7566` (Font sizes), `2xl` row → `tokens/typography.css` `--font-size-2xl` | The page prints and layer-names the `2xl` row **42px**, but its sample (node `1892:7631`) is styled **40px**. Verified via `get_design_context` per sample node; the other 8 rows are internally consistent. Detected by the checker measuring glyph ink in the exported render — fitted k=5.51 across 8 rows within ±0.5%, `2xl` at 5.21 (a 5.4% outlier); ink height agreed independently (30px measured vs 31.5 expected at 42px, 30.0 at 40px). | Internal consistency of the design system’s own documentation — a specimen page must state the value it demonstrates. The label and the layer name are the same authored string, so they cannot check each other. | Most likely correct the label 42px → 40px, which also aligns all nine scale indices with upstream USWDS (index 14 = 40px). If 42px is intended, restyle the sample instead and note the deliberate departure. **Built as 40px** — the sample’s actual style, since fidelity is to what the design IS, not what it says about itself. | `open (register-only, medium)` | n/a — medium is below the `high+` gate |
| FND-006 | consistency | low | Figma library — variable naming across nodes `287-98` and `1892-7566` | The same literal #1B1B1B is exposed as `Base/base-ink` from the colour palette node and as `Base/ink` from the Font sizes node. Two variable paths, one colour. | n/a — no rule cited; recorded for traceability. | No action. It changes nothing for either item (neither emits a colour from the type node), but anyone later mapping tokens BY VARIABLE PATH rather than by value would find the two disagree. Worth a designer glance during a library-hygiene pass. | `open (register-only, low)` | n/a |
| FND-007 | consistency | low | `tokens/typography.css` `--font-size-xs` vs OutSystems UI `--font-size-xs` | OSUI declares `--font-size-xs: 12px` with 26 `var()` consumers — its small-variant and icon roles (`.btn-small`, `.badge-small`, `.avatar-small`, `.tag-small`, `.input-small`, `.validation-message`, `.breadcrumbs-item .icon`). The USWDS ramp redefines it to 15px, so those 26 rules render 25% larger. The checker measured for damage with realistic content (2-digit badge, 2-letter avatar, "Save changes"): clip_x/clip_y = 0 everywhere, box heights unchanged. **No rendered defect.** | n/a — a name collision with an OSUI custom property is the re-branding mechanism, never a finding (see `knownFalsePositiveClasses`). | Not a bug. What survives is a MAPPING question for the semantic / `outsystems-ui-overrides` layer: OSUI’s `xs` slot is its smallest-text role, and this ramp’s 13px `3xs` step sits closer to that role than the 15px `xs` that lands there by name coincidence. Decide it deliberately rather than inherit it by coincidence. | `open (register-only, low)` | n/a |

| FND-008 | consistency | medium | node `63-49` (Typography) → `tokens/typography.css` weights | Six of the eight Prose steps are bound Figma variables; **h3 and h5 aside, every heading step is Bold 700** — h1 40/700, h2 32/700, h4 16/700, h5 15/700. The two steps bound to **no** variable, `h3` (22px, node `12:115`) and `h6` (13px, node `12:119`), both measure **Regular 400**. Read from the sample nodes' own text styles via `get_design_context`, not from layer names. h6 additionally carries `text-transform: uppercase` and `letter-spacing: 0.325px`. | Internal consistency of the design system's own type ramp — a heading scale that is Bold at five of seven steps and Regular at two invites the reader to treat the two as mistakes. | Confirm intent. It may be deliberate: the node's own callouts annotate h3/h6 as `font-sans-*` while h4/h5 get `font-heading-*`, which are separate ramps upstream in USWDS. But the correlation is worth a designer's eye — **the two steps that break the weight pattern are exactly the two nobody bound to a variable**, which is what drift looks like. **Built as designed**: only 400 and 700 are emitted, and the semantic layer must map h3/h6 to 400. No weight invented, none normalised. | `open (register-only, medium)` | n/a — medium is below the `high+` gate |
| FND-009 | design-token | low | node `63-49` (Typography), text-links block → `tokens/colors.css` | The Typography node exposes `Link/link-visited` = **#562B97** (annotated `color-violet-70v`). That literal is **not** among the 52 colours built by `tok-color-palette` from node `287-98`, which contains no violet ramp at all. The node also references `color-primary` and `color-primary-light` for the other two link states, both of which DO exist in the palette. | CLAUDE.md hard rule 3 — a value with no token is a `design-token` finding. | No action on this item: `tok-typography` owns family, weight and line-height, and inventing a colour token from a type node would create a second source for the palette. Recorded so whichever item owns link roles (semantic-role layer) starts from the known fact that the visited-link colour has no palette entry and must either be added to the palette from its own source node or confirmed as out of scope. **Nothing emitted.** | `open (register-only, low)` | n/a |

<!-- Add rows above, oldest first, and bump the Next ID counter. -->
