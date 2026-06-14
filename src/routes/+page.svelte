<script lang="ts">
	import { match } from '$lib/state/match.svelte';
	import Scoreboard from '$lib/components/Scoreboard.svelte';
	import HandEntry from '$lib/components/HandEntry.svelte';
	import HandLog from '$lib/components/HandLog.svelte';
	import MatchHistory from '$lib/components/MatchHistory.svelte';
	import HelpPanel from '$lib/components/HelpPanel.svelte';
	import SetupPanel from '$lib/components/SetupPanel.svelte';
</script>

<svelte:head>
	<title>The Tally — Gin Rummy</title>
</svelte:head>

<main>
	<header>
		<div class="suit">♠ ♥ ♦ ♣</div>
		<h1>Gin Rummy</h1>
		<div class="target">game to {match.rules.GAME_TARGET}</div>
	</header>

	<SetupPanel />
	<Scoreboard />
	<HelpPanel />
	<HandEntry />
	<HandLog />
	<MatchHistory />
</main>

<style>
	main {
		min-height: 100vh;
		background: radial-gradient(ellipse at top, var(--felt), var(--felt-dark));
		font-family: var(--font-sans);
		color: var(--cream);
		padding: 20px 16px 60px;
		max-width: 640px;
		margin: 0 auto;
	}
	header {
		text-align: center;
		margin-bottom: 20px;
	}
	.suit {
		letter-spacing: 8px;
		color: var(--gold);
		font-size: 14px;
		opacity: 0.8;
	}
	h1 {
		font-family: var(--font-display);
		font-size: var(--fs-display);
		margin: 4px 0 0;
		color: var(--cream);
	}
	.target {
		font: 12px var(--font-mono);
		color: var(--gold);
		text-transform: uppercase;
		letter-spacing: 2px;
	}
</style>
