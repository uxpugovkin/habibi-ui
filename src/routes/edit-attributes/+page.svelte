<!--
	EDIT ATTRIBUTES PROTOTYPE  —  /edit-attributes
	The user page of the ABAC service, where every attribute can be changed in place:
	a pencil on hover, a small edit card for each datatype, "Not saved" rows, Save / Discard.

	Figma:  sbertech-habibi → page "abac-r5" → "1-0-abtract", "EDIT-form", "3-0-unsaved-changes"
	        https://www.figma.com/design/OKwPuNTKnQ3p99F03r9MyG/sbertech-habibi?node-id=0-1

	The pieces (all in this folder):
		UserPage.svelte        the page: header, toolbar, attribute groups, Save / Discard
		AttributeRow.svelte    one attribute: title, value (each datatype drawn its own way), status
		EditCard.svelte        the card that edits one value: a field per datatype
		JsonCode.svelte        the attributes as code (the "JSON" switch)
		JsonText.svelte        JSON with its colours
		Sidebar.svelte         the side menu of the service
		Breadcrumbs.svelte     the "where am I" line above the title
		DomainPicker.svelte    the list of domains (breadcrumbs, side menu)
		StatePanel.svelte      the tiny panel that switches states, themes and direction
		prototype.svelte.js    what that panel switches (`proto`)
		data.js                the made-up user, the attributes and their datatypes
	Sidebar, Breadcrumbs, DomainPicker and the JSON pieces are copies from /abac-to-be.

	Only one user and only their page: the rest of ABAC says it is not part of the prototype.
	Everything is built from the design system (#lib); nothing here fetches data.
-->
<script>
	import { Notification } from '#lib';
	import { proto } from './prototype.svelte.js';
	import Sidebar from './Sidebar.svelte';
	import UserPage from './UserPage.svelte';
	import StatePanel from './StatePanel.svelte';

	// Theme and direction go onto <html>, so every component follows (see the README).
	// When the person leaves the prototype, the site gets its own look back.
	$effect(() => {
		const html = document.documentElement;
		html.dataset.theme = proto.theme;
		html.dir = proto.rtl ? 'rtl' : 'ltr';
		return () => {
			delete html.dataset.theme;
			html.removeAttribute('dir');
		};
	});
</script>

<svelte:head>
	<title>ABAC · Edit attributes — Habibi UI prototype</title>
</svelte:head>

<div class="app">
	<Sidebar />

	<!-- The page and, under it, the Save bar (it sticks to the bottom while the page scrolls). -->
	<main class="page hb-scroll">
		<UserPage />
	</main>
</div>

{#if proto.toast}
	<div class="toast"><Notification type={proto.toast.type}>{proto.toast.text}</Notification></div>
{/if}

<StatePanel />

<style>
	/* The service fills the window: the side menu stays, the page next to it scrolls. */
	.app {
		display: flex;
		height: 100vh;
	}
	.page {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		overflow: auto;
		/* Room for the up-down scrollbar is kept even when a filter leaves few rows,
		   so the page does not jump sideways (same as /abac-to-be). */
		scrollbar-gutter: stable;
		/* That room is 20px (the design system's scrollbar), so the screen keeps only 4px
		   of its own at the far side: 4 + 20 = the same 24px as at the start side. */
		--screen-end: 4px;
		--table-surface: var(--uncolorful-grey-surface);
	}
	/* Firefox draws a thin scrollbar of its own (about 12px), so more padding is kept there. */
	@supports not selector(::-webkit-scrollbar) {
		.page {
			--screen-end: 12px;
		}
	}
	/* Short messages: bottom centre, above everything. */
	.toast {
		position: fixed;
		bottom: 16px;
		left: 50%;
		z-index: 90;
		transform: translateX(-50%);
	}
</style>
