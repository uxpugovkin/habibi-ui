/*
	PROTOTYPE STATE — what the little "Prototype states" panel switches.
	Every screen of the edit-attributes prototype reads it, so one click changes them all.

	Use:
		import { proto, notify, notBuilt } from './prototype.svelte.js';
		{#if proto.data === 'loading'} … {/if}
		notify('Changes saved', 'success');    ← a short message at the bottom of the screen
		notBuilt('Search');                    ← "Search is not part of this prototype"

	proto.data    what the server "answered" when the page opened:  "ready" | "loading" | "error"
	proto.save    what the server "answers" to Save:  "success" | "failure"
	proto.theme   "light" | "dark" | "olive" | "olive-night".  Figma draws ABAC in olive
	proto.rtl     true = right-to-left
	proto.toast   the message on screen now: { text, type } or null
*/

export const proto = $state({
	data: 'ready',
	save: 'success',
	theme: 'olive',
	rtl: false,
	toast: null
});

let timer;

/** Shows a short message for 3 seconds. `type` is a Notification type. */
export function notify(text, type = 'info') {
	clearTimeout(timer);
	proto.toast = { text, type };
	timer = setTimeout(() => (proto.toast = null), 3000);
}

/** Says that something is drawn but not built, e.g. notBuilt('Search'). */
export function notBuilt(what) {
	notify(`${what} is not part of this prototype`);
}
