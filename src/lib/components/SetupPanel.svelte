<script lang="ts">
	import { match } from '$lib/state/match.svelte';
	import { PRESETS, type PresetId, type Rules } from '$lib/scoring/rules';
	import type { PlayerId } from '$lib/scoring/types';

	let open = $state(false);

	// Two-tap "New match" confirm: first tap arms, second tap fires.
	let confirmingReset = $state(false);

	function handleReset() {
		if (!confirmingReset) {
			confirmingReset = true;
			// Auto-disarm after 3 s if the user doesn't confirm.
			setTimeout(() => (confirmingReset = false), 3000);
			return;
		}
		match.resetMatch();
		confirmingReset = false;
	}

	const players: PlayerId[] = [0, 1];
	const presets = Object.values(PRESETS) as (typeof PRESETS)[PresetId][];

	// Rule field labels for the Custom section.
	const ruleFields: { key: keyof Rules; label: string }[] = [
		{ key: 'GAME_TARGET', label: 'Game target' },
		{ key: 'GIN_BONUS', label: 'Gin bonus' },
		{ key: 'BIG_GIN_BONUS', label: 'Big gin bonus' },
		{ key: 'UNDERCUT_BONUS', label: 'Undercut bonus' },
		{ key: 'LINE_BONUS', label: 'Line bonus' },
		{ key: 'GAME_BONUS', label: 'Game bonus' }
	];

	const onlyDigits = (s: string) => s.replace(/\D/g, '');

	function handleRuleInput(key: keyof Rules, raw: string) {
		const n = parseInt(onlyDigits(raw) || '0', 10);
		match.setRule(key, n);
	}
</script>

<div class="wrap">
	<button class="toggle" onclick={() => (open = !open)} aria-expanded={open}>
		{open ? '▲ Hide setup' : '⚙ Match setup'}
	</button>

	{#if open}
		<div class="panel">
			<section class="section">
				<div class="section-head">Players</div>
				<div class="fields">
					{#each players as p (p)}
						<div class="field">
							<label class="lbl" for="player-{p}">Player {p + 1}</label>
							<input
								id="player-{p}"
								class="text-input"
								value={match.names[p]}
								oninput={(e) => match.setName(p, e.currentTarget.value)}
								placeholder="Player {p + 1}"
							/>
						</div>
					{/each}
				</div>
			</section>

			<section class="section">
				<div class="section-head">Rules</div>
				<div class="presets">
					{#each presets as preset (preset.id)}
						<label class="preset" class:on={match.presetId === preset.id}>
							<input
								type="radio"
								name="preset"
								value={preset.id}
								checked={match.presetId === preset.id}
								onchange={() => match.applyPreset(preset.id)}
							/>
							<span class="preset-label">{preset.label}</span>
							<span class="preset-desc">{preset.description}</span>
						</label>
					{/each}
				</div>

				{#if match.presetId === 'custom'}
					<div class="custom-fields">
						{#each ruleFields as { key, label } (key)}
							<div class="field">
								<label class="lbl" for="rule-{key}">{label}</label>
								<input
									id="rule-{key}"
									class="num-input"
									inputmode="numeric"
									value={match.rules[key]}
									oninput={(e) => handleRuleInput(key, e.currentTarget.value)}
								/>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<section class="section reset-section">
				<button
					class="reset-btn"
					class:armed={confirmingReset}
					onclick={handleReset}
					disabled={match.hands.length === 0 && match.games.length === 0}
				>
					{confirmingReset ? 'Tap again to confirm — this clears all hands and games' : 'New match'}
				</button>
			</section>
		</div>
	{/if}
</div>

<style>
	.wrap {
		margin-bottom: 14px;
	}
	.toggle {
		background: transparent;
		border: none;
		color: var(--gold);
		font: 12px var(--font-mono);
		letter-spacing: 0.5px;
		padding: 0;
		opacity: 0.75;
	}
	.toggle:hover {
		opacity: 1;
	}
	.panel {
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(217, 180, 74, 0.2);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin-top: var(--space-2);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.section-head {
		font: 11px var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: var(--gold);
	}
	.fields {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.lbl {
		font: 11px var(--font-mono);
		opacity: 0.6;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	.text-input {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(217, 180, 74, 0.3);
		border-radius: var(--radius-sm);
		color: var(--cream);
		font: 700 14px var(--font-sans);
		padding: 8px 10px;
		width: 100%;
	}
	.presets {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.preset {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: 8px 10px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		border: 1px solid rgba(217, 180, 74, 0.1);
		transition: background 0.1s;
	}
	.preset:hover {
		background: rgba(217, 180, 74, 0.07);
	}
	.preset.on {
		background: rgba(217, 180, 74, 0.12);
		border-color: rgba(217, 180, 74, 0.35);
	}
	.preset input[type='radio'] {
		accent-color: var(--gold);
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}
	.preset-label {
		font: 600 13px var(--font-sans);
		color: var(--cream);
	}
	.preset-desc {
		font: 11px var(--font-mono);
		opacity: 0.55;
		margin-left: auto;
	}
	.custom-fields {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
		padding-top: var(--space-2);
	}
	.num-input {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(217, 180, 74, 0.3);
		border-radius: var(--radius-sm);
		color: var(--cream);
		font-size: 18px;
		padding: 8px 10px;
		text-align: center;
		width: 100%;
	}
	.reset-section {
		border-top: 1px solid rgba(243, 236, 216, 0.1);
		padding-top: var(--space-3);
	}
	.reset-btn {
		background: transparent;
		border: 1px solid rgba(243, 236, 216, 0.25);
		border-radius: var(--radius-sm);
		color: var(--cream);
		font-size: 13px;
		padding: 8px 14px;
		opacity: 0.7;
		transition: all 0.15s;
	}
	.reset-btn:hover:not(:disabled) {
		opacity: 1;
		border-color: rgba(243, 236, 216, 0.5);
	}
	.reset-btn.armed {
		border-color: #e88;
		color: #e88;
		opacity: 1;
		font-size: 12px;
	}
	.reset-btn:disabled {
		opacity: 0.3;
		cursor: default;
	}
</style>
