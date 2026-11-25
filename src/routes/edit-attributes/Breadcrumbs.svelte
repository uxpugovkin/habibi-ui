<!--
	BREADCRUMBS — the small line above a page title that says where you are.

	Figma:  sbertech-habibi → page "abac-r5" → any screen → "Header" → "Breadcrumps"
	Copied from the ABAC prototype (habibi-library has no breadcrumbs yet).

	Use:
		<Breadcrumbs
			items={[
				{ label: 'cyber-security-tenant' },
				{ label: 'res-domain-144', domains: true },
				{ label: 'Users', onclick: goToList }
			]}
		/>

	Props:
		items   the steps, first to last. Each one:
		          label     the text
		          onclick   if set, the step is a link (a button) that calls it
		          domains   true = a small arrow after the text; a click opens the list of
		                    domains (DomainPicker)
		          current   true = the page you are on: pale grey
-->
<script>
	import { Icon } from '#lib';
	import DomainPicker from './DomainPicker.svelte';

	let { items = [] } = $props();
</script>

<nav class="crumbs hb-text-body-d" aria-label="Breadcrumbs">
	{#each items as item, index}
		{#if index > 0}<span class="crumbs__slash" aria-hidden="true">/</span>{/if}

		{#if item.domains}
			<DomainPicker>
				{#snippet trigger(toggle, open)}
					<button class="crumbs__step" type="button" aria-expanded={open} onclick={toggle}>
						{item.label}
						<Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
					</button>
				{/snippet}
			</DomainPicker>
		{:else if item.onclick}
			<button class="crumbs__step" type="button" onclick={item.onclick}>{item.label}</button>
		{:else}
			<span
				class="crumbs__step"
				class:crumbs__step--current={item.current}
				aria-current={item.current ? 'page' : undefined}
			>
				{item.label}
			</span>
		{/if}
	{/each}
</nav>

<style>
	.crumbs {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		min-height: 16px;
	}
	.crumbs__slash {
		color: var(--uncolorful-grey-disabled);
	}
	.crumbs__step {
		display: inline-flex;
		align-items: center;
		padding: 0;
		border: 0;
		background: none;
		color: var(--boring-blue-50);
		font: inherit;
	}
	.crumbs__step :global(.hb-icon) {
		margin: -2px 0; /* the arrow must not make the line taller */
	}
	button.crumbs__step {
		cursor: pointer;
	}
	button.crumbs__step:hover {
		color: var(--boring-blue-40);
		text-decoration: underline;
	}
	.crumbs__step--current {
		color: var(--uncolorful-grey-disabled);
	}
</style>
