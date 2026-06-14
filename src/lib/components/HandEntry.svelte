<script lang="ts">
	import { match } from '$lib/state/match.svelte';
	import DeadwoodCalculator from './DeadwoodCalculator.svelte';
	import type { HandType, PlayerId } from '$lib/scoring/types';

	let entryType = $state<HandType>('knock');
	let winner = $state<PlayerId>(0);
	let knockerDeadwood = $state('');
	let oppDeadwood = $state('');

	const resultOptions: [HandType, string][] = [
		['knock', 'Knock'],
		['gin', 'Gin'],
		['bigGin', 'Big Gin']
	];
	const players: PlayerId[] = [0, 1];

	const onlyDigits = (s: string) => s.replace(/\D/g, '');

	function record() {
		match.addHand({
			type: entryType,
			winner,
			knockerDeadwood: parseInt(knockerDeadwood || '0', 10),
			oppDeadwood: parseInt(oppDeadwood || '0', 10)
		});
		knockerDeadwood = '';
		oppDeadwood = '';
	}
</script>

<section class="entry">
	<div class="row">
		<div class="field">
			<span class="lbl">Result</span>
			<div class="seg-wrap">
				{#each resultOptions as [v, l] (v)}
					<button class="seg" class:on={entryType === v} onclick={() => (entryType = v)}>
						{l}
					</button>
				{/each}
			</div>
		</div>
		<div class="field">
			<span class="lbl">{entryType === 'knock' ? 'Knocker / winner' : 'Went out'}</span>
			<div class="seg-wrap">
				{#each players as p (p)}
					<button class="seg" class:on={winner === p} onclick={() => (winner = p)}>
						{match.names[p]}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="row">
		{#if entryType === 'knock'}
			<div class="field">
				<span class="lbl">Knocker deadwood</span>
				<input
					class="num"
					inputmode="numeric"
					placeholder="0"
					value={knockerDeadwood}
					oninput={(e) => (knockerDeadwood = onlyDigits(e.currentTarget.value))}
				/>
			</div>
		{/if}
		<div class="field">
			<span class="lbl">Opponent deadwood</span>
			<input
				class="num"
				inputmode="numeric"
				placeholder="0"
				value={oppDeadwood}
				oninput={(e) => (oppDeadwood = onlyDigits(e.currentTarget.value))}
			/>
		</div>
		<DeadwoodCalculator onUse={(t) => (oppDeadwood = String(t))} />
	</div>

	<button class="add" onclick={record} disabled={match.gameOver}>Record hand</button>
</section>

<style>
	.entry {
		background: rgba(0, 0, 0, 0.18);
		border: 1px solid rgba(217, 180, 74, 0.2);
		border-radius: 16px;
		padding: 16px;
		margin-bottom: 14px;
	}
	.row {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 12px;
	}
	.field {
		flex: 1;
		min-width: 140px;
	}
	.lbl {
		display: block;
		font: 11px var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 1px;
		opacity: 0.7;
		margin-bottom: 6px;
	}
	.seg-wrap {
		display: flex;
		gap: 4px;
		background: rgba(0, 0, 0, 0.25);
		border-radius: 10px;
		padding: 4px;
	}
	.seg {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--cream);
		padding: 8px 4px;
		border-radius: 7px;
		font-size: 13px;
		font-weight: 500;
	}
	.seg.on {
		background: var(--gold);
		color: var(--ink);
		font-weight: 700;
	}
	.num {
		width: 100%;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(217, 180, 74, 0.3);
		border-radius: 10px;
		color: var(--cream);
		font-size: 22px;
		padding: 10px 12px;
		text-align: center;
	}
	.add {
		width: 100%;
		background: var(--gold);
		color: var(--ink);
		border: none;
		border-radius: 12px;
		padding: 14px;
		font-size: 16px;
		font-weight: 700;
		letter-spacing: 0.5px;
	}
	.add:disabled {
		opacity: 0.4;
	}
</style>
