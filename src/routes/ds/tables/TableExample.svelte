<!--
	TABLE EXAMPLE — guide only.
	One "Employees" table, like the examples in Figma, where each feature can be
	switched on with a prop. It keeps its own search, filters, sorting and
	selection, so every example on the page works on its own.

	The pieces it is made of (all in this folder, all guide only):
		ExampleToolbar   the toolbar: search, filter tags, buttons
		EmployeeCell     how a cell is drawn (photo, tags…)
		Window           the fake browser window of the scrolling examples
		columns.js       the columns and their widths

	Use:
		<TableExample title="Employees" selectable summary limit={7} />
		<TableExample wide pinned actions={['edit', 'download', 'delete']} viewport />

	Props (all optional):
		title             heading above the toolbar, e.g. "Employees"

		Toolbar
		filters           ids of the filters that start switched on, e.g. ['department']
		shown             which filter tags are in the toolbar, e.g. ['status', 'office'].
		                  Default the first four
		filterMenu        true = the list of all filters starts open
		searchByName      true = the search box says "Search by name" instead of "Search"
		searchPinned      true = the search box is always open and looks focused
		toolbarEnd        snippet for the buttons at the end of the toolbar

		Table
		hide              keys of columns to leave out, e.g. ['office']
		wide              true = the columns are wider than the example, so the table scrolls sideways
		narrow            true = for the small page inside the app window (AppFrame): the table may
		                  get narrower there before it starts to scroll sideways
		pinned            true = the Employee column is pinned
		layout            the columns as the table settings left them: a list of
		                  { key, visible, pinned }, in order (see ../table-settings/columns.js).
		                  Hidden ones are left out; pinned ones move to the start
		longTexts         true = the "wrap and cut" example: long header, long name, long department
		selectable        true = checkbox column
		picked            which rows are ticked at the start: a list of ids, e.g. [2, 3, 5],
		                  or "all" = every row that the starting filters leave
		paged             true = 5 rows per page, with a pager in the summary row
		choiceShown       true = the "Rows on this page / All rows in the table" list is always
		                  on screen (the pagination example). Needs `paged`
		actions           icon names of the row actions, e.g. ['delete']
		actionsWidth      px. Puts the actions in their own column
		limit             show only the first N people (most examples need just a few rows)
		minHeight         px. Keeps the height when a search leaves few rows
		summary           true = summary row under the table

		Scrolling
		viewport          for the SCROLLING examples: the example box plays the browser window.
		                  true = it scrolls sideways; a number = it is that many px tall and also
		                  scrolls up-down. The toolbar and the table header stay on top
-->
<script>
	import { Table, Button, Menu, MenuItem, EmptyState } from '#lib';
	import { getEmployees, formatScore, filterEmployees, sortEmployees } from '../employees.js';
	import { content } from '../content.js';
	import { pick, examples, directionOf } from '../examples.svelte.js';
	import { columnsWith, columnWidths } from './columns.js';
	import ExampleToolbar from './ExampleToolbar.svelte';
	import EmployeeCell from './EmployeeCell.svelte';
	import Window from './Window.svelte';

	let {
		title = '',
		filters = [],
		shown = undefined,
		filterMenu = false,
		searchByName = false,
		searchPinned = false,
		toolbarEnd,
		hide = [],
		wide = false,
		narrow = false,
		pinned = false,
		layout = null,
		longTexts = false,
		selectable = false,
		picked = [],
		paged = false,
		choiceShown = false,
		actions = [],
		actionsWidth = 0,
		limit = 0,
		minHeight = 0,
		summary = false,
		viewport = false
	} = $props();

	const PAGE_SIZE = 5;

	const t = pick(content.tables); // the example texts, in the current language
	const tableTexts = pick(content.tableTexts); // the words the Table writes itself
	const notFound = pick(content.emptyStates['not-found']);
	const employees = getEmployees();

	// Arrows point the way the text runs: in Arabic "next page" points to the left.
	const rightToLeft = directionOf(examples.lang) === 'rtl';

	/* ---------- Columns ---------- */

	let allColumns = $derived(
		columnsWith(columnWidths[longTexts ? 'longTexts' : wide ? 'wide' : 'normal'])
			.filter((column) => !hide.includes(column.key))
			.map((column) => {
				if (column.key === 'fullName') {
					// The "wrap and cut" example: the header and the names of the first column wrap.
					return longTexts ? { ...column, label: t.longColumn, wrap: true } : { ...column, pinned };
				}
				// …and so does Department: it is cut with "…" after three lines.
				if (column.key === 'department' && longTexts) return { ...column, wrap: true };
				return column;
			})
	);

	// With table settings: their order, only the visible ones, pinned ones first
	// (the Table pins columns from the start, one after another).
	let columns = $derived(layout ? arrange(allColumns, layout) : allColumns);

	function arrange(list, settings) {
		const shown = settings
			.filter((setting) => setting.visible)
			.map((setting) => {
				const column = list.find((other) => other.key === setting.key);
				return column && { ...column, pinned: setting.pinned };
			})
			.filter(Boolean); // a column left out with `hide` stays out
		return [
			...shown.filter((column) => column.pinned),
			...shown.filter((column) => !column.pinned)
		];
	}

	// The table never gets narrower than this; in a smaller box it scrolls sideways.
	//   872px = a 904px example box without its padding;  620px = the same inside the app window.
	//   Wide tables need no limit: their columns have fixed widths.
	let minWidth = $derived(wide ? 0 : narrow ? 620 : 872);

	/* ---------- Rows: this example filters, sorts and cuts into pages. The Table only shows. ---------- */

	// Most examples only need a few people. The "wrap and cut" example gives one of them long texts.
	let people = $derived(
		(limit ? employees.slice(0, limit) : employees).map((person) =>
			longTexts && person.id === 1
				? { ...person, fullName: t.longName, department: t.longDepartment }
				: person
		)
	);

	/* What this example remembers.
	   (Only the starting values come from the props, on purpose — hence the ignores.) */
	let query = $state('');
	// svelte-ignore state_referenced_locally
	let filtersOn = $state([...filters]); // ids of the filters that are on
	let sortKey = $state('score');
	let sortDirection = $state('desc');
	let page = $state(0);
	// ids of the ticked rows
	// svelte-ignore state_referenced_locally
	let selection = $state(
		picked === 'all' ? filterEmployees(people, '', filters).map((person) => person.id) : [...picked]
	);

	let matching = $derived(
		sortEmployees(filterEmployees(people, query, filtersOn), sortKey, sortDirection)
	);
	let rows = $derived(paged ? matching.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) : matching);
	let lastPage = $derived(Math.max(0, Math.ceil(matching.length / PAGE_SIZE) - 1));
	let total = $derived(matching.reduce((sum, person) => sum + person.score, 0));

	// After a filter change the current page may not exist any more: go back to the last one.
	$effect(() => {
		if (page > lastPage) page = lastPage;
	});

	function sortBy(key) {
		// Clicking the same column again flips the direction.
		sortDirection = key === sortKey && sortDirection === 'desc' ? 'asc' : 'desc';
		sortKey = key;
	}

	function reset() {
		query = '';
		filtersOn = [];
	}
