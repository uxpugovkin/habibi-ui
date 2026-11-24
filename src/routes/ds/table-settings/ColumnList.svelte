<!--
	COLUMN LIST — guide only. The columns of a table as rows you can drag into a new
	order and show or hide. Used by both table-settings examples (drawer and popover)
	and by the DragRow demo.

	Use:
		<ColumnList bind:columns />

	Props:
		columns      the columns: { key, label, visible }, in order. Use bind:columns —
		             dragging and the show / hide switches change it
		minVisible   how many columns must stay visible. Once only that many are left,
		             their "hide" segment is disabled.  Default 2

	How to reorder: drag a row by its grip. The other rows make room while you drag.
-->
<script>
	import { DragRow } from '#lib';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	let { columns = $bindable([]), minVisible = 2 } = $props();

	const t = pick(content.tableSettings); // the example texts, in the current language

	let draggedKey = $state(''); // the row being dragged now; '' = none

	let visibleCount = $derived(columns.filter((column) => column.visible).length);

	function startDrag(event, key) {
		draggedKey = key;
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', key); // Firefox only drags when something is set
	}

	// While dragging over another row, the dragged one moves into its place right away.
	function dragOver(event, key) {
		event.preventDefault(); // "a drop is allowed here"
		if (!draggedKey || draggedKey === key) return;

		const from = columns.findIndex((column) => column.key === draggedKey);
		const to = columns.findIndex((column) => column.key === key);
		const reordered = [...columns];
		const [moved] = reordered.splice(from, 1);
		reordered.splice(to, 0, moved);
		columns = reordered;
	}
</script>

<div class="list">
	{#each columns as column (column.key)}
		<DragRow
			label={column.label}
			bind:visible={column.visible}
			hideDisabled={visibleCount <= minVisible}
			showLabel={t.show}
			hideLabel={t.hide}
			draggable="true"
			dragging={draggedKey === column.key}
			ondragstart={(event) => startDrag(event, column.key)}
			ondragover={(event) => dragOver(event, column.key)}
			ondrop={(event) => event.preventDefault()}
			ondragend={() => (draggedKey = '')}
		/>
	{/each}
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
</style>
