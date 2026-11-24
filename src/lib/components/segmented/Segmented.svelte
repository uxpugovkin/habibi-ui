<!--
	SEGMENTED
	A row of pills in a grey tray where exactly ONE is chosen —
	for switching a view mode, like "List · Grid" or "Read · Comparison".

	Figma:  habibi-library → page "chips" → "segment" and "segment-group"

	Use:
		<Segmented
			bind:value={view}
			options={[
				{ value: 'list', label: 'List', icon: 'menu' },
				{ value: 'grid', label: 'Grid', icon: 'view-grid' }
			]}
		/>

		Plain texts work too:
		<Segmented bind:value={period} options={['Day', 'Week', 'Month']} />

		Icons only (the labels become hints):
		<Segmented
			iconOnly
			bind:value={shown}
			options={[
				{ value: 'shown', label: 'Show', icon: 'visibility-on' },
				{ value: 'hidden', label: 'Hide', icon: 'visibility-off' }
			]}
		/>

	Props:
		value      the chosen value. Use bind:value to read and change it
		options    the list. Either plain texts, or objects { value, label, icon, disabled }
		iconOnly   true = each segment shows only its icon; its label becomes the hint under
		           the mouse and what screen readers say. Default false
		disabled   true = the whole control cannot be clicked

	The look lives in ../chip/chip.css (shared with Chip and FilterChip).
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import '../chip/chip.css';

	let {
		value = $bindable(),
		options = [],
		iconOnly = false,
		disabled = false,
		class: extraClass = ''
	} = $props();

	// Accept both 'Text' and { value, label }: turn everything into { value, label }.
	let items = $derived(
		options.map((option) =>
			typeof option === 'string' ? { value: option, label: option } : option
		)
	);
</script>

<div class="hb-segmented {extraClass}" role="radiogroup">
	{#each items as item}
		<button
			class="hb-chip hb-chip--segment"
			class:hb-chip--active={item.value === value}
			type="button"
			role="radio"
			aria-checked={item.value === value}
			disabled={disabled || item.disabled}
			aria-label={iconOnly ? item.label : undefined}
			title={iconOnly ? item.label : undefined}
			onclick={() => (value = item.value)}
		>
			{#if item.icon}<Icon name={item.icon} size={20} />{/if}
			{#if !iconOnly}<span class="hb-chip__label">{item.label}</span>{/if}
		</button>
	{/each}
</div>
