<!--
	DOMAIN PICKER — the list of the tenant's domains, with a search on top.
	Opens under whatever opens it: the domain in the breadcrumbs, or the
	"Current domain" box of the side menu.

	Figma:  sbertech-habibi → page "abac-r5" (the domain breadcrumb and the Sidebar select)
	Copied from the ABAC prototype (src/routes/abac-to-be). Built from Menu, MenuItem and TextInput.

	Use — hand it the thing that opens it, as a snippet:
		<DomainPicker>
			{#snippet trigger(toggle, open)}
				<button onclick={toggle} aria-expanded={open}>res-domain-144</button>
			{/snippet}
		</DomainPicker>

	Props:
		trigger   snippet that draws the opener. Gets (toggle, open): call toggle on click
		wide      true = the list is exactly as wide as the opener (the side menu box).
		          Default: at least 280px, starting under the opener

	In this prototype only the current domain can be picked: the others are listed
	but disabled. A click anywhere else, or Esc, closes the list.
-->
<script>
	import { Menu, MenuItem, TextInput } from '#lib';
	import { domains, currentDomain } from './data.js';
	import { notify } from './prototype.svelte.js';

	let { trigger, wide = false } = $props();

	let open = $state(false);
	let query = $state('');

	let matching = $derived(domains.filter((domain) => domain.includes(query.trim().toLowerCase())));

	function toggle(event) {
		event.stopPropagation(); // the window handler below must not close what was just opened
		open = !open;
		query = '';
	}

	// Focus the search as soon as the list appears.
	function focusSearch(node) {
		node.querySelector('input')?.focus();
	}
</script>

<svelte:window
	onclick={() => (open = false)}
	onkeydown={(event) => event.key === 'Escape' && (open = false)}
/>

<span class="picker" class:picker--wide={wide}>
	{@render trigger(toggle, open)}

	{#if open}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="picker__menu" onclick={(event) => event.stopPropagation()}>
			<Menu label="Domains">
				<div class="picker__search" use:focusSearch>
					<TextInput
						icon="search"
						placeholder="Search domains"
						aria-label="Search domains"
						bind:value={query}
					/>
				</div>
				<div class="hb-menu__heading">cyber-security-tenant</div>
				<div class="picker__list hb-scroll">
					{#each matching as domain (domain)}
						<MenuItem
							checked={domain === currentDomain}
							disabled={domain !== currentDomain}
							onclick={() => {
								open = false;
								notify(`You are in ${domain}`);
							}}>{domain}</MenuItem
						>
					{:else}
						<div class="picker__none hb-text-body-c">No domains match “{query}”</div>
					{/each}
				</div>
			</Menu>
		</div>
	{/if}
</span>

<style>
	.picker {
		position: relative;
		display: inline-flex;
	}
	.picker--wide {
		display: flex;
	}
	.picker__menu {
		position: absolute;
		top: calc(100% + 4px);
		inset-inline-start: 0;
		z-index: 30;
		width: 280px;
	}
	.picker--wide .picker__menu {
		inset-inline-end: 0;
		width: auto;
	}
	.picker__search {
		padding: 4px 8px 8px;
	}
	/* Long lists scroll inside the card; the search stays on top. */
	.picker__list {
		max-height: 320px;
		overflow-y: auto;
	}
	.picker__none {
		padding: 8px 16px;
		color: var(--uncolorful-grey-tertiary);
	}
</style>
