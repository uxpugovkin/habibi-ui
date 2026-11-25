<!--
	VALUE — the value of one attribute (or one table cell), drawn by its datatype, as ONE
	button with ONE pencil at its end. A click on it opens the edit card.

	Figma:  sbertech-habibi → page "abac-r5" → local components "content"
	        (multi · array · plain · empty), "text", "array", "array-multi" (hover = pencil)

	Use:
		<Value {attribute} value={…} onedit={…} />

	Props:
		attribute   one attribute from data.js (or a cell: see cellOf)
		value       the value to show
		open        true = its edit card is open: the pencil stays
		onedit      called when the value is clicked

	How the value is drawn depends on the datatype (see data.js):
		text, date   the text
		enum         the label of the chosen option
		array        the texts, with dots between them
		multi        small cards: the label and a second line
		empty        "—"

	The pencil slides in when the value is hovered or focused — or when anything around it
	with the class "edit-host" is hovered (the attribute row uses that: hover anywhere on
	the row). "Smart animate, ease out, 0.3s", like the Figma prototype.
-->
<script>
	import { Icon } from '#lib';
	import { isEmpty, optionOf } from './data.js';

	let { attribute, value, open = false, onedit } = $props();

	function edit(event) {
		event.stopPropagation(); // the page closes open cards on any click; not this one
		onedit?.(event);
	}
</script>

<button
	type="button"
	class="value"
	class:value--open={open}
	aria-label="Edit {attribute.title}"
	onclick={edit}
>
	<!-- Values, dots, small cards and the pencil: all 6px apart (Figma "array", "array-multi"). -->
	<span class="value__pieces hb-text-body-c">
		{#if isEmpty(value)}
			<span class="value__empty">—</span>
		{:else if attribute.type === 'enum'}
			{optionOf(attribute, value)?.label ?? value}
		{:else if attribute.type === 'array'}
			{#each value as text, index}
				{#if index > 0}<span class="value__dot" aria-hidden="true">•</span>{/if}
				<span>{text}</span>
			{/each}
		{:else if attribute.type === 'multi'}
			{#each value as item}
				{@const option = optionOf(attribute, item)}
				<span class="value__card">
					<span>{option?.label ?? item}</span>
					<span class="hb-text-body-d value__subtitle">{option?.subtitle}</span>
				</span>
			{/each}
		{:else}
			{value}
		{/if}
	</span>
	<span class="value__pencil"><Icon name="edit" size={16} /></span>
</button>

<style>
	.value {
		display: inline-flex;
		align-items: center;
		max-width: 100%;
		padding: 0;
		border: 0;
		background: none;
		color: var(--uncolorful-grey-primary);
		font: inherit;
		text-align: start;
		cursor: pointer;
	}
	.value__pieces {
		min-width: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
	}
	.value__dot,
	.value__empty {
		color: var(--uncolorful-grey-tertiary);
	}
	/* "multi": a small grey card. */
	.value__card {
		display: flex;
		flex-direction: column;
		padding: 4px 8px;
		border-radius: var(--radius-s);
		background: var(--uncolorful-grey-background);
	}
	.value__subtitle {
		color: var(--uncolorful-grey-secondary);
	}

	/* The pencil is there but has no room until it is needed; then it slides in. */
	.value__pencil {
		flex: none;
		display: inline-flex;
		width: 0;
		margin-inline-start: 0;
		overflow: hidden;
		opacity: 0;
		color: var(--uncolorful-grey-secondary);
		transition:
			width 0.3s ease-out,
			margin 0.3s ease-out,
			opacity 0.3s ease-out;
	}
	.value:hover .value__pencil,
	.value:focus-visible .value__pencil,
	.value--open .value__pencil,
	:global(.edit-host:hover) .value__pencil {
		width: 16px;
		margin-inline-start: 6px;
		opacity: 1;
	}
</style>
