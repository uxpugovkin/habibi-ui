<!--
	USER PAGE — one user's attributes, where every value can be changed in place.

	Figma:  sbertech-habibi → page "abac-r5"
	          "1-0-abtract"           the page
	          "EDIT-form"             the edit card of every datatype (see EditCard)
	          "3-0-unsaved-changes"   changed rows turn orange, Save / Discard at the bottom

	Use:
		<UserPage />

	The flow:
		1. hover a value      → a pencil slides in next to it
		2. click it           → the edit card opens under the row (EditCard)
		3. change the value   → the row turns orange, "Not saved"; a wrong value turns it red, "Error".
		                        Enter or a click elsewhere closes the card; Esc undoes and closes it.
		                        Changing a value back to what is saved makes the row plain again
		4. Save               → saves every change (or fails: see the state panel) · Discard → drops them

	Under the groups: tables (EditableTable), where every cell is edited the same way.
	A changed table row turns orange; Save and Discard cover cells and attributes together.
	The Group filter also lists the tables. A table row can be deleted (button on hover):
	it disappears at once, but only for real after Save — Discard brings it back.

	It started as a copy of the user page of /abac-to-be. What it keeps: the header, the tabs,
	the JSON switch. What is new: the toolbar of Figma (search, Group, Status, Value) and editing.

	The page reads `proto.data` (loading · error) and `proto.save` (what Save answers:
	with "Fails" the server says no to every change, and those rows turn red, "Error").
