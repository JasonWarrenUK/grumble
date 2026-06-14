<script lang="ts">
	import { match } from '$lib/state/match.svelte';

	let open = $state(false);
</script>

<div class="wrap">
	<button class="toggle" onclick={() => (open = !open)} aria-expanded={open}>
		{open ? '▲ Hide rules' : '▿ How scoring works'}
	</button>

	{#if open}
		<div class="panel">
			<dl>
				<dt>Deadwood</dt>
				<dd>
					Unmatched cards left in your hand after laying off. Face cards = 10, Aces = 1, all
					others face value.
				</dd>

				<dt>Knock</dt>
				<dd>
					End the hand when your deadwood is 10 or under. You score the difference between your
					deadwood and your opponent's. If theirs is equal or lower, they undercut you.
				</dd>

				<dt>Gin</dt>
				<dd>
					Go out with 0 deadwood. Score opponent's deadwood + {match.rules.GIN_BONUS} bonus.
					Opponent can't lay off.
				</dd>

				<dt>Big gin</dt>
				<dd>
					Go out using all 11 cards (including the draw). Score opponent's deadwood + {match.rules.BIG_GIN_BONUS}
					bonus.
				</dd>

				<dt>Undercut</dt>
				<dd>
					If the knocker's deadwood is ≥ the opponent's, the opponent wins the box and scores
					the difference + {match.rules.UNDERCUT_BONUS} bonus.
				</dd>

				<dt>Lines (boxes)</dt>
				<dd>
					Each hand you win earns you a line. At game end, each line is worth {match.rules.LINE_BONUS}
					points.
				</dd>

				<dt>Game</dt>
				<dd>
					The first player to reach {match.rules.GAME_TARGET} points wins the game and earns a {match.rules.GAME_BONUS}
					bonus on top of line bonuses.
				</dd>

				<dt>Bank</dt>
				<dd>Lock in the finished game's final scores and start a new game in the same match.</dd>
			</dl>
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
		border: 1px solid rgba(217, 180, 74, 0.15);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin-top: var(--space-2);
	}
	dl {
		margin: 0;
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 6px 16px;
		font-size: 13px;
	}
	dt {
		font: 600 12px var(--font-mono);
		color: var(--gold);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		padding-top: 1px;
	}
	dd {
		margin: 0;
		opacity: 0.85;
		line-height: 1.5;
	}
</style>
