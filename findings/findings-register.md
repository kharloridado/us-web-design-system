# Findings Register — `US Federal Government` / `USWDS`
> Next ID: FND-005
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

<!-- Add rows above, oldest first, and bump the Next ID counter. -->
