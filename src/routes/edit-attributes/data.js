/*
	MADE-UP DATA of the edit-attributes prototype: one user and their attributes.
	Nothing here comes from a server.

	Figma:  sbertech-habibi → page "abac-r5" → "1-0-abtract" (the page),
	        "EDIT-form" (one edit card per datatype), "3-0-unsaved-changes"

	Every attribute has a DATATYPE. It decides how the value is shown on the page
	and which field the edit card opens with:

	  type     value                      shown as                    edited with
	  text     'Lead security analyst'    the text                    TextInput (with a counter)
	  date     '14.03.1988'               the text                    TextInput, DD.MM.YYYY
	  enum     'full-time'                the label of the option     Select
	  array    ['English', 'German']      texts with dots between     TagInput: type, Enter = a tag
	  multi    ['berlin', 'amsterdam']    small cards: title + line   MultiSelect ("2 chosen")

	An empty value ('' or []) is shown as "—".
*/

/** The user whose page is open. */
export const user = {
	fullName: 'Brenda Gray Cooper',
	uid: '816886',
	login: 'walker85@acme.corp',
	status: 'Active',
	lastSync: '12.08.2026'
};

/* ---------- The options of the enum and multi attributes ---------- */

const departments = [
	{ value: 'security-ops', label: 'Security Operations' },
	{ value: 'identity', label: 'Identity & Access' },
	{ value: 'risk', label: 'Risk & Compliance' },
	{ value: 'platform', label: 'Platform Engineering' }
];

const employmentTypes = [
	{ value: 'full-time', label: 'Full-time' },
	{ value: 'part-time', label: 'Part-time' },
	{ value: 'contractor', label: 'Contractor' },
	{ value: 'intern', label: 'Intern' }
];

const clearances = [
	{ value: 'public', label: 'Public' },
	{ value: 'internal', label: 'Internal' },
	{ value: 'confidential', label: 'Confidential' },
	{ value: 'secret', label: 'Secret' }
];

const timeZones = [
	{ value: 'europe-berlin', label: 'Europe/Berlin (UTC+1)' },
	{ value: 'europe-london', label: 'Europe/London (UTC+0)' },
	{ value: 'america-new-york', label: 'America/New_York (UTC−5)' },
	{ value: 'asia-dubai', label: 'Asia/Dubai (UTC+4)' }
];

const offices = [
	{ value: 'berlin', label: 'Berlin', subtitle: 'Friedrichstraße 68' },
	{ value: 'amsterdam', label: 'Amsterdam', subtitle: 'Keizersgracht 241' },
	{ value: 'lisbon', label: 'Lisbon', subtitle: 'Avenida da Liberdade 110' },
	{ value: 'dubai', label: 'Dubai', subtitle: 'Sheikh Zayed Road 12' }
];

const projects = [
	{ value: 'atlas', label: 'Atlas', subtitle: 'Identity platform' },
	{ value: 'kestrel', label: 'Kestrel', subtitle: 'SIEM migration' },
	{ value: 'lumen', label: 'Lumen', subtitle: 'Audit tooling' },
	{ value: 'harbor', label: 'Harbor', subtitle: 'Secrets vault' },
	{ value: 'quill', label: 'Quill', subtitle: 'Policy editor' }
];

/* ---------- The attributes, in groups ----------
	One attribute:  { id, title, type, value, options?, required?, maxlength? }
	  required    true = it cannot be left empty
	  maxlength   text only: the longest text allowed (shows a counter in the edit card)
*/

export const groups = [
	{
		title: 'Personal',
		attributes: [
			{
				id: 'fullName',
				title: 'Full name',
				type: 'text',
				value: 'Brenda Gray Cooper',
				required: true,
				maxlength: 60
			},
			{
				id: 'preferredName',
				title: 'Preferred name',
				type: 'text',
				value: 'Brenda',
				maxlength: 30
			},
			{ id: 'birthDate', title: 'Date of birth', type: 'date', value: '14.03.1988' },
			{
				id: 'languages',
				title: 'Languages',
				type: 'array',
				value: ['English', 'German', 'Spanish']
			},
			{ id: 'nickname', title: 'Nickname', type: 'text', value: '', maxlength: 30 }
		]
	},
	{
		title: 'Employment',
		attributes: [
			{
				id: 'position',
				title: 'Position',
				type: 'text',
				value: 'Lead security analyst',
				required: true,
				maxlength: 60
			},
			{
				id: 'department',
				title: 'Department',
				type: 'enum',
				value: 'security-ops',
				options: departments,
				required: true
			},
			{
				id: 'employment',
				title: 'Employment type',
				type: 'enum',
				value: 'full-time',
				options: employmentTypes
			},
			{ id: 'hireDate', title: 'Hire date', type: 'date', value: '02.09.2019', required: true },
			{
				id: 'offices',
				title: 'Offices',
				type: 'multi',
				value: ['berlin', 'amsterdam'],
				options: offices
			},
			{ id: 'contractEnd', title: 'Contract end', type: 'date', value: '' }
		]
	},
	{
		title: 'Access',
		attributes: [
			{
				id: 'clearance',
				title: 'Clearance level',
				type: 'enum',
				value: 'confidential',
				options: clearances,
				required: true
			},
			{
				id: 'projects',
				title: 'Projects',
				type: 'multi',
				value: ['atlas', 'kestrel', 'lumen'],
				options: projects
			},
			{
				id: 'skills',
				title: 'Skills',
				type: 'array',
				value: ['Incident response', 'Threat hunting', 'SOC 2']
			},
			{ id: 'accessExpires', title: 'Access expires', type: 'date', value: '31.12.2026' }
		]
	},
	{
		title: 'Contacts',
		attributes: [
			{
				id: 'email',
				title: 'Work email',
				type: 'text',
				value: 'walker85@acme.corp',
				required: true,
				maxlength: 60
			},
			{ id: 'phone', title: 'Work phone', type: 'text', value: '+49 30 5557 1290', maxlength: 20 },
			{
				id: 'timeZone',
				title: 'Time zone',
				type: 'enum',
				value: 'europe-berlin',
				options: timeZones
			}
		]
	}
];