</script>

<!-- ─── The pieces ─── -->

{#snippet toolbar()}
	<ExampleToolbar
		{title}
		bind:query
		bind:filtersOn
		{shown}
		{filterMenu}
		{searchByName}
		{searchPinned}
		buttons={toolbarEnd}
	/>
{/snippet}

<!-- The table. `sticky` = it gets the toolbar and scrolls with the window around it. -->
{#snippet table(sticky)}
	<Table
		{columns}
		{rows}
		{sortKey}
		{sortDirection}
		onsort={sortBy}
		{selectable}
		bind:selection
		allRows={paged ? matching : undefined}
		{minWidth}
		{minHeight}
		{actionsWidth}
		actions={actions.length ? rowActions : undefined}
		toolbar={sticky ? toolbar : undefined}
		pageScroll={sticky}
		summary={summary || paged ? summaryRow : undefined}
		empty={nothingFound}
		texts={tableTexts}
	>
		{#snippet cell(row, column)}<EmployeeCell {row} {column} />{/snippet}
	</Table>
{/snippet}

<!-- The buttons of one row. -->
{#snippet rowActions(row)}
	{#each actions as icon}
		<Button mode="ghost" {icon} label="{t.rowActions[icon]} {row.fullName}" />
	{/each}
{/snippet}

<!-- The summary row. With pages, it also holds the pager. -->
{#snippet summaryRow()}
	<span
		>{t.employees(matching.length)}{#if selectable}&nbsp;· {t.selected(selection.length)}{/if}</span
	>
	{#if paged}
		<span class="pager">
			{t.pageOf(page + 1, lastPage + 1)}
			<Button
				mode="ghost"
				icon={rightToLeft ? 'chevron-right' : 'chevron-left'}
				label={t.previousPage}
				disabled={page === 0}
				onclick={() => page--}
			/>
			<Button
				mode="ghost"
				icon={rightToLeft ? 'chevron-left' : 'chevron-right'}
				label={t.nextPage}
				disabled={page === lastPage}
				onclick={() => page++}
			/>
		</span>
	{:else}
		<span>{t.total} {formatScore(total)}</span>
	{/if}
{/snippet}

<!-- Shown inside the table when the search and filters leave no rows. -->
{#snippet nothingFound()}
	<EmptyState type="not-found" title={notFound.title} description={notFound.description}>
		<Button appearance="accent" mode="primary" icon="close" onclick={reset}
			>{notFound.button}</Button
		>
	</EmptyState>
{/snippet}

<!-- ─── The example ─── -->

{#if viewport}
	<!-- Scrolling examples: the table owns the toolbar, so it can keep it on top
	     while the window scrolls. This is how a real, long page does it. -->
	<Window height={typeof viewport === 'number' ? viewport : 0}>
		{@render table(true)}
	</Window>
{:else}
	<!-- All other examples do not scroll, so the toolbar simply sits above the table.
	     That leaves the table alone in its box, which the always-open list below needs. -->
	<div class="above">{@render toolbar()}</div>

	<div class="region">
		<!-- Guide-only trick: a copy of the table's own "which rows?" list that never closes,
		     so the example always shows it. It sits exactly where the real one opens. -->
		{#if choiceShown}
			<div class="choice">
				<Menu label={tableTexts.whichRows}>
					<MenuItem onclick={() => (selection = rows.map((person) => person.id))}
						>{tableTexts.rowsOnPage}</MenuItem
					>
					<MenuItem onclick={() => (selection = matching.map((person) => person.id))}
						>{tableTexts.allRows}</MenuItem
					>
				</Menu>
			</div>
		{/if}

		{@render table(false)}
	</div>
{/if}

<style>
	/* Toolbar and table sit 12px apart. */
	.above {
		margin-bottom: 12px;
	}
	.region {
		position: relative; /* the always-open list is placed inside it */
		min-width: 0;
	}

	.pager {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	/* The always-open list of the pagination example: right under the header checkbox. */
	.choice {
		position: absolute;
		top: 36px; /* the height of the table header */
		inset-inline-start: 0;
		z-index: 7;
	}
</style>
