# Loop Goal — US Web Design System

The run contract for `/outsystems-loop:design-loop`. Fill in every `<…>` before the first run. The orchestrator, `@outsystems-loop:maker` and `@outsystems-loop:checker` all read this file; anything not written here has not been agreed, and the loop must not assume it.

## Goal

Translate the U.S. Web Design System Figma library into OutSystems ODC faithfully, tier by tier, as theme tokens + block CSS + Web Components, each handed over as a GitHub Task.

## Inventory of record — REQUIRED

The loop does not build from a Figma page, a screenshot, or a conversation. It builds from an inventory somebody with authority over scope has committed to.

| Field | Value |
|---|---|
| **Inventory source** | `artifact` |
| Inventory artifact | **The inventory table in this file** (below). `git log loop/goal.md` is the audit trail. |
| Signed off by | Kharlo Ridado, OutSystems Professional Services (supplied the list, 2026-08-20) |
| Date signed off | 2026-08-20 |
| Supersedes | none — first inventory for this engagement |

**Hard rule: no component enters the build queue without a row in the inventory of record.**

### The inventory

Ordered by dependency. The loop builds top to bottom and stops at each tier checkpoint.

| # | Component | Tier | Figma node | Notes |
|---|---|---|---|---|
| 1 | Color palette | `foundations` | [`287-98`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=287-98&m=dev) | 52 Figma variables verified readable via get_variable_defs |
| 2 | Font sizes | `foundations` | [`1892-7566`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-7566&m=dev) | Type scale ramp |
| 3 | Typography | `foundations` | [`63-49`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=63-49&m=dev) | Families, weights, line-heights |
| 4 | Buttons | `primitives` | [`1868-83`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1868-83&m=dev) | Restyle native OSUI .btn |
| 5 | Button group | `primitives` | [`1892-3789`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-3789&m=dev) | Depends on Buttons |
| 6 | Inputs | `primitives` | [`1892-3213`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-3213&m=dev) | Restyle native OSUI input |
| 7 | Alert | `primitives` | [`1879-1235`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1879-1235&m=dev) |  |
| 8 | Breadcrumbs | `primitives` | [`1892-3816`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-3816&m=dev) |  |
| 9 | Pagination | `primitives` | [`1892-4485`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-4485&m=dev) |  |
| 10 | Inputs with labels and character counts | `composites` | [`1892-3838`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-3838&m=dev) | Depends on Inputs |
| 11 | Combo box / Select / Dropdown | `composites` | [`1892-3864`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-3864&m=dev) | Check OSUI Dropdown + virtual-select provider first |
| 12 | Date picker | `composites` | [`1892-3927`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-3927&m=dev) | Check OSUI DatePicker + flatpickr provider first |
| 13 | Date range picker | `composites` | [`1892-4051`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-4051&m=dev) | Depends on Date picker |
| 14 | File input | `composites` | [`1892-4140`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-4140&m=dev) |  |
| 15 | Cards | `composites` | [`1892-5111`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-5111&m=dev) |  |
| 16 | Accordion | `composites` | [`1890-62`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1890-62&m=dev) |  |
| 17 | Table | `composites` | [`1892-2502`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-2502&m=dev) |  |
| 18 | Modal / Popup | `patterns` | [`1892-2033`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=1892-2033&m=dev) |  |

**20 deliverables.** Items 1–18 each carry a Figma node id. Items 19 and 20 were added after the original signing and are recorded below rather than landed silently. Item 19 is specified in prose — a written spec of record, which `loop/refs/README.md` accepts as a legitimate ref. None is blocked on a missing spec.

> **Scope change, 2026-08-20.** Item 19 was added after the original signing, at the request of
> Kharlo Ridado, and is recorded here rather than landed silently — the hard rule is that nothing
> enters the build queue without a row in this table. It is tooling, not a design deliverable.