/* ---------- Working with values ---------- */

/** The saved values of all attributes: { id: value }. A fresh copy every time. */
export function startingValues() {
	const values = {};
	for (const group of groups) {
		for (const attribute of group.attributes) {
			values[attribute.id] = copyOf(attribute.value);
		}
	}
	return values;
}

/** A copy of a value, so that changing one list never changes another. */
export function copyOf(value) {
	return Array.isArray(value) ? [...value] : value;
}

/** True when two values are the same (lists: the same items, in any order). */
export function sameValue(a, b) {
	if (Array.isArray(a) && Array.isArray(b)) {
		return a.length === b.length && a.every((item) => b.includes(item));
	}
	return a === b;
}

/** True when there is nothing in the value. */
export function isEmpty(value) {
	return Array.isArray(value) ? value.length === 0 : value.trim() === '';
}

/** The option of an enum or multi attribute that has this value. */
export function optionOf(attribute, value) {
	return attribute.options.find((option) => option.value === value);
}

/** The value as words, e.g. for the search: "English German Spanish". */
export function textOf(attribute, value) {
	if (attribute.type === 'enum') return optionOf(attribute, value)?.label ?? '';
	if (attribute.type === 'multi')
		return value.map((item) => optionOf(attribute, item)?.label).join(' ');
	if (attribute.type === 'array') return value.join(' ');
	return value;
}

/**
 * What is wrong with a value, as a message for the edit card. '' = nothing.
 * Dates are written as DD.MM.YYYY and must exist (no 31.02).
 */
export function problemOf(attribute, value) {
	if (isEmpty(value)) return attribute.required ? `${attribute.title} can't be empty` : '';
	if (attribute.type === 'text' && attribute.maxlength && value.length > attribute.maxlength) {
		return `Keep it under ${attribute.maxlength} characters`;
	}
	if (attribute.type === 'date') {
		const parts = value.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
		if (!parts) return 'Write the date as DD.MM.YYYY';
		const [, day, month, year] = parts.map(Number);
		const date = new Date(year, month - 1, day);
		if (date.getMonth() !== month - 1 || date.getDate() !== day) return 'There is no such date';
	}
	return '';
}

/* ---------- The other tabs ---------- */

/** The roles of the user (the "Roles and privileges" tab). */
export const roles = [
	{
		id: 1,
		role: 'viewer',
		scope: 'dom_security',
		grantedBy: 'Tatiana Pirog',
		validUntil: '31.12.2026'
	},
	{
		id: 2,
		role: 'analyst',
		scope: 'dom_security',
		grantedBy: 'Tatiana Pirog',
		validUntil: '31.12.2026'
	},
	{
		id: 3,
		role: 'auditor',
		scope: 'dom_compliance',
		grantedBy: 'Policy: soc-default',
		validUntil: 'No end date'
	}
];

/* ---------- JSON (the "JSON" switch) ---------- */

/** The attributes as JSON: { personal: { fullName: …, … }, … }. Shows the values as they are now. */
export function jsonOf(values) {
	return Object.fromEntries(
		groups.map((group) => [
			group.title.toLowerCase(),
			Object.fromEntries(group.attributes.map((attribute) => [attribute.id, values[attribute.id]]))
		])
	);
}

/**
 * Cuts one line of JSON into coloured pieces (copied from ../abac-to-be/data.js):
 *   [ { text: '  ', kind: 'space' }, { text: '"id"', kind: 'key' }, … ]
 * kind:  "key" | "string" | "value" (numbers, true, false, null) | "mark" ({ } [ ] , :) | "space"
 */
export function colourLine(line) {
	const piece =
		/("(?:[^"\\]|\\.)*")(\s*:)?|true|false|null|-?\d+(?:\.\d+)?|[{}[\],:]|\s+|[^\s"{}[\],:]+/g;

	return [...line.matchAll(piece)].flatMap(([text, quoted, colon]) => {
		if (colon)
			return [
				{ text: quoted, kind: 'key' },
				{ text: colon, kind: 'mark' }
			];
		if (quoted) return [{ text, kind: 'string' }];
		if (/^\s+$/.test(text)) return [{ text, kind: 'space' }];
		if (/^[{}[\],:]$/.test(text)) return [{ text, kind: 'mark' }];
		return [{ text, kind: /^(true|false|null|-?[\d.]+)$/.test(text) ? 'value' : 'string' }];
	});
}

/** Turns a value into pretty JSON, as a list of text lines. */
export function jsonLines(value) {
	return JSON.stringify(value, null, 2).split('\n');
}

/* ---------- Domains (the breadcrumbs and the side menu) ---------- */

/** The domain the prototype works in. */
export const currentDomain = 'res-domain-144';

/** All domains of the tenant. Only the current one can be picked in this prototype. */
export const domains = [
	'res-domain-101',
	'res-domain-117',
	'res-domain-128',
	'res-domain-139',
	'res-domain-144',
	'res-domain-151',
	'res-domain-170',
	'audit-logs',
	'customer-identity',
	'hr-directory'
];
