// Scoring rule values live in rules.ts as the `Rules` interface + `DEFAULT_RULES`.
// Domain types only here.

export type PlayerId = 0 | 1;

export type HandType = 'knock' | 'gin' | 'bigGin';

export interface Hand {
	type: HandType;
	/** the player who went out / knocked */
	winner: PlayerId;
	/** knocker's deadwood — ignored for gin/bigGin */
	knockerDeadwood: number;
	/** opponent's deadwood after lay-off */
	oppDeadwood: number;
}

export interface HandResult {
	/** points awarded to each player for this hand */
	pts: Record<PlayerId, number>;
	/** the player who actually took the box (accounts for undercuts) */
	boxWinner: PlayerId | null;
	/** human-readable breakdown */
	detail: string;
}

export interface GameRecord {
	winner: PlayerId;
	base: Record<PlayerId, number>;
	lines: Record<PlayerId, number>;
	final: Record<PlayerId, number>;
	names: Record<PlayerId, string>;
	handCount: number;
}
