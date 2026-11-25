<!--
	TAG INPUT
	A box to type several short texts into. Each one becomes a tag in the box;
	the × on a tag removes it.

	Figma:  habibi-library → page "input" → "combobox" (filled: tags in the box)

	Use:
		<TagInput label="Languages" placeholder="Type and press Enter" bind:value={languages} />

	Props:
		value        the texts, as a list. Use bind:value to read them
		label        text above the box
		placeholder  grey text in the box while nothing is typed
		hint         small help text under the box
		error        error message under the box. When set, the field turns red
		disabled     true = cannot be changed

	How it behaves:
		- Enter (or a comma) turns what is typed into a tag; leaving the box does too
		- the same text twice is added once
		- Backspace in an empty box removes the last tag
		- with many tags the box grows taller, the tags wrap to new lines

	The look of the box lives in ../field/field.css (shared with TextInput and Select);
	what is special here lives in ./tag-input.css.
-->
<script>
	import Tag from '../tag/Tag.svelte';
	import '../field/field.css';
	import './tag-input.css';

	let {
		value = $bindable([]),
		label = '',
		placeholder = '',
		hint = '',
		error = '',
		disabled = false,
		class: extraClass = ''
	} = $props();

	let typed = $state(''); // what is in the box now, not a tag yet
	let input;

	// Turns what is typed into a tag.
	function add() {
		const text = typed.trim();
		if (text && !value.includes(text)) value = [...value, text];
		typed = '';
	}

	function remove(text) {
		value = value.filter((other) => other !== text);
	}

	function onkeydown(event) {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			add();
		}
		if (event.key === 'Backspace' && typed === '' && value.length) {
			value = value.slice(0, -1);
		}
	}
</script>

<!-- A <div>, not a <label>: a label would pass its clicks to the first × inside it. -->
<div
	class="hb-field hb-tag-input {extraClass}"
	class:hb-field--error={error}
	class:hb-field--disabled={disabled}
>
	{#if label}<span class="hb-field__label">{label}</span>{/if}

	<!-- A click anywhere in the box puts the cursor in it. -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<span class="hb-field__body" onclick={() => input.focus()}>
		{#each value as text (text)}
			<Tag {disabled} onremove={() => remove(text)} removeLabel="Remove {text}">{text}</Tag>
		{/each}
		<input
			class="hb-field__input"
			bind:this={input}
			bind:value={typed}
			aria-label={label || placeholder}
			placeholder={value.length ? '' : placeholder}
			{disabled}
			{onkeydown}
			onblur={add}
		/>
	</span>

	{#if error || hint}
		<span class="hb-field__tips"><span>{error || hint}</span></span>
	{/if}
</div>
