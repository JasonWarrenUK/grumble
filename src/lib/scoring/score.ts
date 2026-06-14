import { RULES, type Hand, type HandResult, type PlayerId } from './types';

const other = (p: PlayerId): PlayerId => (p === 0 ? 1 : 0);

/**
 * Score a single hand. Pure: no Svelte, no side effects.
 *
 * Knock: if opponent's deadwood exceeds the knocker's, the knocker scores the
 * difference. If it doesn't (opponent equal or lower), the hand is undercut and
 * the *opponent* takes the box plus the undercut bonus.
 *
 * Gin / Big gin: the player who went out scores opponent deadwood plus the bonus.
 * (No lay-off against gin, so oppDeadwood is the opponent's full hand.)
 */
export function scoreHand(hand: Hand, names: Record<PlayerId, string>): HandResult {
	const { type, winner, knockerDeadwood, oppDeadwood } = hand;
	const loser = other(winner);
	const pts: Record<PlayerId, number> = { 0: 0, 1: 0 };

	if (type === 'gin') {
		pts[winner] = oppDeadwood + RULES.GIN_BONUS;
		return {
			pts,
			boxWinner: winner,
			detail: `${names[winner]} gin: ${oppDeadwood} + ${RULES.GIN_BONUS}`
		};
	}

	if (type === 'bigGin') {
		pts[winner] = oppDeadwood + RULES.BIG_GIN_BONUS;
		return {
			pts,
			boxWinner: winner,
			detail: `${names[winner]} big gin: ${oppDeadwood} + ${RULES.BIG_GIN_BONUS}`
		};
	}

	// knock
	const diff = oppDeadwood - knockerDeadwood;
	if (diff > 0) {
		pts[winner] = diff;
		return {
			pts,
			boxWinner: winner,
			detail: `${names[winner]} knock: ${oppDeadwood} − ${knockerDeadwood}`
		};
	}

	// undercut: opponent takes the box
	pts[loser] = -diff + RULES.UNDERCUT_BONUS;
	return {
		pts,
		boxWinner: loser,
		detail: `${names[loser]} undercut: ${-diff} + ${RULES.UNDERCUT_BONUS}`
	};
}

export interface Tally {
	running: Record<PlayerId, number>;
	lines: Record<PlayerId, number>;
}

/** Roll up a list of hands into running totals and lines (boxes) won. */
export function tallyHands(hands: Hand[], names: Record<PlayerId, string>): Tally {
	const running: Record<PlayerId, number> = { 0: 0, 1: 0 };
	const lines: Record<PlayerId, number> = { 0: 0, 1: 0 };
	for (const h of hands) {
		const { pts, boxWinner } = scoreHand(h, names);
		running[0] += pts[0];
		running[1] += pts[1];
		if (boxWinner !== null) lines[boxWinner]++;
	}
	return { running, lines };
}

/** Apply line + game bonuses to a finished game's running totals. */
export function finalScore(
	running: Record<PlayerId, number>,
	lines: Record<PlayerId, number>,
	gameWinner: PlayerId
): Record<PlayerId, number> {
	return {
		0: running[0] + lines[0] * RULES.LINE_BONUS + (gameWinner === 0 ? RULES.GAME_BONUS : 0),
		1: running[1] + lines[1] * RULES.LINE_BONUS + (gameWinner === 1 ? RULES.GAME_BONUS : 0)
	};
}

export const isGameOver = (running: Record<PlayerId, number>): boolean =>
	running[0] >= RULES.GAME_TARGET || running[1] >= RULES.GAME_TARGET;

export const leader = (running: Record<PlayerId, number>): PlayerId =>
	running[0] >= running[1] ? 0 : 1;
