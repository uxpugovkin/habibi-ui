<!--
	THE FRAME OF THE DOCS  —  everything under /ds
	A top bar, a side menu, and the page content next to it.

	The top bar has two switches for checking the design system:
	  - Theme            changes the colours of the whole site
	  - Arabic examples  switches only the EXAMPLES to Arabic, right to left.
	                     The docs text, the bar and the side menu stay English
	                     (see examples.svelte.js and content.js).

	To add a page to the side menu, add a line to `menu` or `guides` below.
-->
<script>
	import { examples } from './examples.svelte.js';
	import { resolve } from '$app/paths';
	import { Select, Switch, Button } from '#lib';

	let { children } = $props();

	// Side menu, part 1: the components on the /ds page. Each name jumps to its <Demo>.
	const menu = [
		{ group: 'Foundations', items: ['Colours', 'Typography', 'Icons', 'Radius and shadows'] },
		{ group: 'Basics', items: ['Button', 'Loader'] },
		{
			group: 'Forms',
			items: ['TextInput', 'Select', 'MultiSelect', 'Checkbox', 'Radio', 'Switch', 'Slider']
		},
		{
			group: 'Navigation',
			items: ['Tabs', 'Chip', 'Segmented', 'FilterChip', 'SearchChip', 'Menu', 'Tree', 'Sidebar']
		},
		{
			group: 'Status',
			items: ['Tag', 'Badge', 'Marker', 'Notification', 'Tooltip', 'Skeleton', 'Avatar']
		},
		{ group: 'Data', items: ['Table', 'DragRow', 'EmptyState', 'Splitter'] }
	];

	// Side menu, part 2: longer write-ups that have a page of their own.
	const guides = [
		{ label: 'Tables', path: '/ds/tables' },
		{ label: 'Table settings', path: '/ds/table-settings' }
	];

	const themes = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'olive', label: 'Olive' },
		{ value: 'olive-night', label: 'Olive Night' }
	];

	let theme = $state('light');
	let arabic = $state(false);

	// The examples read this (see examples.svelte.js).
	$effect(() => {
		examples.lang = arabic ? 'ar' : 'en';
	});

	// The theme goes onto <html>, so the whole site follows (see tokens/colours.css).
	$effect(() => {
		document.documentElement.dataset.theme = theme;
	});
</script>

<header class="bar">
	<Button mode="ghost" icon="arrow-left" href={resolve('/')} label="Home" />
	<strong class="hb-text-body-b-bold">Habibi UI</strong>
	<span class="bar__space"></span>
	<Switch bind:checked={arabic}>Arabic examples (right-to-left)</Switch>
	<div class="bar__theme"><Select options={themes} bind:value={theme} aria-label="Theme" /></div>
</header>

<div class="layout">
	<nav class="side">
		{#each menu as section}
			<div class="hb-text-body-e-bold side__group">{section.group}</div>
			{#each section.items as item}
				<a class="hb-text-body-c" href="{resolve('/ds')}#{item.toLowerCase().replaceAll(' ', '-')}"
					>{item}</a
				>
			{/each}
		{/each}

		<div class="hb-text-body-e-bold side__group">Guidelines</div>
		{#each guides as guide}
			<a class="hb-text-body-c" href={resolve(guide.path)}>{guide.label}</a>
		{/each}
	</nav>

	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	/* ---------- Top bar (stays visible while scrolling) ---------- */
	.bar {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 16px;
		height: 56px;
		padding: 0 24px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
		background: var(--uncolorful-grey-surface);
	}
	.bar__space {
		flex: 1;
	}
	.bar__theme {
		width: 140px;
	}

	/* ---------- Side menu + content ---------- */
	.layout {
		display: flex;
		align-items: flex-start;
	}
	.side {
		position: sticky;
		top: 56px;
		flex: none;
		display: flex;
		flex-direction: column;
		width: 200px;
		height: calc(100vh - 56px);
		padding: 16px 12px;
		overflow-y: auto;
	}
	.side__group {
		margin: 16px 8px 4px;
		color: var(--uncolorful-grey-tertiary);
	}
	.side a {
		padding: 2px 8px;
		border-radius: var(--radius-m);
		color: var(--uncolorful-grey-primary);
		text-decoration: none;
	}
	.side a:hover {
		background: var(--uncolorful-grey-border);
	}
	/* Code (CSS names, class names) always reads left to right, also in right-to-left mode. */
	.content :global(code) {
		direction: ltr;
		unicode-bidi: isolate;
	}
	.content {
		flex: 1;
		min-width: 0;
		max-width: 1264px; /* 1216px examples (the size they have in Figma) + padding */
		padding: 24px 24px 96px;
	}

	/* On narrow screens the side menu is hidden; the page is still one long scroll. */
	@media (max-width: 800px) {
		.side {
			display: none;
		}
	}
</style>
