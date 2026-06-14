<script lang="ts">
	import { RANKS, cardValue, deadwood, type Rank } from '$lib/scoring/cards';

	// onUse fires with the computed total; parent decides what to do with it.
	let { onUse }: { onUse: (total: number) => void } = $props();

	let open = $state(false);
	let cards = $state<Rank[]>([]);
	const total = $derived(deadwood(cards));
</script>

<button class="toggle" onclick={() => (open = !open)}>
	{open ? 'Hide' : 'Count cards'}
</button>

{#if open}
	<div class="calc">
		<div class="grid">
			{#each RANKS as r (r)}
				<button class="card" onclick={() => (cards = [...cards, r])}>
					{r}<span class="val">{cardValue(r)}</span>
				</button>
			{/each}
		</div>
		<div class="foot">
			<span class="chips">{cards.join(' ') || 'tap cards in the losing hand…'}</span>
			<strong class="sum">= {total}</strong>
			<button
				class="use"
				onclick={() => {
					onUse(total);
					open = false;
					cards = [];
				}}
			>
				Use as opp deadwood
			</button>
			<button class="clear" onclick={() => (cards = [])}>Clear</button>
		</div>
	</div>
{/if}

<style>
	.toggle {
		align-self: flex-end;
		background: transparent;
		border: 1px solid var(--gold);
		color: var(--gold);
		border-radius: 10px;
		padding: 10px 14px;
		font-size: 13px;
		font-weight: 500;
		height: 46px;
	}
	.calc {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 12px;
		padding: 12px;
		margin-bottom: 12px;
	}
	.grid {
		display: grid;
		/* Reflows gracefully on narrow phones; stays a single row on desktop. */
		grid-template-columns: repeat(auto-fit, minmax(38px, 1fr));
		gap: 6px;
	}
	.card {
		background: var(--cream);
		color: var(--ink);
		border: none;
		border-radius: 8px;
		padding: 8px 2px;
		font-family: var(--font-display);
		font-size: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.val {
		font: 9px var(--font-mono);
		opacity: 0.5;
	}
	.foot {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 12px;
		flex-wrap: wrap;
	}
	.chips {
		font: 13px var(--font-mono);
		opacity: 0.8;
		flex: 1;
		min-width: 120px;
	}
	.sum {
		font-family: var(--font-display);
		font-size: 22px;
		color: var(--gold);
	}
	.use {
		background: var(--gold);
		color: var(--ink);
		border: none;
		border-radius: 8px;
		padding: 8px 12px;
		font-weight: 700;
		font-size: 12px;
	}
	.clear {
		background: transparent;
		color: var(--cream);
		border: 1px solid rgba(243, 236, 216, 0.3);
		border-radius: 8px;
		padding: 8px 12px;
		font-size: 12px;
	}
</style>
