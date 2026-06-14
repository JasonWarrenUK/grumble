<script lang="ts">
	import { match } from '$lib/state/match.svelte';
	import { scoreHand } from '$lib/scoring/score';
</script>

{#if match.hands.length > 0}
	<section class="log">
		<div class="head">This game</div>
		{#each match.hands as hand, i (i)}
			{@const result = scoreHand(hand, match.names, match.rules)}
			{@const w = result.pts[0] > result.pts[1] ? 0 : 1}
			<div class="row">
				<span class="num">{i + 1}</span>
				<span class="detail">{result.detail}</span>
				<span class="pts">+{result.pts[w]} {match.names[w]}</span>
				<button class="del" aria-label="delete hand" onclick={() => match.removeHand(i)}>×</button>
			</div>
		{/each}
	</section>
{:else if !match.gameOver}
	<section class="log empty">
		<div class="head">This game</div>
		<p class="hint">No hands yet — record the first hand above to start scoring.</p>
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
		align-items: center;
		gap: 10px;
		padding: 8px 0;
		border-top: 1px solid rgba(243, 236, 216, 0.08);
		font-size: 13px;
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
		font: 500 13px var(--font-mono);
		color: var(--gold);
		white-space: nowrap;
	}
	.del {
		background: transparent;
		border: none;
		color: var(--cream);
		opacity: 0.4;
		font-size: 18px;
		line-height: 1;
		padding: 0 4px;
	}
</style>
