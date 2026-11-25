<!-- DOCS: TextInput, Select, MultiSelect, Checkbox, Radio, Switch, Slider. -->
<script>
	import { TextInput, Select, MultiSelect, Checkbox, Radio, Switch, Slider } from '#lib';
	import Demo from '../Demo.svelte';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	const t = pick(content.forms); // the example texts, in the current language

	// Each example keeps its own value, so you can play with it.
	let name = $state('');
	let search = $state('');
	let login = $state(t.loginValue);
	let comment = $state(t.commentValue);
	let fullName = $state(t.fullNameValue);
	let type = $state('');
	let compareWith = $state(t.emails[0]);
	let skills = $state(['Go', 'API', 'SQL']);
	let offices = $state([]);
	let roles = $state(['admin', 'auditor', 'editor', 'viewer', 'owner']);
	let projects = $state(['atlas', 'kestrel']);

	let agree = $state(true);
	let updates = $state(false);
	let plan = $state('pro');
	let dark = $state(true);
	let sync = $state(false);
	let volume = $state(30);
</script>

<Demo
	title="TextInput"
	figma="input → text-input"
	about="One line of text. States: hover, focus, error, disabled."
>
	<div class="grid">
		<TextInput label={t.label} placeholder={t.placeholder} bind:value={name} hint={t.hint} />
		<TextInput icon="search" placeholder={t.searchAttributes} bind:value={search} />
		<TextInput label={t.login} bind:value={login} error={t.loginTaken} />
		<TextInput label={t.comment} bind:value={comment} maxlength={40} iconEnd="edit" />
		<TextInput label={t.disabled} value={t.cannotChange} disabled />
		<TextInput big label={t.fullName} bind:value={fullName} />
		<TextInput big label={t.fullName} />
	</div>
</Demo>

<Demo title="Select" figma="input → select" about="Pick one option from a list.">
	<div class="grid">
		<Select
			label={t.attributesType}
			placeholder={t.choose}
			options={t.attributeTypes}
			bind:value={type}
		/>
		<Select label={t.withError} placeholder={t.choose} options={t.oneTwo} error={t.chooseOne} />
		<Select label={t.disabled} options={t.attributeTypes} value="domain" disabled />
		<Select big label={t.compareWith} options={t.emails} bind:value={compareWith} />
		<Select big label={t.compareWith} options={t.emails} />
	</div>
</Demo>

<Demo
	title="MultiSelect"
	figma="input → combobox"
	about="Pick several options from a list. The chosen ones are shown as tags; the box grows when they need more lines. With `summary` the box only says how many are chosen, and options may have a second line."
>
	<div class="grid">
		<MultiSelect
			label={t.skills}
			placeholder={t.choose}
			options={t.skillOptions}
			bind:value={skills}
		/>
		<MultiSelect
			label={t.offices}
			placeholder={t.choose}
			icon="search"
			options={t.officeOptions}
			bind:value={offices}
			hint={t.nothingChosen}
		/>
		<MultiSelect
			label={t.withError}
			placeholder={t.choose}
			options={t.oneTwo}
			error={t.chooseAtLeastOne}
		/>
		<MultiSelect label={t.disabled} options={t.skillOptions} value={['Go', 'API']} disabled />
		<MultiSelect
			big
			label={t.roles}
			placeholder={t.choose}
			options={t.roleOptions}
			bind:value={roles}
		/>
		<MultiSelect
			label={t.projects}
			placeholder={t.choose}
			options={t.projectOptions}
			summary={t.chosen(projects.length)}
			bind:value={projects}
		/>
	</div>
</Demo>

<Demo title="Checkbox" figma="checkbox" about="On or off. Several can be on at once.">
	<Checkbox bind:checked={agree}>{t.title}</Checkbox>
	<Checkbox bind:checked={updates} subtitle={t.subtitle}>{t.title}</Checkbox>
	<Checkbox indeterminate>{t.someSelected}</Checkbox>
	<Checkbox checked disabled>{t.disabled}</Checkbox>
</Demo>

<Demo title="Radio" figma="radio-button" about="One choice out of a group.">
	<Radio bind:group={plan} value="free">{t.free}</Radio>
	<Radio bind:group={plan} value="pro" subtitle={t.billedYearly}>{t.pro}</Radio>
	<Radio bind:group={plan} value="team" disabled>{t.team}</Radio>
</Demo>

<Demo title="Switch" figma="switch" about="Turns a setting on or off right away.">
	<Switch bind:checked={dark}>{t.darkMode}</Switch>
	<Switch bind:checked={sync}>{t.autoSync}</Switch>
	<Switch big bind:checked={dark} label={t.bigSwitch} />
	<Switch big bind:checked={sync} label={t.bigSwitch} />
	<Switch checked disabled>{t.disabled}</Switch>
</Demo>

<Demo
	title="Slider"
	figma="slider"
	about="Pick a number by dragging. Hover it or drag it to see the value; it also works with the arrow keys."
>
	<div class="slider"><Slider bind:value={volume} label={t.volume} /></div>
	<div class="slider"><Slider bind:value={volume} big label={t.volumeBig} /></div>
	<div class="slider"><Slider value={60} disabled label={t.disabled} /></div>
	<div class="slider"><Slider value={60} big disabled label={t.disabledBig} /></div>
</Demo>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		align-items: start;
		gap: 16px;
		width: 100%;
	}
	.slider {
		width: 168px;
		margin-top: 32px; /* room for the value bubble above it */
	}
</style>
