/*
	The columns of the example table, as the table settings see them. Guide only.
	Each one: { key, label, visible, pinned }, in the order the table shows them.
	(The same "Employees" columns as the table guidelines, see ../tables/columns.js.)
*/

import { columnsWith, columnWidths } from '../tables/columns.js';

/** The columns before anyone changes them. `pinned` = keys of the columns pinned at the start. */
export function startingColumns(pinned = []) {
	return columnsWith(columnWidths.wide).map((column) => ({
		key: column.key,
		label: column.label,
		visible: true,
		pinned: pinned.includes(column.key)
	}));
}

/** A copy to change without touching the original (a draft). */
export function copyColumns(columns) {
	return columns.map((column) => ({ ...column }));
}
