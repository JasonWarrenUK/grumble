<script lang="ts">
	import { match } from '$lib/state/match.svelte';
	import { RULES } from '$lib/scoring/types';
</script>

{#if match.games.length > 0}
	<section class="log">
		<div class="head">Match history</div>
		{#each match.games as g, i (i)}
			<div class="row">
				<span class="num">G{i + 1}</span>
				<span class="detail">
					{g.names[0]}
					{g.base[0]}+{g.lines[0] * RULES.LINE_BONUS}{g.winner === 0 ? `+${RULES.GAME_BONUS}` : ''}
					= <strong>{g.final[0]}</strong>
					{'  ·  '}
					{g.names[1]}
					{g.base[1]}+{g.lines[1] * RULES.LINE_BONUS}{g.winner === 1 ? `+${RULES.GAME_BONUS}` : ''}
					= <strong>{g.final[1]}</strong>
				</span>
				<span class="pts">{g.names[g.winner]} won</span>
			</div>
		{/each}
		<div class="final">
			Match: {match.names[0]}
			{match.matchTotals[0]} · {match.names[1]}
			{match.matchTotals[1]}
		</div>
	</section>
{/if}

<style>
	.log {
		background: rgba(0, 0, 0, 0.15);
		border-radius: 16px;
		padding: 14px;
		margin-bottom: 14px;
	}
	.head {
		font: 11px var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: var(--gold);
		margin-bottom: 10px;
	}
	.row {
		display: flex;
		align-items: center;
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
	}
	.detail {
		flex: 1;
		opacity: 0.9;
	}
	.pts {
		font: 500 12px var(--font-mono);
		color: var(--gold);
		white-space: nowrap;
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
