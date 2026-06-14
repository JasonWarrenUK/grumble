<script lang="ts">
	import { match } from '$lib/state/match.svelte';
	import type { PlayerId } from '$lib/scoring/types';

	const players: PlayerId[] = [0, 1];
</script>

<div class="board">
	{#each players as p (p)}
		<div class="player" class:win={match.gameOver && match.gameWinner === p}>
			<input
				class="name"
				value={match.names[p]}
				oninput={(e) => match.setName(p, e.currentTarget.value)}
				aria-label={`Player ${p + 1} name`}
			/>
			<div class="score">{match.running[p]}</div>
			<div class="subline">{match.lines[p]} {match.lines[p] === 1 ? 'line' : 'lines'}</div>
			{#if match.games.length > 0}
				<div class="match">match: {match.matchTotals[p]}</div>
			{/if}
		</div>
	{/each}
</div>

{#if match.gameOver}
	<div class="game-over">
		<span>
			{match.names[match.gameWinner]} crosses {match.rules.GAME_TARGET}. With bonuses:
			{match.names[0]}
			{match.preview[0]} · {match.names[1]}
			{match.preview[1]}
		</span>
		<button class="bank" onclick={() => match.bankGame()}>Bank game →</button>
	</div>
{/if}

<style>
	.board {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-bottom: 14px;
	}
	.player {
		background: rgba(0, 0, 0, 0.22);
		border: 1px solid rgba(217, 180, 74, 0.25);
		border-radius: 14px;
		padding: 16px 14px;
		text-align: center;
	}
	.player.win {
		border: 2px solid var(--gold);
		box-shadow: 0 0 24px rgba(217, 180, 74, 0.35);
	}
	.name {
		background: transparent;
		border: none;
		border-bottom: 1px dashed rgba(243, 236, 216, 0.3);
		color: var(--cream);
		font: 700 15px var(--font-sans);
		text-align: center;
		width: 100%;
		padding: 2px 0;
		margin-bottom: 8px;
	}
	.score {
		font-family: var(--font-display);
		font-size: var(--fs-score);
		line-height: 1;
		color: var(--gold);
	}

	@media (max-width: 360px) {
		.player {
			padding: 12px 8px;
		}
	}
	.subline {
		font: 12px var(--font-mono);
		opacity: 0.7;
		margin-top: 4px;
	}
	.match {
		font: 11px var(--font-mono);
		color: var(--gold);
		margin-top: 6px;
		opacity: 0.85;
	}
	.game-over {
		background: var(--gold);
		color: var(--ink);
		border-radius: 12px;
		padding: 12px 14px;
		font-size: 13px;
		font-weight: 500;
		margin-bottom: 14px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	.bank {
		background: var(--ink);
		color: var(--cream);
		border: none;
		border-radius: 8px;
		padding: 8px 14px;
		font-weight: 700;
		margin-left: auto;
	}
</style>
