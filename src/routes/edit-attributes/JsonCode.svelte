<!--
	JSON CODE — a JSON shown as code over the whole page: numbered lines, colours,
	the lines that match a search marked, and a small bar with Copy.
	(Auth context used to be in that bar; it now sits in the user page toolbar.)

	Figma:  none yet — a "to be" idea. Its look follows "read-json" (the code area)
	        of sbertech-habibi → page "abac-r5".
	Copied from the ABAC to-be prototype (src/routes/abac-to-be).

	Use:
		<JsonCode value={jsonOf(user).domain} query="mountain" />

	Props:
		value   any JSON value to show
		query   lines that contain this text are marked (case does not matter)

	The bar on top stays in view while the page scrolls.
-->
<script>
	import { Button } from '#lib';
	import { jsonLines } from './data.js';
	import { notify } from './prototype.svelte.js';
	import JsonText from './JsonText.svelte';

	let { value, query = '' } = $props();

	let lines = $derived(jsonLines(value));
	let words = $derived(query.trim().toLowerCase());
	let found = $derived(
		words ? lines.filter((text) => text.toLowerCase().includes(words)).length : 0
	);

	function copy() {
		navigator.clipboard?.writeText(JSON.stringify(value, null, 2));
		notify('JSON copied', 'success');
	}
</script>

<section class="code-card">
	<div class="tools">
		<span class="hb-text-body-d tools__info">
			{#if words}
				{found === 0 ? 'Nothing matches' : `${found} matching ${found === 1 ? 'line' : 'lines'}`}
			{:else}
				{lines.length} lines
			{/if}
		</span>
		<span class="tools__end">
			<Button icon="duplicate" label="Copy JSON" onclick={copy} />
		</span>
	</div>

	<!-- JSON always reads left to right, also on a right-to-left page. -->
	<ol class="code hb-text-code-s" dir="ltr">
		{#each lines as text}
			<li class:found={words && text.toLowerCase().includes(words)}><JsonText {text} /></li>
		{/each}
	</ol>
</section>

<style>
	.code-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
	}
	/* The bar stays at the top of the page while the code scrolls under it. */
	.tools {
		position: sticky;
		top: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 8px 8px 8px 12px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
		border-start-start-radius: var(--radius-m);
		border-start-end-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
	}
	.tools__info {
		color: var(--uncolorful-grey-tertiary);
	}
	.tools__end {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	/* Numbered lines; a long one scrolls sideways. */
	.code {
		margin: 0;
		padding: 8px 0 16px;
		overflow-x: auto;
		list-style: none;
		counter-reset: line;
	}
	.code li {
		min-width: max-content;
		padding-inline-end: 16px;
		white-space: pre;
		color: var(--uncolorful-grey-primary);
	}
	.code li::before {
		counter-increment: line;
		content: counter(line, decimal-leading-zero);
		display: inline-block;
		width: 52px;
		padding-inline-start: 12px;
		color: var(--uncolorful-grey-tertiary);
	}
	.code li.found {
		background: var(--boring-blue-90);
	}
</style>
