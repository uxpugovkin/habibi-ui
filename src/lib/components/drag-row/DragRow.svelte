<!--
	DRAG ROW
	One row of a list the person can put in their own order — e.g. the columns in
	table settings: a grip to drag it by, its name, and a show / hide switch.

	Figma:  habibi-library → "drag-row"

	Use:
		<DragRow label="Status" bind:visible={column.visible} />
		<DragRow label="Status" bind:visible={column.visible} hideDisabled />   ← cannot be hidden now

		Dragging is up to the page (rows do not move by themselves). Anything else you
		give the row goes onto it, so the page can add the browser's drag events:
		<DragRow
			label="Status"
			bind:visible={column.visible}
			draggable="true"
			dragging={draggedKey === 'status'}
			ondragstart={…}
			ondragover={…}
			ondragend={…}
		/>

	Props:
		label          the name of the row
		visible        true = shown. Use bind:visible to read the switch
		hideDisabled   true = the "hide" segment cannot be picked (e.g. too few would be left)
		showLabel      hint and screen-reader name of the "show" segment.  Default "Show"
		hideLabel      hint and screen-reader name of the "hide" segment.  Default "Hide"
		dragging       true = this is the row being dragged right now (it turns lighter)
		…anything else (draggable, ondragstart, …) is passed straight to the row

	The look lives in drag-row.css.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import Segmented from '../segmented/Segmented.svelte';
	import './drag-row.css';

	let {
		label = '',
		visible = $bindable(true),
		hideDisabled = false,
		showLabel = 'Show',
		hideLabel = 'Hide',
		dragging = false,
		class: extraClass = '',
		...rest
	} = $props();

	// The switch speaks "shown" / "hidden"; the row speaks true / false.
	function getChoice() {
		return visible ? 'shown' : 'hidden';
	}
	function setChoice(choice) {
		visible = choice === 'shown';
	}
</script>

<div class="hb-drag-row {extraClass}" class:hb-drag-row--dragging={dragging} {...rest}>
	<span class="hb-drag-row__grip"><Icon name="move" size={24} /></span>
	<span class="hb-drag-row__label">{label}</span>
	<Segmented
		iconOnly
		bind:value={getChoice, setChoice}
		options={[
			{ value: 'shown', label: showLabel, icon: 'visibility-on' },
			{ value: 'hidden', label: hideLabel, icon: 'visibility-off', disabled: hideDisabled }
		]}
	/>
</div>
