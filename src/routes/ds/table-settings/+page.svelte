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
	import DrawerExample from './DrawerExample.svelte';
	import PopoverExample from './PopoverExample.svelte';

	// rule id → the snippet that shows it.
	const exampleFor = {
		1.1: drawer,
		1.2: popover
	};
</script>

<svelte:head>
	<title>Table settings · Habibi UI</title>
</svelte:head>

<Guide chapters={tableSettingsGuidelines} {exampleFor} />

<!-- ════════════════════════ THE EXAMPLES ════════════════════════ -->

{#snippet drawer()}
	<DrawerExample />
{/snippet}

{#snippet popover()}
	<PopoverExample />
{/snippet}
