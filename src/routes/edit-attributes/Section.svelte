<!--
	SECTION — the white card of the user page: a title, then what it holds.
	Groups of attributes and tables use the same card, so they line up.

	Figma:  sbertech-habibi → page "abac-r5" → "Section" (3262:5366) and "Example" (3279:19192)

	Use:
		<Section title="Personal">…rows…</Section>
		<Section title="Access grants" gap={12}>…toolbar and table…</Section>
		<Section>…a table without a title…</Section>

	Props:
		title   the name of the group or table (optional)
		gap     px between the title and the parts below it.  Default 0 (rows touch)
		…anything else (aria-busy, …) goes to the <section>

	The spaces of the whole page follow from here:
		card     8px above and below, nothing at the sides — rows run edge to edge
		title    4px above and below, 12px at the sides
		rows     12px at the sides (AttributeRow, and the table cells), so every title,
		         value and cell starts 12px from the edge of the card
-->
<script>
	let { title = '', gap = 0, children, ...rest } = $props();
</script>

<section class="section" style:gap="{gap}px" {...rest}>
	{#if title}<h2 class="section__title hb-text-body-a-bold">{title}</h2>{/if}
	{@render children?.()}
</section>

<style>
	.section {
		display: flex;
		flex-direction: column;
		padding: 8px 0;
		border-radius: var(--radius-s);
		background: var(--uncolorful-grey-surface);
	}
	.section__title {
		margin: 0;
		padding: 4px 12px;
		color: var(--uncolorful-grey-extra);
	}
</style>
