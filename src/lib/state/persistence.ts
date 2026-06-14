import { browser } from '$app/environment';
import { DEFAULT_RULES, type PresetId, type Rules } from '$lib/scoring/rules';
import type { GameRecord, Hand, PlayerId } from '$lib/scoring/types';

const STORAGE_KEY = 'grumble:match';
const SCHEMA_VERSION = 1;

export interface PersistedMatch {
	version: number;
	names: Record<PlayerId, string>;
	hands: Hand[];
	games: GameRecord[];
	rules: Rules;
	presetId: PresetId;
}

/**
 * Load persisted match state from localStorage.
 * Returns null on SSR, missing key, JSON parse error, or schema version mismatch.
 */
export function loadMatch(): PersistedMatch | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as PersistedMatch;
		if (parsed.version !== SCHEMA_VERSION) return null;
		// Merge rules defensively so any newly-added rule key gets a sane default.
		parsed.rules = { ...DEFAULT_RULES, ...parsed.rules };
		return parsed;
	} catch {
		return null;
	}
}

/** Persist match state to localStorage. No-op on SSR. */
export function saveMatch(state: PersistedMatch): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Storage quota exceeded or privacy mode — fail silently.
	}
}
