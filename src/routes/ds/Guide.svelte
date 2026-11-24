<!--
	GUIDE — the layout of a guidelines page (/ds/tables, /ds/table-settings).
	For every chapter a dark banner, then its rules; under each rule, its live example.

	Use:
		<Guide chapters={tableGuidelines} {exampleFor} />

	Props:
		chapters     the rules: [{ title, about, rules: [{ id, title, text, code }] }]
		             (they live next to their component, e.g. src/lib/components/table/guidelines.js)
		exampleFor   rule id → the snippet that shows it, e.g. { 1.2: sorting }.
		             Rules without one have no example

	Rule "1.2" gets the small number "02". The intro rule of a chapter ("1.0") has no
	number and a bigger title.

	When the examples language changes, the guide is made again from scratch,
	so every example starts over with its texts in the new language.
-->
<script>
	import { examples, directionOf } from './examples.svelte.js';

	let { chapters = [], exampleFor = {} } = $props();
</script>

{#key examples.lang}
	<article class="guide">
		{#each chapters as chapter}
			<!-- One chapter = one page of the Figma guide: a dark banner, then its rules. -->
			<section class="chapter">
				<header class="hero">
					<h2 class="hb-text-display-b">{chapter.title}</h2>
					<p class="hb-text-body-b">{chapter.about}</p>
				</header>

				{#each chapter.rules as rule}
					{@const number = rule.id.split('.')[1].padStart(2, '0')}
					{@const isIntro = number === '00'}

					<section class="rule" id="rule-{rule.id}">
						<div class="rule__text">
							{#if !isIntro}<span class="rule__number hb-text-code-s">{number}</span>{/if}
							<h3 class={isIntro ? 'hb-text-h1' : 'hb-text-h3'}>{rule.title}</h3>
							{#each rule.text as line}
								<p class="hb-text-body-b">{line}</p>
							{/each}
							{#if rule.code}
								<p class="rule__code hb-text-body-d">
									<strong>In code:</strong> <code>{rule.code}</code>
								</p>
							{/if}
						</div>

						{#if exampleFor[rule.id]}
							<div class="rule__example" lang={examples.lang} dir={directionOf(examples.lang)}>
								{@render exampleFor[rule.id]()}
							</div>
						{/if}
					</section>
				{/each}
			</section>
		{/each}
	</article>
{/key}

<style>
	/* The sizes below are the ones of the Figma guides:
	   a 1216px column; texts are 760px wide and centred in it; examples use the full width. */
	.guide {
		display: flex;
		flex-direction: column;
		gap: 96px;
		max-width: 1216px;
		margin: 0 auto;
	}
	h2,
	h3,
	p {
		margin: 0;
	}

	/* ---------- Chapter: banner + rules, 72px apart ---------- */
	.chapter {
		display: flex;
		flex-direction: column;
		gap: 72px;
	}
	.hero {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-height: 200px;
		padding: 36px 40px 40px;
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-primary);
		color: var(--uncolorful-grey-surface);
	}

	/* ---------- One rule: its text, then (24px lower) its example ---------- */
	.rule {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		/* When you jump here from a link, leave room for the sticky top bar. */
		scroll-margin-top: 72px;
	}
	.rule__text {
		position: relative; /* the number hangs off its side */
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		max-width: 760px;
	}
	.rule__text h3 {
		color: var(--uncolorful-grey-extra);
	}
	/* The small "01" sits in the margin, in front of the title. */
	.rule__number {
		position: absolute;
		top: 4px;
		inset-inline-end: calc(100% + 8px);
		color: var(--uncolorful-grey-tertiary);
	}
	.rule__code {
		color: var(--uncolorful-grey-secondary);
	}
	.rule__code code {
		font: var(--text-code-s);
	}

	/* The bordered white box around a whole example. */
	.rule__example {
		width: 100%;
		padding: 16px;
		border: 1px solid var(--uncolorful-grey-border);
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-surface);
		overflow: hidden; /* keeps the app-window examples inside the rounded corners */
	}
</style>
