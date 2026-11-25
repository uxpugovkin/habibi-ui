<!--
	SIDEBAR — the side menu of the ABAC service: the library Sidebar, filled in for ABAC.
	Logo, the current domain, the sections and the signed-in person.
	A click on the person collapses the menu to icons (and back).

	Figma:  habibi-library → "Sidebar"
	        (the ABAC file uses it in sbertech-habibi → page "abac-r5")

	Use:
		<Sidebar />

	Only "Users" is built in this prototype; the other sections say so.
	The "Current domain" box opens the list of domains (DomainPicker).
-->
<script>
	import { Icon, Sidebar } from '#lib';
	import { photos } from '../ds/employees.js';
	import { notBuilt } from './prototype.svelte.js';
	import DomainPicker from './DomainPicker.svelte';

	const sections = [
		{ id: 'dashboard', label: 'Dashboard', icon: 'view-grid' },
		{ id: 'users', label: 'Users', icon: 'profile' },
		{ id: 'model', label: 'Model', icon: 'script' },
		{ id: 'tasks', label: 'Task Manager', icon: 'wait' }
	];

	let collapsed = $state(false);

	function openSection(item) {
		if (item.id !== 'users') notBuilt(item.label);
	}
</script>

<Sidebar
	title="ABAC"
	subtitle="Platform V"
	items={sections}
	active="users"
	onselect={openSection}
	name="Tatiana Pirog"
	role="Super admin"
	photo={photos[6]}
	bind:collapsed
>
	{#snippet select()}
		<!-- A click opens the list of domains, as wide as this box. -->
		<DomainPicker wide>
			{#snippet trigger(toggle, open)}
				<button class="domain" type="button" aria-expanded={open} onclick={toggle}>
					<span>
						<span class="hb-text-body-d domain__label">Current domain</span>
						<span class="hb-text-body-c">res-domain-144</span>
					</span>
					<Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
				</button>
			{/snippet}
		</DomainPicker>
	{/snippet}
</Sidebar>

<style>
	/* The "Current domain" box: looks like the library's big Select (Figma "select"). */
	.domain {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		width: 100%;
		min-height: 48px;
		padding: 4px 10px;
		border: 0;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-border);
		color: var(--uncolorful-grey-primary);
		font: inherit;
		text-align: start;
		cursor: pointer;
	}
	.domain:hover {
		background: var(--uncolorful-grey-disabled);
	}
	.domain > span {
		display: flex;
		flex-direction: column;
	}
	.domain__label {
		color: var(--uncolorful-grey-secondary);
	}
</style>