| 19 | Live Style Guide — colour specimen | `foundations` | _written spec_ ([`loop/refs/sg-palette-specimen/spec.md`](loop/refs/sg-palette-specimen/spec.md)) | **Added 2026-08-20**, after the checker flagged that three consecutive token items would produce no visual output. Preview-only chrome; ships nothing to ODC. Depends on item 1. |

> **Scope change, 2026-08-25.** Item 20 was added at the request of Kharlo Ridado, during review of
> item 3, on evidence rather than opinion: `tok-typography` emits family, weight and line-height as
> `:root` tokens, and **most of that reaches no OutSystems UI rule at all**. Measured in the compiled
> framework (`preview/vendor/outsystems-ui/outsystems-ui.css`):
>
> - `h1`–`h6` / `.heading1`–`.heading6` size themselves from `var(--font-size-h1…h6)`, which
>   OutSystems UI declares (32/28/26/22/20/18px) and item 3 never redefined — so native headings
>   still render at framework sizes, not USWDS ones. **67 consumers** across the six roles.
> - Heading `line-height` is the literal `1.25` (`:1170`), and **48** `line-height:` declarations in
>   the file read no custom property at all. `--line-height-heading` currently reaches nothing.
> - `font-family` is hard-coded in the `html` rule (`:949`). `--font-family-base` reaches nothing.
>
> Colour re-brands through variables alone; **typography does not**. This item is the difference,
> and it is a mapping-and-override deliverable, not a second source of type values — the ramp stays
> owned by item 2 and the family/weight/line-height by item 3.
>
> It carries a real ref: node `63-49`, already frozen at `loop/refs/tok-typography/`, states the
> role→size mapping directly (h1 40 · h2 32 · h3 22 · h4 16 · h5 15 · h6 13), which is the "role"
> column item 2 deliberately declined to emit. Nothing here is invented.
>
> **Font loading is NOT in this row.** Declaring `Public Sans` does not ship the face, so until an
> `@font-face` exists every declaration resolves to a fallback — but that needs a self-hosted asset
> path and a licensing decision, so it belongs in its own row once someone has made that call. This
> item is written to be correct-but-invisible until then, and that is stated rather than hidden.

| 20 | Typography roles — OutSystems UI inheritance | `foundations` | [`63-49`](https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community-?node-id=63-49&m=dev) (ref already frozen at [`loop/refs/tok-typography/`](loop/refs/tok-typography/)) | **Added 2026-08-25.** Maps the built ramp onto OutSystems UI's own role variables (`--font-size-h1…h6`, `--font-size-label`) in `tokens/outsystems-ui-overrides.css`, and writes the few real rules variables cannot reach — `html`/`body` `font-family`, heading `line-height`. Depends on items 2 and 3. Expect app-wide visual change on publish. |

- When **`Inventory source = artifact`**, the row is a line in the signed table named above. A component that is in Figma but not in the inventory is `needs-human`, not `queued`.
- When **`Inventory source = board`**, the row *is* the card, and the signature is a scope owner having moved it to **`Ready`**. A card that reached `Ready` any other way, or whose "in the agreed scope" box is unticked, is `Blocked` — not `queued`. The loop never moves a card into `Ready` itself.

Either way: a component with no Figma node and no written spec is blocked on a ref (see `loop/refs/README.md`), not built from guesswork.

This section is first, and required, because of what it costs when it is missing. On the source project this template is derived from, two components were built end to end — maker + checker PASS, committed, handover Task opened — and an entire speculative component set was designed and coded, then thrown away, because no confirmed inventory existed and the client's real list turned out to be different. That is the most expensive waste this loop can produce, and refusing to start without an inventory of record prevents all of it.

**What the board version does NOT give you, stated plainly.** A signed table is client-facing; a board is not, and that was the *other* half of that incident. Two mitigations, both of which need a human:

