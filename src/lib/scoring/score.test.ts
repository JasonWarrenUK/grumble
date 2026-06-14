import { describe, expect, it } from 'vitest';
import { scoreHand, tallyHands, finalScore } from './score';
import { RULES, type Hand, type PlayerId } from './types';

const names: Record<PlayerId, string> = { 0: 'A', 1: 'B' };

describe('scoreHand', () => {
	it('scores a clean knock as the deadwood difference', () => {
		const hand: Hand = { type: 'knock', winner: 0, knockerDeadwood: 4, oppDeadwood: 20 };
		const { pts, boxWinner } = scoreHand(hand, names);
		expect(pts[0]).toBe(16);
		expect(pts[1]).toBe(0);
		expect(boxWinner).toBe(0);
	});

	it('flips a knock to an undercut when opponent deadwood is lower or equal', () => {
		const hand: Hand = { type: 'knock', winner: 0, knockerDeadwood: 10, oppDeadwood: 6 };
		const { pts, boxWinner } = scoreHand(hand, names);
		// opponent wins: (10 - 6) + undercut bonus
		expect(pts[1]).toBe(4 + RULES.UNDERCUT_BONUS);
		expect(pts[0]).toBe(0);
		expect(boxWinner).toBe(1);
	});

	it('treats equal deadwood on a knock as an undercut (bonus only)', () => {
		const hand: Hand = { type: 'knock', winner: 0, knockerDeadwood: 8, oppDeadwood: 8 };
		const { pts } = scoreHand(hand, names);
		expect(pts[1]).toBe(RULES.UNDERCUT_BONUS);
	});

	it('scores gin as opponent deadwood plus the gin bonus', () => {
		const hand: Hand = { type: 'gin', winner: 1, knockerDeadwood: 0, oppDeadwood: 12 };
		expect(scoreHand(hand, names).pts[1]).toBe(12 + RULES.GIN_BONUS);
	});

	it('scores big gin with the larger bonus', () => {
		const hand: Hand = { type: 'bigGin', winner: 0, knockerDeadwood: 0, oppDeadwood: 9 };
		expect(scoreHand(hand, names).pts[0]).toBe(9 + RULES.BIG_GIN_BONUS);
	});
});

describe('tallyHands + finalScore', () => {
	it('accumulates running totals and counts lines per box winner', () => {
		const hands: Hand[] = [
			{ type: 'gin', winner: 0, knockerDeadwood: 0, oppDeadwood: 10 }, // A +35
			{ type: 'knock', winner: 1, knockerDeadwood: 5, oppDeadwood: 5 } // undercut -> A +25
		];
		const { running, lines } = tallyHands(hands, names);
		expect(running[0]).toBe(35);
		expect(running[1]).toBe(RULES.UNDERCUT_BONUS);
		expect(lines[0]).toBe(1);
		expect(lines[1]).toBe(1);
	});

	it('applies line and game bonuses at game end', () => {
		const running: Record<PlayerId, number> = { 0: 105, 1: 40 };
		const lines: Record<PlayerId, number> = { 0: 3, 1: 1 };
		const final = finalScore(running, lines, 0);
		expect(final[0]).toBe(105 + 3 * RULES.LINE_BONUS + RULES.GAME_BONUS);
		expect(final[1]).toBe(40 + 1 * RULES.LINE_BONUS);
	});
});