-->
<script>
	import {
		Button,
		EmptyState,
		FilterChip,
		Menu,
		MenuItem,
		SearchChip,
		Skeleton,
		Switch,
		Table,
		Tabs,
		Tag
	} from '#lib';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		user,
		groups,
		tables,
		cellOf,
		statusOfRow,
		roles,
		startingValues,
		copyOf,
		sameValue,
		isEmpty,
		textOf,
		problemOf,
		jsonOf
	} from './data.js';
	import { proto, notify, notBuilt } from './prototype.svelte.js';
	import Breadcrumbs from './Breadcrumbs.svelte';
	import AttributeRow from './AttributeRow.svelte';
	import EditCard from './EditCard.svelte';
	import EditableTable from './EditableTable.svelte';
	import JsonCode from './JsonCode.svelte';

	/* ---------- Values: what is saved, and what was changed but not saved yet ---------- */

	let saved = $state(startingValues()); // { attribute id: value } — what the "server" has
	let changes = $state({}); // { attribute id: new value } — only the changed attributes
	let deleted = $state([]); // table rows deleted and saved: "table/row" keys
	let deleting = $state([]); // table rows deleted, not saved yet
	let saving = $state(false);

	// What the page shows: the saved values with the changes on top.
	let values = $derived({ ...saved, ...changes });

	// Changes the "server" did not accept (Save with "Save: Fails" in the state panel).
	// { id: true }. Changing the value again clears it.
	let rejected = $state({});

	function statusOf(attribute) {
		if (!(attribute.id in changes)) return 'default';
		return problemFor(attribute) ? 'error' : 'not-saved';
	}

	// What is wrong with the value now: a mistake in it, or the server said no.
	function problemFor(attribute) {
		if (rejected[attribute.id]) return 'The server did not accept this value';
		return problemOf(attribute, values[attribute.id]);
	}

	let changedCount = $derived(Object.keys(changes).length + deleting.length);
	// Everything that can be edited: the attributes of the groups and every table cell.
	const editables = [
		...groups.flatMap((group) => group.attributes),
		...tables.flatMap((table) =>
			table.rows.flatMap((row) => table.columns.map((column) => cellOf(table, row, column)))
		)
	];
	let errorCount = $derived(editables.filter((item) => statusOf(item) === 'error').length);

	// A new value for one attribute. Back to what is saved = no change any more.
	function change(attribute, value) {
		delete rejected[attribute.id]; // a new value: the server has not said no to it yet
		if (sameValue(value, saved[attribute.id])) {
			delete changes[attribute.id];
		} else {
			changes[attribute.id] = value;
		}
	}

	// Deleting a table row: it leaves the table now, for real on Save. Changes made in
	// its cells go with it (they must not stop Save with an error nobody can see).
	function deleteRow(table, row) {
		const key = `${table.id}/${row.id}`;
		for (const id of Object.keys(changes)) {
			if (id.startsWith(`${key}/`)) delete changes[id];
		}
		deleting = [...deleting, key];
		notify('Row deleted. Save to apply, Discard to bring it back');
	}

	/* ---------- The edit card: one at a time ---------- */

	let editing = $state(''); // the id of the attribute (or cell) whose card is open; '' = none
	let before; // its value when the card opened, for Esc

	function openCard(attribute) {
		openMenu = '';
		editing = attribute.id;
		before = copyOf(values[attribute.id]);
	}

	function closeCard(undo, attribute) {
		if (undo) change(attribute, before);
		editing = '';
	}

	/* ---------- Save and Discard ---------- */

	function save() {
		editing = '';
		if (errorCount) {
			notify(
				`Fix ${errorCount === 1 ? 'the error' : `${errorCount} errors`} before saving`,
				'error'
			);
			return;
		}
		saving = true;
		proto.toast = null; // an older message (e.g. "Fix the error") is no longer true
		// The "server" answers after a moment; what it answers is set in the state panel.
		setTimeout(() => {
			saving = false;
			// The server says no to every change: those rows turn red, "Error".
			if (proto.save === 'failure') {
				rejected = Object.fromEntries(Object.keys(changes).map((id) => [id, true]));
				notify("The server didn't accept the changes. Fix the red rows", 'error');
				return;
			}
			const count = changedCount;
			saved = { ...saved, ...changes };
			changes = {};
			rejected = {};
			deleted = [...deleted, ...deleting];
			deleting = [];
			notify(count === 1 ? 'Change saved' : `${count} changes saved`, 'success');
		}, 800);
	}

	function discard() {
		editing = '';
		changes = {};
		rejected = {};
		deleting = [];
		notify('Changes discarded');
	}

	/* ---------- Tabs ---------- */

	const tabs = [
		{ id: 'attributes', label: 'Domain attributes' },
		{ id: 'roles', label: 'Roles and privileges' },
		{ id: 'delegations', label: 'Delegations' }
	];
	let tab = $state('attributes');
	let json = $state(false); // true = the attributes are shown as JSON code

	const roleColumns = [
		{ key: 'role', label: 'Role', width: '20%' },
		{ key: 'scope', label: 'Scope' },
		{ key: 'grantedBy', label: 'Granted by' },
		{ key: 'validUntil', label: 'Valid until', width: 140 }
	];

	/* ---------- Search and filters (the toolbar) ---------- */

	let query = $state('');
	let groupFilter = $state(''); // a group (or table) title, or '' = all
	let statusFilter = $state(''); // "error" | "not-saved" | '' = all
	let valueFilter = $state(''); // "filled" | "empty" | '' = all

	const statusOptions = [
		{ value: 'error', label: 'Error' },
		{ value: 'not-saved', label: 'Not saved' }
	];
	const valueOptions = [
		{ value: 'filled', label: 'Filled' },
		{ value: 'empty', label: 'Empty' }
	];

	let openMenu = $state(''); // which filter list is open: 'group', 'status', 'value' or ''

	function toggleMenu(event, id) {
		event.stopPropagation(); // the window handler below must not close what was just opened
		editing = '';
		openMenu = openMenu === id ? '' : id;
	}

	function fits(attribute) {
		// The attribute being edited stays, whatever its status turns into while typing.
		if (attribute.id === editing) return true;

		const words = query.trim().toLowerCase();
		const value = values[attribute.id];
		const status = statusOf(attribute);

		if (words && !`${attribute.title} ${textOf(attribute, value)}`.toLowerCase().includes(words)) {
			return false;
		}
		if (statusFilter && status !== statusFilter) return false;
		if (valueFilter === 'filled' && isEmpty(value)) return false;
		if (valueFilter === 'empty' && !isEmpty(value)) return false;
		return true;
	}

	// The groups that are left, each with only the attributes that are left.
	let shownGroups = $derived(
		groups
			.filter((group) => !groupFilter || group.title === groupFilter)
			.map((group) => ({ ...group, attributes: group.attributes.filter(fits) }))
			.filter((group) => group.attributes.length)
	);
	// The tables have a search and filters of their own. Of the page's filters, Group picks
	// the tables, and Status picks their rows (a table with no such rows hides).
	// Search and Value are for the attributes only.
	let shownTables = $derived(
		tables.filter(
			(table) =>
				(!groupFilter || table.title === groupFilter) &&
				(!statusFilter || table.rows.some((row) => rowFitsStatus(table, row)))
		)
	);

	// A table row and the Status filter: the row being edited counts as fitting.
	function rowFitsStatus(table, row) {
		const key = `${table.id}/${row.id}`;
		if ([...deleted, ...deleting].includes(key)) return false;
		if (editing.startsWith(`${key}/`)) return true;
		return statusOfRow(table, row, statusOf) === statusFilter;
	}

	// What the page shows, in order: each group, followed by the tables placed right after
	// it (`after` in data.js); then the other tables. Each item is { group } or { table }.
	let sections = $derived.by(() => {
		const list = [];
		for (const group of groups) {
			const shown = shownGroups.find((other) => other.title === group.title);
			if (shown) list.push({ group: shown });
			for (const table of shownTables.filter((other) => other.after === group.title)) {
				list.push({ table });
			}
		}
		for (const table of shownTables.filter((other) => !other.after)) list.push({ table });
		return list;
	});

	function clearFilters() {
		query = '';
		groupFilter = '';
		statusFilter = '';
		valueFilter = '';
	}

	let crumbs = [
		{ label: 'cyber-security-tenant' },
		{ label: 'res-domain-144', domains: true },
		{ label: 'Users', onclick: () => notBuilt('The list of users') }
	];
