export const RANKS = [
	'A',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'J',
	'Q',
	'K'
] as const;

export type Rank = (typeof RANKS)[number];

/** Deadwood value of a single card. Ace low (1), faces 10. */
export function cardValue(rank: Rank): number {
	if (rank === 'A') return 1;
	if (rank === '10' || rank === 'J' || rank === 'Q' || rank === 'K') return 10;
	return Number(rank);
}

export function deadwood(cards: Rank[]): number {
	return cards.reduce((sum, r) => sum + cardValue(r), 0);
}
