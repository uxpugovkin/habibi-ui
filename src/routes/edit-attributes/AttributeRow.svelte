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
		onedit      called when a value is clicked
		card        snippet: the edit card, drawn under the row while `open`

	How the value is drawn depends on the datatype (see data.js):
		text, date   the text
		enum         the label of the chosen option
		array        the labels, with dots between them
		multi        small cards: the label and a second line
		empty        "—"
	Every piece of the value is a button: on hover a pencil slides in next to it,
	a click opens the edit card. Hovers fade in 0.3s, like the Figma prototype.
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

<!-- One clickable piece of the value. `title` + `subtitle` = a small card (multi);
     `empty` = the grey "—" of an empty value. -->
{#snippet piece(title, subtitle = '', empty = false)}
	<button
		type="button"
		class="piece"
		class:piece--card={subtitle}
		class:piece--empty={empty}
		aria-label="Edit {attribute.title}: {title}"
		onclick={edit}
	>
		<span class="piece__text">
			<span class="hb-text-body-c">{title}</span>
			{#if subtitle}<span class="hb-text-body-d piece__subtitle">{subtitle}</span>{/if}
		</span>
		<span class="piece__pencil"><Icon name="edit" size={16} /></span>
	</button>
{/snippet}

<div class="row row--{status}" class:row--open={open} role="group" aria-label={attribute.title}>
	<span class="row__title hb-text-body-c">{attribute.title}</span>

	<!-- Small cards (multi) sit 4px apart; texts with dots between them, 12px. -->
	<span class="row__value" class:row__value--cards={attribute.type === 'multi'}>
		{#if isEmpty(value)}
			{@render piece('—', '', true)}
		{:else if attribute.type === 'enum'}
			{@render piece(optionOf(attribute, value)?.label ?? value)}
		{:else if attribute.type === 'array'}
			{#each value as item, index}
				{#if index > 0}<span class="row__dot" aria-hidden="true">•</span>{/if}
				{@render piece(optionOf(attribute, item)?.label ?? item)}
			{/each}
		{:else if attribute.type === 'multi'}
			{#each value as item}
				{@const option = optionOf(attribute, item)}
				{@render piece(option?.label ?? item, option?.subtitle ?? '')}
			{/each}
		{:else}
			{@render piece(value)}
		{/if}
	</span>

	{#if status === 'not-saved'}
		<Tag colour="warning">Not saved</Tag>
	{:else if status === 'error'}
		<Tag colour="error">Error</Tag>
	{/if}

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
	.row__value {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px 12px;
	}
	.row__value--cards {
		gap: 4px;
	}
	.row__dot {
		color: var(--uncolorful-grey-tertiary);
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

	/* ---------- One piece of the value ---------- */
	.piece {
		display: inline-flex;
		align-items: center;
		padding: 0;
		border: 0;
		border-radius: var(--radius-s);
		background: none;
		color: var(--uncolorful-grey-primary);
		font: inherit;
		text-align: start;
		cursor: pointer;
	}
	.piece__text {
		display: flex;
		flex-direction: column;
	}
	.piece__subtitle {
		color: var(--uncolorful-grey-secondary);
	}
	/* "multi": a small grey card. */
	.piece--card {
		padding: 4px 8px;
		background: var(--uncolorful-grey-background);
	}
	.piece--empty {
		color: var(--uncolorful-grey-tertiary);
	}

	/* The pencil is there but has no room until the piece is hovered or focused;
	   then it slides in ("Smart animate, ease out, 0.3s" in Figma). */
	.piece__pencil {
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
	.piece:hover .piece__pencil,
	.piece:focus-visible .piece__pencil {
		width: 16px;
		margin-inline-start: 4px;
		opacity: 1;
	}
	.piece--card:hover .piece__pencil,
	.piece--card:focus-visible .piece__pencil {
		margin-inline-start: 6px;
	}
</style>