</script>

<!-- A click anywhere else closes the edit card (keeping its value) and the filter lists. -->
<svelte:window
	onclick={() => {
		editing = '';
		openMenu = '';
	}}
/>

<div class="screen">
	<header class="head">
		<Breadcrumbs items={crumbs} />

		<div class="title">
			<h1 class="hb-text-h2">{user.fullName}</h1>
			<Tag colour="success">{user.status}</Tag>
			<Tag>Last sync {user.lastSync}</Tag>

			<span class="title__buttons">
				<Button appearance="accent" icon="split" onclick={() => notBuilt('Compare')}>Compare</Button
				>
				<Button
					appearance="accent"
					icon="download"
					onclick={() => notify('Auth context downloaded', 'success')}>Auth Context</Button
				>
				<Button appearance="accent" icon="wait" onclick={() => notBuilt('Audit log')}
					>Audit log</Button
				>
				<Button
					appearance="accent"
					icon="overflow"
					label="More"
					onclick={() => notBuilt('This menu')}
				/>
			</span>
		</div>

		<div class="hb-text-body-c ids">
			<span>ID{user.uid}</span>
			<span class="ids__dot" aria-hidden="true">•</span>
			<span>{user.login}</span>
		</div>
	</header>

	<Tabs {tabs} bind:active={tab} />

	{#if tab === 'attributes'}
		<div class="bar">
			<SearchChip bind:value={query} placeholder="Search attributes" />

			<span class="anchor">
				<FilterChip
					name="Group"
					value={groupFilter}
					onclick={(event) => toggleMenu(event, 'group')}
					onclear={() => (groupFilter = '')}
				/>
				{#if openMenu === 'group'}
					<div class="anchor__menu">
						<Menu label="Group">
							{#each [...groups, ...tables] as group}
								<MenuItem
									checked={groupFilter === group.title}
									onclick={() => (groupFilter = group.title)}>{group.title}</MenuItem
								>
							{/each}
						</Menu>
					</div>
				{/if}
			</span>

			<span class="anchor">
				<FilterChip
					name="Status"
					value={statusOptions.find((option) => option.value === statusFilter)?.label ?? ''}
					onclick={(event) => toggleMenu(event, 'status')}
					onclear={() => (statusFilter = '')}
				/>
				{#if openMenu === 'status'}
					<div class="anchor__menu">
						<Menu label="Status">
							{#each statusOptions as option}
								<MenuItem
									checked={statusFilter === option.value}
									onclick={() => (statusFilter = option.value)}>{option.label}</MenuItem
								>
							{/each}
						</Menu>
					</div>
				{/if}
			</span>

			<span class="anchor">
				<FilterChip
					name="Value"
					value={valueOptions.find((option) => option.value === valueFilter)?.label ?? ''}
					onclick={(event) => toggleMenu(event, 'value')}
					onclear={() => (valueFilter = '')}
				/>
				{#if openMenu === 'value'}
					<div class="anchor__menu">
						<Menu label="Value">
							{#each valueOptions as option}
								<MenuItem
									checked={valueFilter === option.value}
									onclick={() => (valueFilter = option.value)}>{option.label}</MenuItem
								>
							{/each}
						</Menu>
					</div>
				{/if}
			</span>

			<!-- On: the attributes are shown as code instead of cards (with the changes in it). -->
			<span class="bar__json"><Switch bind:checked={json}>JSON</Switch></span>
		</div>

		{#if proto.data === 'loading'}
			<section class="group" aria-busy="true">
				<Skeleton width={160} />
				{#each { length: 6 } as _}
					<div class="skeleton-row">
						<Skeleton width={120} />
						<Skeleton width="45%" />
					</div>
				{/each}
			</section>
		{:else if proto.data === 'error'}
			<div class="fill">
				<EmptyState
					type="maintenance"
					title="Failed to load the user schema"
					description="The attributes of this user cannot be shown until the schema loads."
				>
					<Button
						appearance="accent"
						mode="primary"
						icon="refresh"
						onclick={() => (proto.data = 'ready')}>Try again</Button
					>
				</EmptyState>
			</div>
		{:else if json}
			<JsonCode value={jsonOf(values, [...deleted, ...deleting])} {query} />
		{:else if shownGroups.length === 0 && shownTables.length === 0}
			<div class="fill">
				<EmptyState
					type="not-found"
					title="No matching attributes"
					description="Try another word, or clear the filters."
				>
					<Button appearance="accent" mode="primary" onclick={clearFilters}>Clear filters</Button>
				</EmptyState>
			</div>
		{:else}
			{#each sections as section (section.group?.title ?? section.table.id)}
				{#if section.group}
					<section class="group">
						<h2 class="group__title hb-text-body-a">{section.group.title}</h2>
						{#each section.group.attributes as attribute (attribute.id)}
							<AttributeRow
								{attribute}
								value={values[attribute.id]}
								status={statusOf(attribute)}
								open={editing === attribute.id}
								onedit={() => openCard(attribute)}
							>
								{#snippet card()}
									<EditCard
										{attribute}
										bind:value={() => values[attribute.id], (value) => change(attribute, value)}
										problem={problemFor(attribute)}
										onclose={(undo) => closeCard(undo, attribute)}
									/>
								{/snippet}
							</AttributeRow>
						{/each}
					</section>
				{:else}
					<EditableTable
						table={section.table}
						{values}
						{statusOf}
						{editing}
						hidden={[...deleted, ...deleting]}
						onlyStatus={statusFilter}
						onedit={openCard}
						ondelete={(row) => deleteRow(section.table, row)}
						onclose={() => (editing = '')}
					>
						{#snippet card(cell)}
							<EditCard
								attribute={cell}
								bind:value={() => values[cell.id], (value) => change(cell, value)}
								problem={problemFor(cell)}
								onclose={(undo) => closeCard(undo, cell)}
							/>
						{/snippet}
					</EditableTable>
				{/if}
			{/each}
		{/if}
	{:else if tab === 'roles'}
		<section class="group group--table">
			<Table columns={roleColumns} rows={roles}>
				{#snippet cell(row, column)}
					{#if column.key === 'role'}<Tag size="s">{row.role}</Tag>{:else}{row[column.key]}{/if}
				{/snippet}
			</Table>
		</section>
	{:else}
		<div class="fill">
			<EmptyState
				type="empty"
				title="No delegations yet"
				description="Rights passed to or from this user will show up here."
			/>
		</div>
	{/if}
</div>

<!-- Only while something is changed: it slides up from the bottom and stays there. -->
{#if changedCount}
	<div class="save-bar" transition:fly={{ y: 16, duration: 300, easing: cubicOut }}>
		<Button appearance="accent" mode="primary" size="m" loading={saving} onclick={save}>Save</Button
		>
		<Button appearance="accent" mode="ghost" size="m" disabled={saving} onclick={discard}
			>Discard</Button
		>
	</div>
{/if}

<style>
	.screen {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-block: 24px;
		padding-inline: 24px var(--screen-end, 24px); /* start, end: follows right-to-left */
	}
	.head {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	.title h1 {
		margin: 0;
	}
	.title__buttons {
		display: flex;
		gap: 8px;
		margin-inline-start: auto;
	}
	.ids {
		display: flex;
		gap: 8px;
	}
	.ids__dot {
		color: var(--uncolorful-grey-disabled);
	}

	/* The toolbar: search, two filters, the JSON switch — 6px apart, as in Figma. */
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
	}
	.bar__json {
		display: inline-flex;
		align-items: center;
		padding-inline: 8px;
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

	.fill {
		flex: 1;
		display: grid;
		place-items: center;
	}

	/* Figma "Section": a white card with one group of attributes. */
	.group {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 8px 8px 10px;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
	}
	.group--table {
		padding: 0 0 8px;
	}
	.group__title {
		margin: 0;
		padding: 4px 8px;
		color: var(--uncolorful-grey-primary);
	}
	.skeleton-row {
		display: flex;
		gap: 88px;
		align-items: center;
		min-height: 40px;
		padding: 4px 8px;
	}

	/* Figma "Frame 30": Save and Discard at the bottom of the page.
	   It sticks to the bottom while the page scrolls under it. */
	.save-bar {
		position: sticky;
		bottom: 0;
		z-index: 10;
		display: flex;
		gap: 8px;
		padding: 12px 24px 16px;
		background: var(--uncolorful-grey-background);
	}
</style>
