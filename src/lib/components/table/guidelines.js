/* ==========================================================================
   TABLE GUIDELINES
   --------------------------------------------------------------------------
   Rules and recommendations for working with tables. Follow them whenever a
   screen or a prototype has a table.

   Source: Figma → habibi-library → page "Tables Guide".
   This file is the single copy of the TEXT in code. Two docs pages read it and
   put a live example under every rule:
     tableGuidelines           → /ds/tables
     tableSettingsGuidelines   → /ds/table-settings  (the guide's "Appendix A")

   How it is organised:
     chapters → each has a few rules
     a rule   → id, title, text (a list of sentences) and, where it helps,
                `code`: which Table option or component does it.

   Sides: "left" and "right" are for left-to-right languages. In right-to-left
   languages they swap by themselves.

   To change a rule, edit it here. If you add a rule, give it a new id; to give
   it an example, add one with the same id on its docs page
   (src/routes/ds/tables/+page.svelte or src/routes/ds/table-settings/+page.svelte).
   ========================================================================== */

export const tableGuidelines = [
	{
		title: 'Tables',
		about: 'Rules and recommendations for working with tables',
		rules: [
			{
				id: '1.0',
				title: 'When to use',
				text: [
					'If the person compares data across table cells, studies a sequence of events, or changes data with bulk operations, you probably need a table.',
					'If the person is looking for one object by data known in advance, to view details about a user, a transaction or a server, you probably need a search page instead.'
				]
			},
			{
				id: '1.1',
				title: 'Anatomy',
				text: [
					'1. Title — needed only if the page has other content besides the table.',
					'2. Toolbar — contains search, filters and a group of up to 3 buttons.',
					'3. Table body — contains columns, rows, cells and the bulk-operation controls.',
					'4. Summary row — optionally shows the total across all rows of a column, and the like.'
				],
				code: '<Table> with the `toolbar` snippet (a <TableToolbar title="…">) and the `summary` snippet.'
			},
			{
				id: '1.2',
				title: 'Default row sorting',
				text: [
					'Rows are always sorted by one of the columns, which is marked with an arrow.',
					'The person can sort each column alphabetically, or in ascending and descending order.'
				],
				code: 'Column `sortable: true`, plus `sortKey`, `sortDirection` and `onsort` on <Table>. The page sorts the rows.'
			},
			{
				id: '1.3',
				title: 'Row alignment and text truncation',
				text: [
					'Everything in a row is centred vertically, and so are the header labels, also when one of them wraps.',
					'Text with important information, such as a full name, wraps — to at most 3 lines.',
					'Text that can be skipped is cut with "…" and stays available in the detail view.'
				],
				code: 'Cutting is the default. Column `wrap: true` makes that column wrap (up to 3 lines).'
			}
		]
	},
	{
		title: 'Scrolling',
		about: 'How a table behaves when its content scrolls up-down and sideways',
		rules: [
			{
				id: '2.1',
				title: 'Vertical scrolling',
				text: [
					'If there is more data than fits the height of the screen, the toolbar can be pinned to the top edge of the screen and the summary row to the bottom.',
					'Let the page header, titles and navigation scroll out of view so they do not distract from the table.'
				],
				code: '<Table pageScroll>: the table scrolls with the page; its toolbar, header and summary stay in view.'
			},
			{
				id: '2.2',
				title: 'Horizontal scrolling',
				text: [
					'If there is more data than fits the width of the screen, selected columns can be pinned to the left side, on top of the other cells.'
				],
				code: 'Column `pinned: true` (give it a `width`).'
			},
			{
				id: '2.3',
				title: 'Scrolling along both axes',
				text: [
					'Both rules work together: the header stays on top and the pinned columns stay at the side.'
				],
				code: '`pageScroll` together with a `pinned` column.'
			}
		]
	},
	{
		title: 'Search and filter',
		about: 'Rules for searching and filtering data',
		rules: [
			{
				id: '3.1',
				title: 'Purpose',
				text: [
					'Search and filters help find the right records in a table and limit what is shown to the given conditions.',
					'Filtering uses filter tags, which let the person see the applied conditions and manage them.'
				]
			},
			{
				id: '3.2',
				title: 'Filter tags',
				text: [
					'Filter tags are required wherever a table can be filtered. They show the applied conditions, so the person quickly sees how the data was selected.',
					'If the filter tags do not fit on one line, they wrap to the next line. They are never hidden.'
				],
				code: '<FilterChip> inside the toolbar. The page keeps the values and filters the rows.'
			},
			{
				id: '3.3',
				title: 'Search across multiple columns',
				text: [
					'When the search covers several columns, use the placeholder "Search". Do not list the columns in the placeholder.'
				],
				code: '<SearchChip bind:value={…} />'
			},
			{
				id: '3.4',
				title: 'Search in a single column',
				text: ['When the search is limited to one column, name that column in the placeholder.'],
				code: '<SearchChip placeholder="Search by name" bind:value={…} />'
			},
			{
				id: '3.5',
				title: 'Additional filters',
				text: [
					'Show no more than 3–5 filter tags at a time. The rest are hidden in a dropdown list by default.',
					'At the designer’s discretion, a side panel (drawer) may be opened instead.'
				],
				code: 'A <Button icon="tune"> that opens a <Menu> of <Checkbox> rows.'
			}
		]
	},
	{
		title: 'Button placement',
		about: 'Where the action buttons above a table go',
		rules: [
			{
				id: '4.1',
				title: 'Table on a page without navigation',
				text: ['If a page contains only a table, put the add-row button in the page header.']
			},
			{
				id: '4.2',
				title: 'Complex page navigation',
				text: [
					'If the page has tabs, segments, scopes or other content besides the table, the add-row button goes into the table’s toolbar — close to what it acts on.'
				],
				code: 'Put the buttons in the `end` snippet of <TableToolbar>.'
			},
			{
				id: '4.3',
				title: 'Icon buttons',
				text: ['An icon-only button is acceptable for the main action.']
			}
		]
	},
	{
		title: 'Single-row actions',
		about: 'How to show the actions of one row',
		rules: [
			{
				id: '5.1',
				title: 'Dedicated actions column',
				text: [
					'When there is little information and no horizontal scrolling, give the actions a column of their own. They are shown only while the mouse is over the row.'
				],
				code: '<Table actionsWidth={…}> with the `actions` snippet.'
			},
			{
				id: '5.2',
				title: 'If the actions column is outside the viewport',
				text: [
					'When there is a lot of information and horizontal scrolling, the actions are shown on hover and pinned to the right side of the table body. No column is needed.'
				],
				code: '<Table> with the `actions` snippet, without `actionsWidth`.'
			},
			{
				id: '5.3',
				title: 'Pinned actions column',
				text: [
					'If the preferred option cannot be built, a dedicated actions column may be pinned to the right side of the table.'
				],
				code: '<Table actionsWidth={…}> — the actions column is always pinned to the far side.'
			}
		]
	},
	{
		title: 'Bulk operations',
		about: 'Rules for selecting several rows',
		rules: [
			{
				id: '6.1',
				title: 'Initial state',
				text: ['The person marks the rows they want with a checkbox.'],
				code: '<Table selectable bind:selection={…}>. Every row needs an `id`.'
			},
			{
				id: '6.2',
				title: 'Select rows individually',
				text: [
					'When only some rows are selected, the checkbox in the header shows the semi-check (dash) icon.'
				],
				code: 'Table does this by itself.'
			},
			{
				id: '6.3',
				title: 'Select all rows',
				text: [
					'Clicking the checkbox in the header selects all available rows, or clears the selection from all rows.'
				],
				code: 'Table does this by itself.'
			},
			{
				id: '6.4',
				title: 'Conflicts with filter tags',
				text: [
					'Clicking the checkbox in the header marks all filtered rows. If the person then changes the filters:',
					'A) Rows that newly appear must not be selected automatically.',
					'B) Rows that drop out of the results are removed from the selection automatically.'
				],
				code: 'Table does this by itself whenever `rows` change.'
			},
			{
				id: '6.5',
				title: 'Conflicts with pagination',
				text: ['The person can select all rows on the page, or all rows that exist.'],
				code: '<Table allRows={…}>: the header checkbox then asks "Rows on this page / All rows in the table".'
			}
		]
	}
];

/* ---------- Appendix A: table settings ----------
   Figma → habibi-library → "Appendix A — LTR" → "Table settings" */

export const tableSettingsGuidelines = [
	{
		title: 'Table settings',
		about: 'Rules for showing, hiding, pinning and reordering columns',
		rules: [
			{
				id: '1.1',
				title: 'Option A — Drawer',
				text: [
					'Recommended for tables with more than 8 columns.',
					'Up to 3 columns can be pinned.',
					'At least 2 columns must stay visible: once only 2 are left, their hide segment is disabled.'
				],
				code: 'Pinned columns: <MultiSelect big max={3}>. Each column: <DragRow bind:visible hideDisabled={…}>. Changes reach the table on "Save".'
			},
			{
				id: '1.2',
				title: 'Option B — Popover',
				text: [
					'Recommended for tables with fewer than 8 columns where data can be refreshed instantly.',
					'At least 2 columns must stay visible: once only 2 are left, their hide segment is disabled.'
				],
				code: 'Each column: <DragRow bind:visible hideDisabled={…}>. Every change reaches the table at once.'
			}
		]
	}
];
