<!--
	EDIT CARD — the small white card that opens under an attribute to change its value.
	The field inside depends on the datatype of the attribute:

		text    TextInput, with a "12 / 60" counter when the text has a limit
		date    TextInput with a calendar icon, written as DD.MM.YYYY
		enum    Select: pick one
		array   MultiSelect: pick several, shown as tags
		multi   MultiSelect: pick several, each with a second line; the box says "3 chosen"

	Figma:  sbertech-habibi → page "abac-r5" → "EDIT-form"
	        (for-text · for-arrays · for-enums · for-dates · for-multi; default, focus, filled)

	Use:
		<EditCard {attribute} bind:value problem="Write the date as DD.MM.YYYY" onclose={…} />

	Props:
		attribute   one attribute from data.js
		value       the value being edited. Use bind:value: it changes while the person types
		problem     what is wrong with the value ('' = nothing). Shown red under the field
		onclose     called with `true` to undo (Esc), with `false` to keep the value (Enter)

	The card only edits; the page decides what a change means ("Not saved", "Error").
	A click outside the card is handled by the page (it keeps the value, like Enter).
	It slides in 0.3s, ease out — the timing of every animation in the Figma prototype.
-->
<script>
	import { TextInput, Select, MultiSelect } from '#lib';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { attribute, value = $bindable(), problem = '', onclose } = $props();

	let card;

	// The field takes the keyboard as soon as the card opens.
	$effect(() => {
		card.querySelector('input, select, button')?.focus();
	});

	function onkeydown(event) {
		if (event.key === 'Escape') onclose?.(true);
		// Enter keeps the value. (In the lists Enter ticks an option instead.)
		if (event.key === 'Enter' && event.target.tagName === 'INPUT') onclose?.(false);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="card"
	role="dialog"
	tabindex="-1"
	aria-label="Edit {attribute.title}"
	bind:this={card}
	onclick={(event) => event.stopPropagation()}
	{onkeydown}
	transition:fly={{ y: -4, duration: 300, easing: cubicOut }}
>
	{#if attribute.type === 'text'}
		<TextInput
			label={attribute.title}
			placeholder="Not set"
			maxlength={attribute.maxlength}
			error={problem}
			bind:value
		/>
	{:else if attribute.type === 'date'}
		<TextInput
			label={attribute.title}
			placeholder="DD.MM.YYYY"
			iconEnd="calendar"
			inputmode="numeric"
			error={problem}
			bind:value
		/>
	{:else if attribute.type === 'enum'}
		<Select
			label={attribute.title}
			placeholder="Choose…"
			options={attribute.options}
			error={problem}
			bind:value
		/>
	{:else if attribute.type === 'array'}
		<MultiSelect
			label={attribute.title}
			placeholder="Choose…"
			options={attribute.options}
			error={problem}
			bind:value
		/>
	{:else if attribute.type === 'multi'}
		<MultiSelect
			label={attribute.title}
			placeholder="Choose…"
			options={attribute.options}
			summary="{value.length} chosen"
			error={problem}
			bind:value
		/>
	{/if}
</div>

<style>
	/* Figma "for-…": 272px, white, a 1px line and 12px inside. No cast shadow.
	   It hangs under the row, starting where the value starts (8 + 200 + 8). */
	.card {
		position: absolute;
		top: calc(100% + 4px);
		inset-inline-start: 216px;
		z-index: 30;
		width: 272px;
		padding: 12px;
		border: 1px solid var(--uncolorful-grey-border);
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
	}
	.card:focus {
		outline: none;
	}
</style>
