// Scoring rule values. Tweak these to change the variant, or let the user
// override them at runtime via the match store's applyPreset / setRule mutations.

export interface Rules {
	GIN_BONUS: number;
	BIG_GIN_BONUS: number;
	UNDERCUT_BONUS: number;
	/** Per box won, applied as a lump sum at game end. */
	LINE_BONUS: number;
	/** Awarded to the game winner on top of line bonuses. */
	GAME_BONUS: number;
	/** A game ends once a player's running total reaches or exceeds this. */
	GAME_TARGET: number;
}

export const DEFAULT_RULES: Rules = {
	GIN_BONUS: 25,
	BIG_GIN_BONUS: 50,
	UNDERCUT_BONUS: 25,
	LINE_BONUS: 25,
	GAME_BONUS: 100,
	GAME_TARGET: 100
};

export type PresetId = 'standard' | 'quick' | 'custom';

export interface Preset {
	id: PresetId;
	label: string;
	description: string;
	rules: Rules;
}

/** Named presets. 'custom' is seeded from DEFAULT_RULES; the user edits from there. */
export const PRESETS: Record<PresetId, Preset> = {
	standard: {
		id: 'standard',
		label: 'Standard',
		description: 'Classic Gin Rummy to 100',
		rules: { ...DEFAULT_RULES }
	},
	quick: {
		id: 'quick',
		label: 'Quick',
		description: 'First to 50 for a faster game',
		rules: { ...DEFAULT_RULES, GAME_TARGET: 50 }
	},
	custom: {
		id: 'custom',
		label: 'Custom',
		description: 'Set your own rules',
		rules: { ...DEFAULT_RULES }
	}
};