1. `npm run board:sync` regenerates **`deliverables.md`** from the board — a diffable, in-repo, showable snapshot of exactly what was accepted into scope and when. Have the scope owner counter-sign it on a cadence. That is the artifact that stands in for the signed table.
2. Restrict write access on the board to people who can actually commit to scope, because **the loop cannot verify who moved a card.** As far as we can tell, Projects v2 does not expose the actor behind a field-value change in a queryable way, and v2 lane moves do not appear in the issue timeline the way classic project-column moves did. *(This is an assessment, not a verified fact — if you find the query, replace this paragraph with it.)* Until then, "a scope owner moved it to `Ready`" is enforced by access control, not by the loop.

## Figma

| Field | Value |
|---|---|
| Library URL | https://www.figma.com/design/tJnXUZbEL3fRWG7h1z0ij7/U.S.-Web-Design-System--USWDS--UI-Design-Kit--Community- |
| **File key** | `tJnXUZbEL3fRWG7h1z0ij7` |
| In scope | The 18 nodes listed in the inventory table above |
| Out of scope | Everything else in the library — banners, footers, identifiers, icons, side navigation, step indicators, tags, tooltips, process lists, summary boxes. Not refused, just not in this inventory; add a row to bring one in. |

**Track the file key, not just the URL.** Design libraries get duplicated, forked and re-versioned, and a fork carries a *different file key* while looking identical in conversation and in a screenshot. Every frozen ref records the file key it was pulled from (`loop/refs/<item-id>/spec.md`). If that key differs from the key above, **the ref is stale**: the item becomes `needs-re-ref`, and neither the maker nor the checker may trust the values it froze. On the source project a second library file appeared mid-build and silently re-versioned component values; every ref frozen against the old key quietly became wrong. Record every key change in `design/figma-links.md`.

## Mode

- `single` — one screen or a handful of components; flat queue, no tier gates.
- `library` — full design system: dependency-ordered, tier by tier, with human checkpoints.

Mode for this run: `library`.

## This run — scope

State exactly what this run does and where it stops. A run that "does everything" has no checkpoint and no reviewable output.

Phase 0 (foundations/tokens) only. **Hard stop at the after-tokens checkpoint.** No component work
executes this run: a wrong token cascades into all 15 components downstream, so the foundation is
reviewed before anything is built on it.

- [ ] Color palette (`287-98`) → the colour token layer
- [ ] Font sizes (`1892-7566`) → the type-scale token layer
- [ ] Typography (`63-49`) → families, weights, line-heights
- [ ] `dist/theme.css` regenerated, TOC + section banners intact, every `var(--token)` resolving
- [ ] One PR per item, left open for review — the loop never merges

## The three outcomes — every audited component gets exactly one

| Audit class | Outcome | Artifacts the loop generates |
|---|---|---|
| **Exists as-is** | Use the OutSystems UI component out of the box | None. Verify it matches the design within tolerance; if it does not, it is really the row below. |
| **Exists, not exact** | **Dual-track** | (1) *Alignment track* — L1–L3 overrides (token / utility class / `ExtendedClass` + BEM) so the stock OutSystems UI component renders close to the design for any dev who reaches for it. (2) *Canonical track* — the custom Block or Web Component (L4–L5) the team actually ships. |
| **Doesn't exist** | Build custom | Web Component (L5) + Block wrapper. Canonical. |

The dual track on "exists, not exact" is deliberate: the custom build is the team default, but a developer who grabs the stock widget should still land near the design intent rather than something visibly off-brand.

> **"Customize OutSystems UI" never means editing or forking the OutSystems UI module.** It means overrides layered on top: `:root` tokens, utility classes, `ExtendedClass` + BEM, or a wrapping Block. Upgrade-safe layers only. A change that cannot be expressed as an override is an L5 custom build, not a fork.

## Build model — two independent axes (do not conflate them)

- **Tier** = position in the dependency graph, and therefore **build order**: foundations → primitives → composites → patterns. The tier list is project-configurable — it lives in `state.json.tiers` and may grow mid-project.
- **Escalation level (L1–L5)** = implementation approach, and therefore **effort**: L1 token · L2 utility class · L3 `ExtendedClass` + BEM · L4 custom Block · L5 Web Component.

