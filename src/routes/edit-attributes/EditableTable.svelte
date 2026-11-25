<!--
	EDITABLE TABLE — a table of the user page where every cell can be changed in place.
	The library Table, as in the table guide (/ds/tables), with a Value in every cell:
	hover a cell → the pencil slides in, click → the edit card opens under the cell.

	Figma:  sbertech-habibi → page "abac-r5" → "1-0-abtract" → "Example"
	        (and the changed row of "3-0-unsaved-changes": orange, a line at its start)

	Use:
		<EditableTable {table} {values} {statusOf} {editing} {hidden} onedit={…} ondelete={…} onclose={…}>
			{#snippet card(cell)}<EditCard attribute={cell} … />{/snippet}
		</EditableTable>

	Props:
		table      one table from data.js: { title, columns, rows, wide }
		values     every value of the page: { "table/row/column": value } (see cellOf)
		statusOf   tells the status of a cell: "default" | "not-saved" | "error"
		editing    the key of the cell whose card is open ('' = none)
		hidden     keys of rows that are deleted ("table/row"): left out
		onlyStatus the Status filter of the page: "not-saved" | "error" | '' (all rows).
		           The row whose card is open always stays, so it cannot vanish while edited
		onedit     called with a cell when its value is clicked
		ondelete   called with a row when its delete button is clicked
		onclose    called when the card should close (the table was scrolled)
		card       snippet: the edit card of a cell. Gets (cell)

	What the table keeps itself: its search and its filters.
	The filters follow the columns, one tag per column. As in the table guide (/ds/tables):
	at most four tags in the toolbar; a table with more columns gets the "all filters"
	button in front, with a list where tags can be switched on and off.
	A delete button shows on the row under the mouse, in a column of its own (40px) pinned
	to the far side: in a wide table the other columns slide under it while it scrolls.
	What the page keeps: the values and the changes (as for the attribute rows), so Save
	and Discard work for cells and attributes together.

	A changed row turns orange, a row with a wrong value red. The library Table knows
	nothing about that (it stays simple): every cell carries a mark, and the CSS below
	colours the rows that hold one, with a 2px line at its start — like the attribute rows.
	The delete column takes the colour of its row too.
	A wide table scrolls sideways; its first column stays (pinned).
-->
<script>
	import {
		Button,
		Checkbox,
		EmptyState,
		FilterChip,
		Menu,
		MenuItem,
		SearchChip,
		Table,
		TableToolbar
	} from '#lib';
	import { cellOf, statusOfRow, textOf, optionOf } from './data.js';
	import { notBuilt } from './prototype.svelte.js';
	import Value from './Value.svelte';

	let {
		table,
		values,
		statusOf,
		editing = '',
		hidden = [],
		onlyStatus = '',
		onedit,
		ondelete,
		onclose,
		card
	} = $props();

	const CARD_WIDTH = 272; // see EditCard
	const MAX_TAGS = 4; // filter tags in the toolbar at most (table guide)

	/* ---------- Columns, as the library Table wants them ---------- */

	let columns = $derived(
		table.columns.map((column) => ({
			key: column.id,
			label: column.title,
			width: column.width,
			pinned: column.pinned
		}))
	);
	// A wide table is as wide as all its columns: wider than the page, so it scrolls sideways.
	let minWidth = $derived(
		table.wide ? table.columns.reduce((sum, column) => sum + column.width, 0) : 0
	);

	function columnOf(key) {
		return table.columns.find((column) => column.id === key);
	}

	function valueOf(row, column) {
		return values[cellOf(table, row, column).id];
	}

	/* ---------- Which rows need attention ---------- */

	function rowStatus(row) {
		return statusOfRow(table, row, statusOf);
	}

	// The page's Status filter. The row being edited stays, whatever its status turns into.
	function fitsStatus(row) {
		if (!onlyStatus) return true;
		if (editing.startsWith(`${table.id}/${row.id}/`)) return true;
		return rowStatus(row) === onlyStatus;
	}

	/* ---------- Search and filters ---------- */

	let query = $state('');
	let chosen = $state({}); // { column id: the chosen value }
	let openMenu = $state(''); // the column id whose filter list is open, or 'all'

	// Which filter tags are in the toolbar: one per column, the first four to start with.
	// (Only the starting value comes from the props, on purpose — hence the ignore.)
	// svelte-ignore state_referenced_locally
	let tags = $state(table.columns.slice(0, MAX_TAGS).map((column) => column.id));
	let manyColumns = $derived(table.columns.length > MAX_TAGS);

	// Tick or untick a column in the "all filters" list: its tag appears in, or leaves, the toolbar.
	function toggleTag(id) {
		if (tags.includes(id)) {
			tags = tags.filter((other) => other !== id);
			unchoose(id); // a filter that is not shown must not keep filtering
		} else {
			// keep the order of the columns
			tags = table.columns
				.map((column) => column.id)
				.filter((other) => tags.includes(other) || other === id);
		}
	}

	// The choices of a filter: the options of the column, or (texts, dates, arrays — typed
	// freely) every value that is in that column now.
	function choicesOf(column) {
		if (column.options) return column.options;
		const texts = table.rows.flatMap((row) => valueOf(row, column)).filter((text) => text !== '');
		return [...new Set(texts)].map((text) => ({ value: text, label: text }));
	}

	function chosenLabel(column) {
		const value = chosen[column.id];
		if (value === undefined) return '';
		return column.options ? optionOf(column, value)?.label : value;
	}

	function fits(row) {
		const words = query.trim().toLowerCase();
		if (words) {
			const text = table.columns.map((column) => textOf(column, valueOf(row, column))).join(' ');
			if (!text.toLowerCase().includes(words)) return false;
		}
		return Object.entries(chosen).every(([id, wanted]) => {
			const value = valueOf(row, columnOf(id));
			return Array.isArray(value) ? value.includes(wanted) : value === wanted;
		});
	}

	let rows = $derived(
		table.rows
			.filter((row) => !hidden.includes(`${table.id}/${row.id}`))
			.filter(fitsStatus)
			.filter(fits)
	);

	function toggleMenu(event, id) {
		event.stopPropagation(); // the window handler below must not close what was just opened
		onclose?.();
		openMenu = openMenu === id ? '' : id;
	}

	function choose(id, value) {
		chosen = { ...chosen, [id]: value };
	}

	function unchoose(id) {
		chosen = Object.fromEntries(Object.entries(chosen).filter(([other]) => other !== id));
	}

	function clearFilters() {
		query = '';
		chosen = {};
	}

	/* ---------- The edit card: under the clicked cell ----------
	   The table cuts what sticks out of its cells and scrolls sideways, so the card is
	   not drawn inside the cell: it hangs in this section, at the place of the cell. */

	let section;
	let openCell = $state(null); // the cell whose card is open
	let place = $state({ top: 0, start: 0 }); // where the card hangs in the section, px

	function edit(row, column, event) {
		const cell = event.currentTarget.closest('td').getBoundingClientRect();
		const box = section.getBoundingClientRect();
		const rightToLeft = getComputedStyle(section).direction === 'rtl';
		const start = rightToLeft ? box.right - cell.right : cell.left - box.left;
		place = {
			top: cell.bottom - box.top + 4,
			// The card stays inside the section, also under the last column.
			start: Math.min(start, box.width - CARD_WIDTH - 8)
		};
		openCell = cellOf(table, row, column);
		onedit?.(openCell);
	}
</script>

<!-- A click anywhere else closes the filter list. -->
<svelte:window onclick={() => (openMenu = '')} />

<!-- Scrolling the table sideways would leave the card behind: it closes (keeping its value). -->
<section class="table-card" bind:this={section} onscrollcapture={() => onclose?.()}>
	<h2 class="table-card__title hb-text-body-a">{table.title}</h2>

	<!-- Delete: a column of its own (40px), pinned to the far side. -->
	<Table {columns} {rows} {minWidth} actions={deleteButton} actionsWidth={40}>
		{#snippet toolbar()}
			<TableToolbar>
				<!-- "All filters" (only when there are more columns than tags): switch tags on and off. -->
				{#if manyColumns}
					<span class="anchor">
						<Button icon="tune" label="Filters" onclick={(event) => toggleMenu(event, 'all')} />
						{#if openMenu === 'all'}
							<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
							<div
								class="anchor__menu anchor__menu--checks"
								onclick={(event) => event.stopPropagation()}
							>
								<Menu label="Filters to show">
									{#each table.columns as column (column.id)}
										<Checkbox
											checked={tags.includes(column.id)}
											onchange={() => toggleTag(column.id)}>{column.title}</Checkbox
										>
									{/each}
								</Menu>
							</div>
						{/if}
					</span>
				{/if}

				<SearchChip bind:value={query} placeholder="Search in {table.title.toLowerCase()}" />

				{#each tags.map(columnOf) as column (column.id)}
					<span class="anchor">
						<FilterChip
							name={column.title}
							value={chosenLabel(column)}
							onclick={(event) => toggleMenu(event, column.id)}
							onclear={() => unchoose(column.id)}
						/>
						{#if openMenu === column.id}
							<div class="anchor__menu">
								<Menu label={column.title}>
									{#each choicesOf(column) as option (option.value)}
										<MenuItem
											checked={chosen[column.id] === option.value}
											onclick={() => choose(column.id, option.value)}>{option.label}</MenuItem
										>
									{/each}
								</Menu>
							</div>
						{/if}
					</span>
				{/each}

				{#if Object.keys(chosen).length}
					<Button mode="ghost" onclick={() => (chosen = {})}>Reset</Button>
				{/if}

				{#snippet end()}
					<Button icon="plus" label="Add a row" onclick={() => notBuilt('Adding a row')} />
				{/snippet}
			</TableToolbar>
		{/snippet}

		<!-- The Table hands over its own column ({ key, label, … }); ours has the datatype. -->
		{#snippet cell(row, tableColumn)}
			{@const column = columnOf(tableColumn.key)}
			<!-- The mark of the row ("default", "not-saved" or "error"): the CSS below colours the row. -->
			<span class="mark" data-row={rowStatus(row)}>
				<Value
					attribute={column}
					value={valueOf(row, column)}
					open={editing === cellOf(table, row, column).id}
					onedit={(event) => edit(row, column, event)}
				/>
			</span>
		{/snippet}

		{#snippet deleteButton(row)}
			<Button
				mode="ghost"
				icon="delete"
				label="Delete the row"
				onclick={() => {
					onclose?.();
					ondelete?.(row);
				}}
			/>
		{/snippet}

		{#snippet empty()}
			<EmptyState
				type="not-found"
				title="No matching rows"
				description="Try another word, or clear the filters."
			>
				<Button appearance="accent" mode="primary" onclick={clearFilters}>Clear filters</Button>
			</EmptyState>
		{/snippet}
	</Table>

	{#if openCell && editing === openCell.id}
		<div
			class="table-card__edit"
			style:top="{place.top}px"
			style:inset-inline-start="{place.start}px"
		>
			{@render card?.(openCell)}
		</div>
	{/if}
</section>

<style>
	/* Figma "Example": a white card, 16px above and below, 8px at the sides. */
	.table-card {
		position: relative; /* the edit card hangs in it */
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px 8px;
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-surface);
		--table-surface: var(--uncolorful-grey-surface); /* pinned cells: the colour of the card */
	}
	.table-card__title {
		margin: 0;
		padding-inline: 8px;
		color: var(--uncolorful-grey-primary);
	}
	/* The toolbar sits 16px from the sides of the card (8 of the card + 8 here), like
	   the title; the table itself only 8. (:global — the Table draws the toolbar's box.) */
	.table-card :global(.hb-table__top) {
		padding-inline: 8px;
	}
	.table-card__edit {
		position: absolute;
		z-index: 30;
	}

	/* A filter list opens right under its chip. */
	.anchor {
		position: relative;
	}
	.anchor__menu {
		position: absolute;
		top: calc(100% + 4px);
		inset-inline-start: 0;
		z-index: 20;
		min-width: 200px;
	}
	/* Checkbox rows inside the "all filters" list get a little room at the sides. */
	.anchor__menu--checks :global(.hb-check) {
		margin: 0 4px;
		padding-inline-end: 12px;
		white-space: nowrap;
	}

	/* ---------- Rows that need attention (Figma "3-0-unsaved-changes") ----------
	   A row that holds a marked cell is tinted, a step stronger under the mouse, with a
	   2px line at its start. Every cell takes the colour, the pinned ones and the delete
	   column too. The ends stay round, like every row of the table.
	   (:global — the rows and cells are drawn by the library Table.) */
	.table-card :global(tbody tr:has([data-row='not-saved']) td) {
		background: var(--shitpile-orange-90);
	}
	.table-card :global(tbody tr:has([data-row='not-saved']):hover td) {
		background: var(--shitpile-orange-80);
	}
	.table-card :global(tbody tr:has([data-row='error']) td) {
		background: var(--traffic-light-red-90);
	}
	.table-card :global(tbody tr:has([data-row='error']):hover td) {
		background: var(--traffic-light-red-80);
	}
	.table-card :global(tbody tr:has([data-row='not-saved']) td:first-child) {
		border-inline-start: 2px solid var(--shitpile-orange-50);
		padding-inline-start: 10px; /* 12 − the 2px line: the text does not move */
	}
	.table-card :global(tbody tr:has([data-row='error']) td:first-child) {
		border-inline-start: 2px solid var(--traffic-light-red-50);
		padding-inline-start: 10px;
	}
</style>
