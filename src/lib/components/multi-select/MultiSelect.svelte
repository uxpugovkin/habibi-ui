<!--
	MULTI-SELECT
	A box that opens a list to pick SEVERAL options from.
	The chosen options are shown in the box as tags.

	Figma:  habibi-library → page "input" → "combobox"

	Use:
		<MultiSelect
			label="Skills"
			placeholder="Choose…"
			options={['Go', 'API', 'SQL', 'Rust']}
			bind:value={skills}
		/>

		Options can also have a separate value and label:
		<MultiSelect options={[{ value: 'ru', label: 'Russian' }, { value: 'en', label: 'English' }]} bind:value={langs} />

		Options with a second line, and a short summary in the box instead of tags
		(Figma "select", the multi variant: "5 chosen"):
		<MultiSelect
			options={[{ value: 'atlas', label: 'Atlas', subtitle: 'Identity platform' }, …]}
			summary="{projects.length} chosen"
			bind:value={projects}
		/>

	Props:
		value        the chosen values, as a list. Use bind:value to read the choice
		options      the list. Either plain texts, or objects { value, label, subtitle, disabled }.
		             An option with a `subtitle` is drawn as a drop-list row: its label, the
		             subtitle under it, a tick when chosen. The others are checkboxes
		label        text above the box (inside the box when `big`)
		placeholder  grey text shown while nothing is chosen
		hint         small help text under the box
		error        error message under the box. When set, the field turns red
		icon         icon name at the start of the box (optional)
		summary      text shown in the box INSTEAD of the tags, e.g. "5 chosen" (optional).
		             Only while something is chosen; with nothing chosen the placeholder shows
		max          the most options that can be chosen (optional). Once reached, the other
		             options cannot be ticked, and a "2 / 3" counter shows under the box
		big          true = tall version (Figma "compact = False"). Default false
		disabled     true = cannot be changed

	How it behaves:
		- a click on the box opens the list; a click anywhere else, or Esc, closes it
		- ticking a row adds a tag, unticking removes it; the list stays open
		  (options with a subtitle: clicking the row adds or removes its tick)
		- with many tags the box grows taller, the tags wrap to new lines

	The look of the box lives in ../field/field.css (shared with TextInput and Select);
	what is special here lives in ./multi-select.css.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import Tag from '../tag/Tag.svelte';
	import Menu from '../menu/Menu.svelte';
	import MenuItem from '../menu/MenuItem.svelte';
	import Checkbox from '../checkbox/Checkbox.svelte';
	import '../field/field.css';
	import './multi-select.css';

	let {
		value = $bindable([]),
		options = [],
		label = '',
		placeholder = '',
		hint = '',
		error = '',
		icon = '',
		summary = '',
		max = 0,
		big = false,
		disabled = false,
		class: extraClass = ''
	} = $props();

	let open = $state(false);

	// Accept both 'Text' and { value, label }: turn everything into { value, label }.
	let items = $derived(
		options.map((option) =>
			typeof option === 'string' ? { value: option, label: option } : option
		)
	);

	// The chosen options, in the order of the list (not in the order they were ticked).
	let chosen = $derived(items.filter((item) => value.includes(item.value)));

	let tip = $derived(error || hint);
	let counter = $derived(max ? `${value.length} / ${max}` : '');

	// With `max` reached, only the chosen options can still be clicked (to untick them).
	function isLocked(item) {
		return max > 0 && value.length >= max && !value.includes(item.value);
	}

	// Tick or untick one option.
	function toggle(item) {
		value = value.includes(item.value)
			? value.filter((other) => other !== item.value)
			: [...value, item.value];
	}
</script>

<!-- A click anywhere else, or Esc, closes the list. -->
<svelte:window
	onclick={() => (open = false)}
	onkeydown={(event) => {
		if (event.key === 'Escape') open = false;
	}}
/>

<!-- The tags (or the summary), or the placeholder while nothing is chosen. Used in both sizes below. -->
{#snippet content()}
	<span class="hb-multi-select__tags">
		{#if summary && chosen.length}
			<span class="hb-multi-select__summary">{summary}</span>
		{:else}
			{#each chosen as item}
				<Tag {disabled}>{item.label}</Tag>
			{:else}
				<span class="hb-multi-select__placeholder">{placeholder}</span>
			{/each}
		{/if}
	</span>
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
	class="hb-field hb-multi-select {extraClass}"
	class:hb-field--big={big}
	class:hb-field--error={error}
	class:hb-field--disabled={disabled}
	class:hb-multi-select--open={open}
	onclick={(event) => event.stopPropagation()}
>
	{#if label && !big}<span class="hb-field__label">{label}</span>{/if}

	<!-- The box is a button: click it (or press Enter on it) to open the list. -->
	<button
		type="button"
		class="hb-field__body"
		aria-haspopup="listbox"
		aria-expanded={open}
		{disabled}
		onclick={() => (open = !open)}
	>
		{#if icon}<Icon name={icon} size={20} />{/if}

		{#if big}
			<!-- Big version: label and tags stacked inside the box. -->
			<span class="hb-field__stack">
				{#if label}<span class="hb-field__label">{label}</span>{/if}
				{@render content()}
			</span>
		{:else}
			{@render content()}
		{/if}

		<Icon name="chevron-down" size={20} class="hb-field__chevron" />
	</button>

	<!-- The list: one row per option — a checkbox, or a drop-list row when it has a subtitle. -->
	{#if open}
		<div class="hb-multi-select__list">
			<Menu label={label || placeholder}>
				{#each items as item}
					{#if item.subtitle}
						<!-- With a second line: a drop-list row, with a tick when chosen. -->
						<MenuItem
							subtitle={item.subtitle}
							checked={value.includes(item.value)}
							disabled={item.disabled || isLocked(item)}
							onclick={() => toggle(item)}>{item.label}</MenuItem
						>
					{:else}
						<Checkbox
							checked={value.includes(item.value)}
							disabled={item.disabled || isLocked(item)}
							onchange={() => toggle(item)}>{item.label}</Checkbox
						>
					{/if}
				{/each}
			</Menu>
		</div>
	{/if}

	{#if tip || counter}
		<span class="hb-field__tips">
			<span>{tip}</span>
			<span>{counter}</span>
		</span>
	{/if}
</div>