A component has exactly one tier and one level. A high tier does not imply a high level: a pattern can be a pure L1 token change, and a primitive can need a full L5 Web Component. The alignment track of an "exists, not exact" component may carry a second, lower level alongside its canonical build.

## Checkpoints (human gates)

At library scale these are the only thing standing between a bad foundation and a hundred components built on top of it.

- **After foundations/tokens → PAUSE** for designer / brand-owner sign-off. A wrong token cascades into every component downstream.
- **After primitives → PAUSE.** Highest-reuse components; lock them before composites depend on them.
- **After composites → continue.**

Mirror these in `state.json.checkpoints`. A checkpoint set to `pause` is a hard stop: the loop writes `loop/REPORT.md`, sets `status`, and exits. It does not carry on and mention it in the report.

## Done-criteria

**This run:** all three foundation items are `built` (maker + checker PASS with `VISUAL: pass`), each on its
own open PR, `npm run build:theme` exits 0, and the run has stopped at `after_tokens` awaiting brand-owner
sign-off. Zero components started.

**Program (full library):** every component in the signed inventory is either **built** (maker + checker PASS, committed, on the Project board, handover Task opened) or **needs-human** (logged with the blocker). All findings filed as Bugs. A consistency pass has run per tier.

## Checker gates

The deterministic gate runs first — `npm run build:theme` exits 0, the token schema resolves, contrast is computed — and a failure there is an instant FAIL before any subjective judgment. Then: fidelity against the frozen ref, token-only (no hard-coded values), BEM with the `uswds-` prefix, Web Component correctness, and accessibility on a flag-don't-fix basis. The full procedure lives in the `@outsystems-loop:checker` agent definition.

## Caps and guardrails

- max maker/checker rounds per item: **3**
- max global iterations: **500** (raise for very large libraries)
- branch — **depends on the inventory source:**
  - `artifact`: one long-lived `loop/<yyyy-mm-dd>-design-system` *(add a phase suffix on re-runs to avoid collisions)*
  - `board`: **one branch per card**, `loop/item/<slug>`, cut fresh from `origin/main` for every item. Each card ships as its own PR, so it cannot share a branch with eleven other components. Cut it per item, not once per run — `board-ship` may have merged something since.
- **dependencies (board mode):** a card's `Depends on` issues must be merged before it is built. A card whose dependency is still open is left in `Ready` with one comment — not `Blocked`, because it clears itself.
- the loop **never applies changes to the live OutSystems environment** — it produces artifacts handed over as GitHub Tasks for a human to add in ODC Studio
- the loop **never resolves a finding** — flag-don't-fix; a designer or brand owner decides
- the loop **never edits or forks the OutSystems UI module** — overrides only
- the loop **never builds a component absent from the inventory of record**, and **never builds an item that has no frozen ref**
- in board mode the loop **never builds a card a scope owner has not moved to `Ready`**, and **never moves a card into `Ready`, `Approved` or `Done` itself**
- in board mode the handover Task is opened **after** the PR merges to `main`, never at checker-PASS — a handover ticket says "paste this into a live environment", and it must not point at unmerged work
- findings are GitHub **Bugs** (Bug issue type + `bug` label); handovers are GitHub **Tasks** assigned to the developer; both in `kharloridado/us-web-design-system`
- **dedup:** every issue carries `[node:<figma-node-id>]` in its body; search before creating, so a re-run never duplicates
- conventions marked `TBD` in `project.config.json` are **not rules** — the checker must not enforce them and must not raise findings against them

## Open decisions (confirm before the next tier)

1. **Dual-track scope:** every "exists, not exact" component, or only when the stock-vs-design delta exceeds a threshold?
2. **Tier taxonomy:** confirm the tier list for this project (`state.json.tiers`) before foundations complete.
3. **Branch reuse** across multiple runs on the same date.
