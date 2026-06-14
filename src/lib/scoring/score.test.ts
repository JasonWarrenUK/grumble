import { describe, expect, it } from 'bun:test';
import { scoreHand, tallyHands, finalScore } from './score';
import { DEFAULT_RULES, type Rules } from './rules';
import type { Hand, PlayerId } from './types';

const names: Record<PlayerId, string> = { 0: 'A', 1: 'B' };

describe('scoreHand', () => {
	it('scores a clean knock as the deadwood difference', () => {
		const hand: Hand = { type: 'knock', winner: 0, knockerDeadwood: 4, oppDeadwood: 20 };
		const { pts, boxWinner } = scoreHand(hand, names, DEFAULT_RULES);
		expect(pts[0]).toBe(16);
		expect(pts[1]).toBe(0);
		expect(boxWinner).toBe(0);
	});

	it('flips a knock to an undercut when opponent deadwood is lower or equal', () => {
		const hand: Hand = { type: 'knock', winner: 0, knockerDeadwood: 10, oppDeadwood: 6 };
		const { pts, boxWinner } = scoreHand(hand, names, DEFAULT_RULES);
		// opponent wins: (10 - 6) + undercut bonus
		expect(pts[1]).toBe(4 + DEFAULT_RULES.UNDERCUT_BONUS);
		expect(pts[0]).toBe(0);
		expect(boxWinner).toBe(1);
	});

	it('treats equal deadwood on a knock as an undercut (bonus only)', () => {
		const hand: Hand = { type: 'knock', winner: 0, knockerDeadwood: 8, oppDeadwood: 8 };
		const { pts } = scoreHand(hand, names, DEFAULT_RULES);
		expect(pts[1]).toBe(DEFAULT_RULES.UNDERCUT_BONUS);
	});

	it('scores gin as opponent deadwood plus the gin bonus', () => {
		const hand: Hand = { type: 'gin', winner: 1, knockerDeadwood: 0, oppDeadwood: 12 };
		expect(scoreHand(hand, names, DEFAULT_RULES).pts[1]).toBe(12 + DEFAULT_RULES.GIN_BONUS);
	});

	it('scores big gin with the larger bonus', () => {
		const hand: Hand = { type: 'bigGin', winner: 0, knockerDeadwood: 0, oppDeadwood: 9 };
		expect(scoreHand(hand, names, DEFAULT_RULES).pts[0]).toBe(9 + DEFAULT_RULES.BIG_GIN_BONUS);
	});

	it('honours a custom gin bonus when rules are overridden', () => {
		const customRules: Rules = { ...DEFAULT_RULES, GIN_BONUS: 50 };
		const hand: Hand = { type: 'gin', winner: 0, knockerDeadwood: 0, oppDeadwood: 10 };
		expect(scoreHand(hand, names, customRules).pts[0]).toBe(60); // 10 + 50
	});
});

describe('tallyHands + finalScore', () => {
	it('accumulates running totals and counts lines per box winner', () => {
		const hands: Hand[] = [
			{ type: 'gin', winner: 0, knockerDeadwood: 0, oppDeadwood: 10 }, // A +35 (10 + GIN_BONUS 25)
			{ type: 'knock', winner: 1, knockerDeadwood: 5, oppDeadwood: 5 } // equal deadwood: undercut, A +25
		];
		const { running, lines } = tallyHands(hands, names, DEFAULT_RULES);
		expect(running[0]).toBe(35 + DEFAULT_RULES.UNDERCUT_BONUS); // gin pts + undercut pts
		expect(running[1]).toBe(0);
		expect(lines[0]).toBe(2); // A wins both boxes
		expect(lines[1]).toBe(0);
	});

	it('applies line and game bonuses at game end', () => {
		const running: Record<PlayerId, number> = { 0: 105, 1: 40 };
		const lines: Record<PlayerId, number> = { 0: 3, 1: 1 };
		const final = finalScore(running, lines, 0, DEFAULT_RULES);
		expect(final[0]).toBe(105 + 3 * DEFAULT_RULES.LINE_BONUS + DEFAULT_RULES.GAME_BONUS);
		expect(final[1]).toBe(40 + 1 * DEFAULT_RULES.LINE_BONUS);
	});

	it('applies a custom game bonus when rules are overridden', () => {
		const customRules: Rules = { ...DEFAULT_RULES, GAME_BONUS: 200 };
		const running: Record<PlayerId, number> = { 0: 110, 1: 30 };
		const lines: Record<PlayerId, number> = { 0: 2, 1: 0 };
		const final = finalScore(running, lines, 0, customRules);
		// winner gets 110 + 2*25 + 200 = 360 (vs 310 under default rules)
		expect(final[0]).toBe(360);
		expect(final[1]).toBe(30);
	});
});
