<!--
	DRAWER EXAMPLE — guide only. "Option A": table settings in a panel over the page.
	The table behind it really changes, but only after "Save".

	Figma:  habibi-library → "Appendix A — LTR" → "Section 02 Drawer"

	Use:
		<DrawerExample />

	What the buttons do:
		Save             the table takes the changes, the panel closes
		Cancel, ×        the changes are dropped, the panel closes
		Revert changes   the panel goes back to the starting columns (nothing is saved yet)
	The settings button in the table toolbar opens the panel again.
-->
<script>
	import { Button, MultiSelect, Splitter } from '#lib';
	import TableExample from '../tables/TableExample.svelte';
	import ColumnList from './ColumnList.svelte';
	import { startingColumns, copyColumns } from './columns.js';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	const t = pick(content.tableSettings); // the example texts, in the current language

	const STARTING_PINNED = ['fullName', 'department'];

	let columns = $state(startingColumns(STARTING_PINNED)); // what the table shows (saved)
	let open = $state(true);

	// What the panel shows until "Save": a copy of the columns, and the pinned ones apart
	// (the "Pinned columns" box works with a list of keys).
	let draft = $state(startingColumns(STARTING_PINNED));
	let pinnedKeys = $state([...STARTING_PINNED]);

	let width = $state(612); // the panel; its edge can be dragged

	function keysOfPinned(list) {
		return list.filter((column) => column.pinned).map((column) => column.key);
	}

	function openPanel() {
		draft = copyColumns(columns);
		pinnedKeys = keysOfPinned(columns);
		open = true;
	}

	function save() {
		columns = draft.map((column) => ({ ...column, pinned: pinnedKeys.includes(column.key) }));
		open = false;
	}

	function revert() {
		draft = startingColumns(STARTING_PINNED);
		pinnedKeys = [...STARTING_PINNED];
	}

	// The panel is AFTER the splitter, so it grows when the line moves backwards.
	function resize(pixels) {
		width = Math.min(Math.max(width - pixels, 400), 900);
	}
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && (open = false)} />

<div class="stage">
	<TableExample wide layout={columns} viewport={528}>
		{#snippet toolbarEnd()}
			<Button icon="download" label={t.download} />
			<Button
				appearance={open ? 'accent' : 'default'}
				icon="settings"
				label={t.title}
				aria-expanded={open}
				onclick={openPanel}
			/>
		{/snippet}
	</TableExample>

	{#if open}
		<!-- The dimmed page behind the panel. A click on it closes the panel, like Cancel. -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="shade" onclick={() => (open = false)}></div>

		<div class="drawer" style:width="{width}px" role="dialog" aria-label={t.title}>
			<Splitter ondrag={resize} label={t.title} />

			<div class="drawer__body">
				<header class="drawer__head">
					<h4 class="hb-text-h2">{t.title}</h4>
					<Button
						mode="ghost"
						size="m"
						icon="close"
						label={t.close}
						onclick={() => (open = false)}
					/>
				</header>

				<MultiSelect
					big
					label={t.pinnedColumns}
					hint={t.maxPinned}
					max={3}
					options={draft.map((column) => ({ value: column.key, label: column.label }))}
					bind:value={pinnedKeys}
				/>

				<div class="drawer__list">
					<ColumnList bind:columns={draft} />
				</div>

				<footer class="drawer__buttons">
					<span class="drawer__main-buttons">
						<Button appearance="accent" mode="primary" size="m" onclick={save}>{t.save}</Button>
						<Button appearance="accent" size="m" onclick={() => (open = false)}>{t.cancel}</Button>
					</span>
					<Button mode="ghost" size="m" onclick={revert}>{t.revert}</Button>
				</footer>
			</div>
		</div>
	{/if}
</div>

<style>
	/* The example fills its box edge to edge (the box's 16px of padding is taken back),
	   so the panel can sit flush with the box's side. */
	.stage {
		position: relative;
		margin: -16px;
		padding: 16px;
	}
	/* Shade and panel sit above everything the table keeps on top while it scrolls
	   (its toolbar and header go up to 10). */
	.shade {
		position: absolute;
		inset: 0;
		z-index: 20;
		background: var(--opacity-16);
	}
	.drawer {
		position: absolute;
		top: 0;
		bottom: 0;
		inset-inline-end: 0;
		z-index: 20;
		display: flex;
		max-width: 100%;
		background: var(--uncolorful-grey-background);
	}
	.drawer__body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px 24px 0;
	}
	.drawer__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
	}
	.drawer__head h4 {
		margin: 0;
		color: var(--uncolorful-grey-primary);
	}
	/* The list takes the room that is left, and scrolls if it needs more. */
	.drawer__list {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}
	.drawer__buttons {
		display: flex;
		justify-content: space-between;
		padding: 12px 0 20px;
	}
	.drawer__main-buttons {
		display: flex;
		gap: 4px;
	}
</style>
