<!--
	ATTRIBUTE ROW — one attribute on the user page: its title, its value, and a tag
	when it was changed ("Not saved") or the change is wrong ("Error").

	Figma:  sbertech-habibi → page "abac-r5" → local components "row" (state × status),
	        "content" (multi · array · plain · empty), "text" and "attr-multi" (hover = pencil)

	Use:
		<AttributeRow {attribute} value={…} status="not-saved" onedit={…}>
			{#snippet card()}<EditCard … />{/snippet}
		</AttributeRow>

	Props:
		attribute   one attribute from data.js: { title, type, options, … }
		value       the value to show (the changed one, if it was changed)
		status      "default" | "not-saved" | "error"
		open        true = its edit card is open (the row keeps its hover colour)
		onedit      called when the value is clicked
		card        snippet: the edit card, drawn under the row while `open`

	How the value is drawn depends on the datatype (see data.js):
		text, date   the text
		enum         the label of the chosen option
		array        the texts, with dots between them
		multi        small cards: the label and a second line
		empty        "—"
	The whole value is ONE button with ONE pencil at its end (also for arrays and multi):
	on hover of the row the pencil slides in, a click opens the edit card.
	Hovers fade in 0.3s, like the Figma prototype.
-->
<script>
	import { Icon, Tag } from '#lib';
	import { isEmpty, optionOf } from './data.js';

	let { attribute, value, status = 'default', open = false, onedit, card } = $props();

	function edit(event) {
		event.stopPropagation(); // the page closes open cards on any click; not this one
		onedit?.();
	}
</script>

<div class="row row--{status}" class:row--open={open} role="group" aria-label={attribute.title}>
	<span class="row__title hb-text-body-c">{attribute.title}</span>

	<button type="button" class="value" aria-label="Edit {attribute.title}" onclick={edit}>
		<!-- Small cards (multi) sit 4px apart; texts with dots between them, 12px. -->
		<span
			class="value__pieces hb-text-body-c"
			class:value__pieces--cards={attribute.type === 'multi'}
		>
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

	<!-- The tag sits at the far end of the row. -->
	<span class="row__end">
		{#if status === 'not-saved'}
			<Tag colour="warning">Not saved</Tag>
		{:else if status === 'error'}
			<Tag colour="error">Error</Tag>
		{/if}
	</span>

	{#if open}{@render card?.()}{/if}
</div>

<style>
	/* Figma "row": 40px at least, the title 200px wide, the value takes the rest.
	   Every colour change fades in 0.3s ("Dissolve, ease out" in the Figma prototype). */
	.row {
		position: relative; /* the edit card is placed under it */
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 40px;
		padding: 4px 8px;
		border-radius: var(--radius-s);
		transition: background-color 0.3s ease-out;
	}
	.row__title {
		flex: none;
		width: 200px;
		color: var(--uncolorful-grey-tertiary);
		transition: color 0.3s ease-out;
	}
	.row__end {
		margin-inline-start: auto;
	}

	/* ---------- Hover (and while its edit card is open) ---------- */
	.row--default:hover,
	.row--default.row--open {
		background: var(--boring-blue-90);
	}
	.row--default:hover .row__title,
	.row--default.row--open .row__title {
		color: var(--boring-blue-60);
	}

	/* ---------- Changed, not saved yet: orange ---------- */
	.row--not-saved {
		background: var(--shitpile-orange-90);
	}
	.row--not-saved:hover,
	.row--not-saved.row--open {
		background: var(--shitpile-orange-80);
	}

	/* ---------- The change is wrong: red (the title stays orange, as in Figma) ---------- */
	.row--error {
		background: var(--traffic-light-red-90);
	}
	.row--error:hover,
	.row--error.row--open {
		background: var(--traffic-light-red-80);
	}
	.row--not-saved .row__title,
	.row--error .row__title {
		color: var(--shitpile-orange-50);
	}

	/* ---------- The value: one button ---------- */
	.value {
		display: inline-flex;
		align-items: center;
		min-width: 0;
		padding: 0;
		border: 0;
		background: none;
		color: var(--uncolorful-grey-primary);
		font: inherit;
		text-align: start;
		cursor: pointer;
	}
	.value__pieces {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px 12px;
	}
	.value__pieces--cards {
		gap: 4px;
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

	/* The pencil is there but has no room until the row is hovered (or the value focused);
	   then it slides in ("Smart animate, ease out, 0.3s" in Figma). */
	.value__pencil {
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
	.row:hover .value__pencil,
	.row--open .value__pencil,
	.value:focus-visible .value__pencil {
		width: 16px;
		margin-inline-start: 6px;
		opacity: 1;
	}
</style>
