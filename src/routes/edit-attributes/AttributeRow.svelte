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

	The value itself (drawn by its datatype, one pencil) is Value.svelte.
	Hover anywhere on the row and the pencil slides in. Hovers fade in 0.3s, like Figma.
-->
<script>
	import { Tag } from '#lib';
	import Value from './Value.svelte';

	let { attribute, value, status = 'default', open = false, onedit, card } = $props();
</script>

<!-- "edit-host": hovering anywhere on the row shows the pencil of its value. -->
<div
	class="row edit-host row--{status}"
	class:row--open={open}
	role="group"
	aria-label={attribute.title}
>
	<span class="row__title hb-text-body-c">{attribute.title}</span>

	<span class="row__value"><Value {attribute} {value} {open} {onedit} /></span>

	<!-- The tag sits at the far end of the row. -->
	<span class="row__end">
		{#if status === 'not-saved'}
			<Tag colour="warning">Not saved</Tag>
		{:else if status === 'error'}
			<Tag colour="error">Error</Tag>
		{/if}
	</span>

	<!-- The edit card hangs under the row, starting where the value starts. -->
	{#if open}<div class="row__card">{@render card?.()}</div>{/if}
</div>

<style>
	/* Figma "row": 40px at least, 4px above and below, 12px at the sides, 8px between
	   the parts; the title 200px wide, the value takes the rest.
	   Every colour change fades in 0.3s ("Dissolve, ease out" in the Figma prototype). */
	.row {
		position: relative; /* the edit card is placed under it */
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 40px;
		padding: 4px 12px;
		border-radius: var(--radius-s);
		transition: background-color 0.3s ease-out;
	}
	/* The title is primary (dark) in every state. */
	.row__title {
		flex: none;
		width: 200px;
		color: var(--uncolorful-grey-primary);
	}
	.row__end {
		margin-inline-start: auto;
	}

	/* ---------- Hover (and while its edit card is open) ---------- */
	.row--default:hover,
	.row--default.row--open {
		background: var(--boring-blue-90);
	}

	/* ---------- Changed, not saved yet: orange ---------- */
	.row--not-saved {
		background: var(--shitpile-orange-90);
	}
	.row--not-saved:hover,
	.row--not-saved.row--open {
		background: var(--shitpile-orange-80);
	}

	/* ---------- The change is wrong: red ---------- */
	.row--error {
		background: var(--traffic-light-red-90);
	}
	.row--error:hover,
	.row--error.row--open {
		background: var(--traffic-light-red-80);
	}
	/* Changed or wrong: a 2px line at the start of the row (the corners stay round),
	   and 10px of padding instead of 12, so the text does not move. */
	.row--not-saved,
	.row--error {
		padding-inline-start: 10px;
		border-inline-start: 2px solid var(--shitpile-orange-50);
	}
	.row--error {
		border-inline-start-color: var(--traffic-light-red-50);
	}

	.row__value {
		min-width: 0;
	}
	/* 12 + 200 + 8: under the value, not under the title. */
	.row__card {
		position: absolute;
		top: calc(100% + 4px);
		inset-inline-start: 220px;
		z-index: 30;
	}
</style>
