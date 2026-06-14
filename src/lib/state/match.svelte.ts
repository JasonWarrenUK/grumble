import {
	finalScore,
	isGameOver,
	leader,
	tallyHands
} from '$lib/scoring/score';
import { DEFAULT_RULES, PRESETS, type PresetId, type Rules } from '$lib/scoring/rules';
import type { GameRecord, Hand, PlayerId } from '$lib/scoring/types';
import { loadMatch, saveMatch } from '$lib/state/persistence';

/**
 * Single source of truth for a match. Lives in a .svelte.ts module so the runes
 * work outside a component — import `match` anywhere and read its getters.
 *
 * Note the getter pattern: `$state`/`$derived` are exposed via accessors so
 * consumers always read the live value rather than a stale snapshot.
 */
function createMatch() {
	let names = $state<Record<PlayerId, string>>({ 0: 'Player 1', 1: 'Player 2' });
	let hands = $state<Hand[]>([]);
	let games = $state<GameRecord[]>([]);
	let rules = $state<Rules>({ ...DEFAULT_RULES });
	let presetId = $state<PresetId>('standard');

	// Rehydrate from localStorage on init (no-op on SSR — persistence guards with `browser`).
	const saved = loadMatch();
	if (saved) {
		names = saved.names;
		hands = saved.hands;
		games = saved.games;
		rules = { ...DEFAULT_RULES, ...saved.rules }; // defensive merge: new keys get defaults
		presetId = saved.presetId;
	}

	const tally = $derived(tallyHands(hands, names, rules));
	const running = $derived(tally.running);
	const lines = $derived(tally.lines);
	const gameOver = $derived(isGameOver(running, rules));
	const gameWinner = $derived(leader(running));
	const preview = $derived(finalScore(running, lines, gameWinner, rules));

	const matchTotals = $derived.by(() => {
		const m: Record<PlayerId, number> = { 0: 0, 1: 0 };
		for (const g of games) {
			m[0] += g.final[0];
			m[1] += g.final[1];
		}
		return m;
	});

	function persist() {
		saveMatch({ version: 1, names, hands, games, rules, presetId });
	}

	return {
		// reads
		get names() {
			return names;
		},
		get hands() {
			return hands;
		},
		get games() {
			return games;
		},
		get running() {
			return running;
		},
		get lines() {
			return lines;
		},
		get gameOver() {
			return gameOver;
		},
		get gameWinner() {
			return gameWinner;
		},
		get preview() {
			return preview;
		},
		get matchTotals() {
			return matchTotals;
		},
		get rules() {
			return rules;
		},
		get presetId() {
			return presetId;
		},

		// mutations
		setName(p: PlayerId, value: string) {
			names = { ...names, [p]: value };
			persist();
		},
		addHand(hand: Hand) {
			hands = [...hands, hand];
			persist();
		},
		removeHand(index: number) {
			hands = hands.filter((_, i) => i !== index);
			persist();
		},
		bankGame() {
			games = [
				...games,
				{
					winner: gameWinner,
					base: { ...running },
					lines: { ...lines },
					final: { ...preview },
					names: { ...names },
					handCount: hands.length
				}
			];
			hands = [];
			persist();
		},
		/** Apply a named preset. Passing 'custom' keeps the current rules (user edits from here). */
		applyPreset(id: PresetId) {
			presetId = id;
			if (id !== 'custom') {
				rules = { ...PRESETS[id].rules };
			}
			persist();
		},
		/** Update a single rule value. Switches presetId to 'custom'. */
		setRule<K extends keyof Rules>(key: K, value: number) {
			rules = { ...rules, [key]: value };
			presetId = 'custom';
			persist();
		},
		/** Clear hands and banked games; keep names and rules. */
		resetMatch() {
			hands = [];
			games = [];
			persist();
		}
	};
}

export const match = createMatch();
export type Match = ReturnType<typeof createMatch>;
