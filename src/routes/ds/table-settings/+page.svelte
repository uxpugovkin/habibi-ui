<!--
	TABLE SETTINGS GUIDE  —  /ds/table-settings
	How people show, hide, pin and reorder the columns of a table, with a live example
	under every rule. The "Appendix A" of the table guidelines.

	Where things live:
	  - the TEXT of the rules      src/lib/components/table/guidelines.js  (tableSettingsGuidelines)
	  - the EXAMPLES               this file, one snippet per rule, listed in `exampleFor` below
	  - the two settings panels    ./DrawerExample.svelte, ./PopoverExample.svelte
	  - the list of columns        ./ColumnList.svelte (rows to drag, show and hide)
	  - the page layout            ../Guide.svelte
-->
<script>
	import { tableSettingsGuidelines } from '#lib/components/table/guidelines.js';
	import Guide from '../Guide.svelte';
	import TableExample from '../tables/TableExample.svelte';
	import DrawerExample from './DrawerExample.svelte';
	import PopoverExample from './PopoverExample.svelte';

	// rule id → the snippet that shows it.
	const exampleFor = {
		1.1: defaultView,
		1.2: drawer,
		1.3: popover
	};
</script>

<svelte:head>
	<title>Table settings · Habibi UI</title>
</svelte:head>

<Guide chapters={tableSettingsGuidelines} {exampleFor} />

<!-- ════════════════════════ THE EXAMPLES ════════════════════════ -->

<!-- The table as it is before anyone opens its settings; the settings button is the last one. -->
{#snippet defaultView()}
	<TableExample wide viewport={528} />
{/snippet}

{#snippet drawer()}
	<DrawerExample />
{/snippet}

{#snippet popover()}
	<PopoverExample />
{/snippet}
