<!--
	JSON TEXT — one line (or a piece) of JSON with its colours:
	keys orange, numbers / true / false / null purple, brackets and commas grey.

	Figma:  sbertech-habibi → page "abac-r5" → "read-json" (the code area)
	Copied from the ABAC prototype (src/routes/abac-to-be).

	Use:
		<JsonText text={'  "status": "active",'} />

	Props:
		text   the JSON text
-->
<script>
	import { colourLine } from './data.js';

	let { text = '' } = $props();
</script>

{#each colourLine(text) as piece}<span class="json-{piece.kind}">{piece.text}</span>{/each}

<style>
	.json-key {
		color: var(--shitpile-orange-50);
	}
	.json-value {
		color: var(--uncreative-green-50);
	}
	.json-mark {
		color: var(--uncolorful-grey-tertiary);
	}
</style>
