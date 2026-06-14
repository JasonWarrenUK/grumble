import {
	finalScore,
	isGameOver,
	leader,
	tallyHands
} from '$lib/scoring/score';
import type { GameRecord, Hand, PlayerId } from '$lib/scoring/types';

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

	const tally = $derived(tallyHands(hands, names));
	const running = $derived(tally.running);
	const lines = $derived(tally.lines);
	const gameOver = $derived(isGameOver(running));
	const gameWinner = $derived(leader(running));
	const preview = $derived(finalScore(running, lines, gameWinner));

	const matchTotals = $derived.by(() => {
		const m: Record<PlayerId, number> = { 0: 0, 1: 0 };
		for (const g of games) {
			m[0] += g.final[0];
			m[1] += g.final[1];
		}
		return m;
	});

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

		// mutations
		setName(p: PlayerId, value: string) {
			names = { ...names, [p]: value };
		},
		addHand(hand: Hand) {
			hands = [...hands, hand];
		},
		removeHand(index: number) {
			hands = hands.filter((_, i) => i !== index);
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
		},
		resetMatch() {
			hands = [];
			games = [];
		}
	};
}

export const match = createMatch();
export type Match = ReturnType<typeof createMatch>;
