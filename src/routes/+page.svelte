<!--
	HOME PAGE — a simple list of what lives in this repo.
	When you add a prototype folder under src/routes, add a link to it here.
-->
<script>
	import { resolve } from '$app/paths';
	import { Icon } from '#lib';
</script>

<main class="home">
	<h1 class="hb-text-h1">Habibi UI</h1>
	<p class="hb-text-body-b">
		The design system, moved from Figma into code — and the prototypes built with it.
	</p>

	<a class="home__card" href={resolve('/ds')}>
		<Icon name="view-grid" />
		<span>
			<strong class="hb-text-body-b-bold">Design system</strong>
			<span class="hb-text-body-c">Colours, type, icons and every component, in all themes.</span>
		</span>
		<Icon name="arrow-right" />
	</a>

	<!-- Prototypes: one card per folder in src/routes. -->
	<a class="home__card" href={resolve('/abac-as-is')}>
		<Icon name="group" />
		<span>
			<strong class="hb-text-body-b-bold">ABAC · Users, as is</strong>
			<span class="hb-text-body-c"
				>The users of a domain as designed today: list, user page, history, JSON and comparisons.</span
			>
		</span>
		<Icon name="arrow-right" />
	</a>
	<a class="home__card" href={resolve('/abac-to-be')}>
		<Icon name="group" />
		<span>
			<strong class="hb-text-body-b-bold">ABAC · Users, to be</strong>
			<span class="hb-text-body-c"
				>Proposed changes: the user page shows JSON in place, “Compare” opens the comparison.</span
			>
		</span>
		<Icon name="arrow-right" />
	</a>
	<a class="home__card" href={resolve('/rego-playground')}>
		<Icon name="script" />
		<span>
			<strong class="hb-text-body-b-bold">Flow Designer · Rego playground</strong>
			<span class="hb-text-body-c"
				>Run a policy against an input and see the decision, or run its tests and read the problems.</span
			>
		</span>
		<Icon name="arrow-right" />
	</a>
	<a class="home__card" href={resolve('/edit-attributes')}>
		<Icon name="edit" />
		<span>
			<strong class="hb-text-body-b-bold">ABAC · Edit attributes</strong>
			<span class="hb-text-body-c"
				>Change a user's attributes in place: an edit card for every datatype, then Save or Discard.</span
			>
		</span>
		<Icon name="arrow-right" />
	</a>
</main>

<style>
	.home {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 560px;
		margin: 0 auto;
		padding: 64px 24px;
	}
	.home p {
		margin: 0;
		color: var(--uncolorful-grey-secondary);
	}
	.home__card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
		color: var(--uncolorful-grey-primary);
		text-decoration: none;
	}
	.home__card:hover {
		background: var(--boring-blue-90);
	}
	.home__card > span {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
