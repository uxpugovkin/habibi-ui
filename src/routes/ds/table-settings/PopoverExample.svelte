<!--
	POPOVER EXAMPLE — guide only. "Option B": table settings in a small card under
	the settings button. Every change reaches the table at once (no "Save").

	Figma:  habibi-library → "Appendix A — LTR" → "Section 03 Popover"

	Use:
		<PopoverExample />

	The settings button opens and closes the card; a click elsewhere, or Esc, closes it.
	"Revert changes" puts the starting columns back.
-->
<script>
	import { Button } from '#lib';
	import TableExample from '../tables/TableExample.svelte';
	import ColumnList from './ColumnList.svelte';
	import { startingColumns } from './columns.js';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	const t = pick(content.tableSettings); // the example texts, in the current language

	let columns = $state(startingColumns()); // what the table shows — changed straight from the card
	let open = $state(true);

	function toggle(event) {
		event.stopPropagation(); // the window handler below must not close what was just opened
		open = !open;
	}
</script>

<svelte:window
	onclick={() => (open = false)}
	onkeydown={(event) => event.key === 'Escape' && (open = false)}
/>

<div class="stage">
	<TableExample wide layout={columns} viewport={528}>
		{#snippet toolbarEnd()}
			<Button icon="download" label={t.download} />
			<Button
				appearance={open ? 'accent' : 'default'}
				icon="settings"
				label={t.title}
				aria-expanded={open}
				onclick={toggle}
			/>
		{/snippet}
	</TableExample>

	{#if open}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			class="popover"
			role="dialog"
			tabindex="-1"
			aria-label={t.title}
			onclick={(event) => event.stopPropagation()}
		>
			<ColumnList bind:columns />
			<Button size="m" onclick={() => (columns = startingColumns())}>{t.revert}</Button>
		</div>
	{/if}
</div>

<style>
	.stage {
		position: relative;
	}
	/* Right under the settings button, lined up with its end: the scrolling window keeps a
	   16px strip above the toolbar, then the 28px toolbar, then 4px of air = 48px. It sits
	   above everything the table keeps on top while it scrolls (that goes up to 10).
	   No cast shadow: a 1px line sets the card apart from the table. */
	.popover {
		position: absolute;
		top: 48px;
		inset-inline-end: 0;
		z-index: 20;
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 320px;
		padding: 12px;
		border: 1px solid var(--uncolorful-grey-border);
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-background);
	}
</style>
