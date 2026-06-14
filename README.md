# Grumble — Gin Rummy scorer

SvelteKit + Svelte 5 (runes). Hand-by-hand scoring with deadwood calc, running
totals, line/game bonuses, and multi-game match history.

## Setup

```bash
bun install
bun dev          # dev server
bun test         # bun:test — scoring unit tests
bun run check    # svelte-check
```

## Structure

```
src/
├─ lib/
│  ├─ scoring/              pure, framework-free, fully testable
│  │  ├─ types.ts           RULES constants + domain types
│  │  ├─ cards.ts           card values + deadwood()
│  │  ├─ score.ts           scoreHand, tallyHands, finalScore
│  │  └─ score.test.ts      vitest coverage incl. undercut edge cases
│  ├─ state/
│  │  └─ match.svelte.ts    reactive match store (runes, getter pattern)
│  └─ components/
│     ├─ Scoreboard.svelte
│     ├─ HandEntry.svelte
│     ├─ DeadwoodCalculator.svelte
│     ├─ HandLog.svelte
│     └─ MatchHistory.svelte
├─ routes/
│  ├─ +layout.svelte
│  └─ +page.svelte
├─ app.css                  design tokens (felt/gold palette, fonts)
└─ app.html
```

## Architecture notes

The split is deliberate. Everything in `scoring/` is pure TypeScript with no
Svelte imports — that's what the tests hit, and it's where the rules live. The
reactive layer (`match.svelte.ts`) is a thin runes wrapper that calls into those
pure functions via `$derived`, exposing live values through getters so consumers
never read a stale snapshot. Components are dumb: they read `match.*` and call
mutations.

To change the variant, edit `RULES` in `types.ts`. Nothing else needs touching.

## Known gaps / next steps

- **No persistence.** State is in-memory; a refresh clears it. Add a `$effect`
  in `match.svelte.ts` that serialises to `localStorage`, plus a load on init.
- **Line bonus = per hand won.** If your house rules ladder lines differently,
  `tallyHands` / `finalScore` are where to change it.
- **Two players only.** The `PlayerId = 0 | 1` type would need widening for more.
- No "new match" button in the UI yet — `match.resetMatch()` exists, just unwired.
```
