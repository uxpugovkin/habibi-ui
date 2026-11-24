<!--
	TABLE GUIDELINES  —  /ds/tables
	Every rule for working with tables, with a live example under it.

	Where things live:
	  - the TEXT of the rules      src/lib/components/table/guidelines.js   (edit rules there)
	  - the EXAMPLES               this file, one snippet per rule, listed in `exampleFor` below
	  - the example table itself   ./TableExample.svelte  (the "Employees" table from Figma)
	  - the page layout            ../Guide.svelte (banners, numbered rules, example boxes)

	To give a rule an example: write a snippet at the bottom of this file and add
	a line to `examples` with the rule's id.
-->
<script>
	import { tableGuidelines } from '#lib/components/table/guidelines.js';
	import { Button, Tabs } from '#lib';
	import TableExample from './TableExample.svelte';
	import AnatomyExample from './AnatomyExample.svelte';
	import AppFrame from './AppFrame.svelte';
	import Guide from '../Guide.svelte';
	import { content } from '../content.js';
	import { pick, examples } from '../examples.svelte.js';

	// rule id → the snippet that shows it. Rules without a line here have no example.
	const exampleFor = {
		1.1: anatomy,
		1.2: sorting,
		1.3: wrapAndCut,
		2.1: scrollDown,
		2.2: scrollSideways,
		2.3: scrollBoth,
		3.2: filterTags,
		3.3: searchAll,
		3.4: searchOne,
		3.5: moreFilters,
		4.1: buttonInHeader,
		4.2: buttonInToolbar,
		4.3: iconButton,
		5.1: actionsColumn,
		5.2: actionsFloating,
		5.3: actionsPinned,
		6.1: selectStart,
		6.2: selectSome,
		6.3: selectAll,
		6.4: selectAndFilter,
		6.5: selectAndPages
	};

	// The example texts, in the current language.
	let t = $derived(pick(content.tables, examples.lang));

	let tab = $state('a'); // for the "Button placement" examples
</script>

<svelte:head>
	<title>Table guidelines · Habibi UI</title>
</svelte:head>

<Guide chapters={tableGuidelines} {exampleFor} />

<!-- ════════════════════════ THE EXAMPLES ════════════════════════
     One snippet per rule, in the order of the rules.

     Two kinds:
     - most examples show a few rows (`limit`) and do not scroll at all
     - the SCROLLING examples use `viewport`: the example box plays the browser
       window and scrolls, while the toolbar and the table header stay on top -->

<!-- 1. Tables -->
{#snippet anatomy()}
	<AnatomyExample />
{/snippet}

{#snippet sorting()}
	<TableExample title={t.title} selectable summary limit={7} />
{/snippet}

{#snippet wrapAndCut()}
	<TableExample title={t.title} longTexts selectable summary limit={5} />
{/snippet}

<!-- 2. Scrolling -->
{#snippet scrollDown()}
	<TableExample viewport={420} />
{/snippet}

{#snippet scrollSideways()}
	<TableExample wide pinned viewport limit={11} />
{/snippet}

{#snippet scrollBoth()}
	<TableExample wide pinned selectable viewport={440} />
{/snippet}

<!-- 3. Search and filter -->
{#snippet filterTags()}
	<TableExample
		selectable
		shown={['status', 'skills', 'department', 'office', 'score']}
		filters={['status', 'skills', 'department', 'office', 'score']}
		minHeight={220}
	/>
{/snippet}

<!-- minHeight keeps the box the same size when the search leaves one row, or none. -->
{#snippet searchAll()}
	<TableExample searchPinned limit={10} minHeight={400} />
{/snippet}

{#snippet searchOne()}
	<TableExample searchByName searchPinned limit={10} minHeight={400} />
{/snippet}

{#snippet moreFilters()}
	<TableExample title={t.title} filterMenu limit={10} minHeight={400} />
{/snippet}

<!-- 4. Button placement -->
{#snippet buttonInHeader()}
	<AppFrame>
		<div class="page-header">
			<h4 class="hb-text-h2">{t.page}</h4>
			<Button appearance="accent" mode="primary">{t.addRow}</Button>
		</div>
		<TableExample narrow limit={9} />
	</AppFrame>
{/snippet}

{#snippet buttonInToolbar()}
	<AppFrame>
		<div class="page-header"><h4 class="hb-text-h2">{t.page}</h4></div>
		<div class="page-tabs"><Tabs tabs={t.pageTabs} bind:active={tab} /></div>
		<TableExample narrow limit={8}>
			{#snippet toolbarEnd()}
				<Button icon="overflow" label={t.more} />
				<Button icon="upload" label={t.upload} />
				<Button appearance="accent" mode="primary">{t.addRow}</Button>
			{/snippet}
		</TableExample>
	</AppFrame>
{/snippet}

{#snippet iconButton()}
	<AppFrame>
		<div class="page-header"><h4 class="hb-text-h2">{t.page}</h4></div>
		<div class="page-tabs"><Tabs tabs={t.pageTabs} bind:active={tab} /></div>
		<TableExample narrow limit={8}>
			{#snippet toolbarEnd()}
				<Button icon="overflow" label={t.more} />
				<Button icon="upload" label={t.upload} />
				<Button appearance="accent" mode="primary" icon="plus" label={t.addRow} />
			{/snippet}
		</TableExample>
	</AppFrame>
{/snippet}

<!-- 5. Single-row actions -->
{#snippet actionsColumn()}
	<TableExample hide={['office']} actions={['delete']} actionsWidth={48} limit={12} />
{/snippet}

<!-- These two are about tables that scroll sideways, so they use the window too. -->
{#snippet actionsFloating()}
	<TableExample
		title={t.title}
		wide
		pinned
		actions={['edit', 'download', 'delete']}
		viewport
		limit={10}
	/>
{/snippet}

{#snippet actionsPinned()}
	<TableExample wide pinned actions={['delete']} actionsWidth={48} viewport={440} />
{/snippet}

<!-- 6. Bulk operations -->
{#snippet selectStart()}
	<TableExample title={t.title} selectable limit={10} />
{/snippet}

<!-- `picked` ticks rows at the start, so each example opens in the state its rule describes. -->
{#snippet selectSome()}
	<TableExample title={t.title} selectable summary limit={10} picked={[2, 3, 5]} />
{/snippet}

{#snippet selectAll()}
	<TableExample title={t.title} selectable summary limit={10} picked="all" />
{/snippet}

{#snippet selectAndFilter()}
	<TableExample
		selectable
		summary
		limit={10}
		filters={['department']}
		picked="all"
		minHeight={400}
	/>
{/snippet}

{#snippet selectAndPages()}
	<TableExample title={t.title} selectable paged choiceShown />
{/snippet}

<style>
	h4 {
		margin: 0;
	}

	/* ---------- Bits of the fake pages in "Button placement" ---------- */
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 32px;
		margin-bottom: 16px;
		color: var(--uncolorful-grey-extra);
	}
	.page-tabs {
		margin-bottom: 16px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
		/* Tabs sit 24px apart on this page, as in Figma. */
		--tabs-gap: 24px;
	}
</style>
