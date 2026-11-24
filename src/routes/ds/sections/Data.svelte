<!-- DOCS: Table, DragRow, EmptyState, Splitter. -->
<script>
	import { resolve } from '$app/paths';
	import { Table, Tag, EmptyState, Splitter, Button } from '#lib';
	import Demo from '../Demo.svelte';
	import ColumnList from '../table-settings/ColumnList.svelte';
	import { startingColumns } from '../table-settings/columns.js';
	import { getEmployees, statusColour, sortEmployees } from '../employees.js';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	const t = pick(content.data); // the example texts, in the current language

	/* ---------- DragRow example: the columns of a table, as in table settings ---------- */
	let dragColumns = $state(startingColumns());

	/* ---------- Table example: sorting and picking one row ---------- */

	const columns = [
		{ key: 'fullName', label: t.columns.fullName, sortable: true },
		{ key: 'department', label: t.columns.department, sortable: true, width: 160 },
		{ key: 'status', label: t.columns.status, width: 120 },
		{ key: 'office', label: t.columns.office, width: 120 }
	];
	const employees = getEmployees();

	// The page (not the table) owns the sorting and the highlighted row.
	let sortKey = $state('fullName');
	let sortDirection = $state('asc');
	let picked = $state(undefined); // the id of the clicked row

	let rows = $derived(sortEmployees(employees.slice(0, 5), sortKey, sortDirection));

	function sortBy(key) {
		// Clicking the same column again flips the direction.
		sortDirection = key === sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
		sortKey = key;
	}

	/* ---------- EmptyState example ---------- */
	// Each type with its icon; the texts come from content.js.
	const emptyTexts = pick(content.emptyStates);
	const emptyTypes = [
		{ type: 'empty', icon: 'plus' },
		{ type: 'not-found', icon: 'close' },
		{ type: 'error', icon: 'refresh' },
		{ type: 'forbidden', icon: 'lock' },
		{ type: 'maintenance', icon: 'arrow-left' }
	].map((item) => ({ ...item, ...emptyTexts[item.type] }));

	/* ---------- Splitter example ---------- */
	let leftWidth = $state(400);
	let rightWidth = $state(0); // measured from the page, see bind:clientWidth below

	// The page decides the limits. Here: neither panel gets narrower than 400 px.
	function resize(pixels) {
		const allowed = Math.min(pixels, rightWidth - 400); // how far the right panel lets us go
		leftWidth = Math.round(Math.max(400, leftWidth + allowed));
	}

	// The horizontal one: the top panel stays between 40 and 160 px tall.
	let topHeight = $state(80);
</script>

<Demo
	title="Table"
	figma="table"
	about="Describe the columns, hand over the rows. Click a header to sort, click a row to pick it."
	column
>
	<Table
		{columns}
		{rows}
		{sortKey}
		{sortDirection}
		onsort={sortBy}
		selected={picked}
		onrowclick={(row) => (picked = row.id)}
	>
		{#snippet cell(row, column)}
			{#if column.key === 'status'}
				<Tag colour={statusColour[row.statusId]} size="s">{row.status}</Tag>
			{:else}
				{row[column.key]}
			{/if}
		{/snippet}
	</Table>
	{#snippet more()}
		Checkboxes, pinned columns, row actions, filters and the rest — all with live examples — are in
		the
		<a class="more" href={resolve('/ds/tables')}>table guidelines</a>.
	{/snippet}
</Demo>

<Demo
	title="DragRow"
	figma="drag-row"
	about="Drag a row by its grip to reorder; show or hide it with the switch. Here at least 2 must stay visible."
>
	<div class="drag-rows">
		<ColumnList bind:columns={dragColumns} />
	</div>
</Demo>

<Demo
	title="EmptyState"
	figma="Empty"
	about="What a screen shows when there is nothing to show. Five situations, each with its own monkey."
>
	{#each emptyTypes as item}
		<EmptyState type={item.type} title={item.title} description={item.description}>
			<Button appearance="accent" mode="primary" icon={item.icon}>{item.button}</Button>
		</EmptyState>
	{/each}
</Demo>

<Demo
	title="Splitter"
	figma="splitter"
	about="Drag the line between the two panels. Here each panel keeps at least 400 px."
>
	<div class="panels">
		<div class="panel" style="width: {leftWidth}px">{t.first} · {leftWidth}px</div>
		<Splitter ondrag={resize} label={t.resize} />
		<div class="panel panel--rest" bind:clientWidth={rightWidth}>
			{t.second} · {rightWidth}px
		</div>
	</div>
</Demo>

<Demo
	title="Splitter, horizontal"
	figma="splitter"
	about="The same line on its side, for panels one above the other. Here the top panel stays 40–160 px tall."
>
	<div class="panels panels--stacked">
		<div class="panel" style="height: {topHeight}px">{t.top} · {topHeight}px</div>
		<Splitter
			horizontal
			ondrag={(pixels) => (topHeight = Math.min(Math.max(topHeight + pixels, 40), 160))}
			label={t.resize}
		/>
		<div class="panel panel--rest">{t.bottom}</div>
	</div>
</Demo>

<style>
	/* As wide as the popover of the table settings guide. */
	.drag-rows {
		width: 320px;
		padding: 12px;
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-background);
	}
	.more {
		color: var(--boring-blue-50);
	}
	.panels {
		display: flex;
		width: 100%;
		height: 120px;
	}
	.panels--stacked {
		flex-direction: column;
		height: 220px;
	}
	.panel {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--uncolorful-grey-background);
		font: var(--text-body-c);
	}
	.panel--rest {
		flex: 1;
	}
</style>
