<script lang="ts">
	import { match } from '$lib/state/match.svelte';
	import type { PlayerId } from '$lib/scoring/types';

	const players: PlayerId[] = [0, 1];
</script>

{#if match.games.length > 0}
	<section class="log">
		<div class="head">Match history</div>
		{#each match.games as g, i (i)}
			<div class="row">
				<span class="num">G{i + 1}</span>
				<div class="detail">
					{#each players as p (p)}
						{@const isWinner = g.winner === p}
						<span class="player-row" class:winner={isWinner}>
							<span class="pname">{g.names[p]}</span>
							<span class="breakdown">
								<span class="base">{g.base[p]}</span>
								{#if g.lines[p] > 0}
									<span class="bonus">+ {g.lines[p]} {g.lines[p] === 1 ? 'line' : 'lines'}</span>
								{/if}
								{#if isWinner}
									<span class="bonus">+ game bonus</span>
								{/if}
								<strong class="total">= {g.final[p]}</strong>
							</span>
						</span>
					{/each}
				</div>
				<span class="pts">{g.names[g.winner]} won</span>
			</div>
		{/each}
		<div class="final">
			Match: {match.names[0]}
			{match.matchTotals[0]} · {match.names[1]}
			{match.matchTotals[1]}
		</div>
	</section>
{:else}
	<section class="log empty">
		<div class="head">Match history</div>
		<p class="hint">Finished games will appear here once you bank one.</p>
	</section>
{/if}

<style>
	.log {
		background: rgba(0, 0, 0, 0.15);
		border-radius: 16px;
		padding: 14px;
		margin-bottom: 14px;
	}
	.log.empty {
		opacity: 0.5;
	}
	.head {
		font: 11px var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: var(--gold);
		margin-bottom: 10px;
	}
	.hint {
		font: 12px var(--font-mono);
		opacity: 0.7;
		margin: 0;
	}
	.row {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 10px 0;
		border-top: 1px solid rgba(243, 236, 216, 0.08);
		font-size: 12px;
		flex-wrap: wrap;
	}
	.num {
		font: var(--font-mono);
		color: var(--gold);
		opacity: 0.7;
		width: 24px;
		padding-top: 2px;
	}
	.detail {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.player-row {
		display: flex;
		align-items: baseline;
		gap: 6px;
		opacity: 0.75;
	}
	.player-row.winner {
		opacity: 1;
	}
	.pname {
		font-weight: 600;
		min-width: 60px;
	}
	.breakdown {
		display: flex;
		align-items: baseline;
		gap: 4px;
		flex-wrap: wrap;
	}
	.base {
		font: 500 12px var(--font-mono);
	}
	.bonus {
		font: 500 11px var(--font-mono);
		color: var(--gold);
		opacity: 0.85;
	}
	.total {
		font: 700 13px var(--font-sans);
		margin-left: 2px;
	}
	.pts {
		font: 500 12px var(--font-mono);
		color: var(--gold);
		white-space: nowrap;
		padding-top: 2px;
	}
	.final {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid var(--gold);
		font: 14px var(--font-mono);
		color: var(--gold);
		text-align: center;
	}
</style>
