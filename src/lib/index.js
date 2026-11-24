/* ==========================================================================
   HABIBI UI — everything the design system gives you, in one list.
   --------------------------------------------------------------------------
   Use in a page:
       import { Button, Tag, Table } from '#lib';          ← inside this repo
       import { Button, Tag, Table } from 'habibi-ui';     ← in another product

   Don't forget the tokens (colours, fonts, sizes) once, at the top of the app:
       import '#lib/tokens/index.css';                     ← inside this repo
       import 'habibi-ui/tokens';                          ← in another product

   To add a component: make a folder in ./components, then add one line here.
   ========================================================================== */

// Basics
export { default as Icon } from './components/icon/Icon.svelte';
export { iconNames } from './components/icon/icon-paths.js';
export { default as Button } from './components/button/Button.svelte';
export { default as Loader } from './components/loader/Loader.svelte';

// Forms
export { default as TextInput } from './components/text-input/TextInput.svelte';
export { default as Select } from './components/select/Select.svelte';
export { default as MultiSelect } from './components/multi-select/MultiSelect.svelte';
export { default as Checkbox } from './components/checkbox/Checkbox.svelte';
export { default as Radio } from './components/radio/Radio.svelte';
export { default as Switch } from './components/switch/Switch.svelte';
export { default as Slider } from './components/slider/Slider.svelte';

// Navigation and choice
export { default as Tabs } from './components/tabs/Tabs.svelte';
export { default as Chip } from './components/chip/Chip.svelte';
export { default as Segmented } from './components/segmented/Segmented.svelte';
export { default as FilterChip } from './components/filter-chip/FilterChip.svelte';
export { default as SearchChip } from './components/search-chip/SearchChip.svelte';
export { default as Menu } from './components/menu/Menu.svelte';
export { default as MenuItem } from './components/menu/MenuItem.svelte';
export { default as Tree } from './components/tree/Tree.svelte';
export { default as Sidebar } from './components/sidebar/Sidebar.svelte';

// Status and feedback
export { default as Tag } from './components/tag/Tag.svelte';
export { default as Badge } from './components/badge/Badge.svelte';
export { default as Marker } from './components/marker/Marker.svelte';
export { default as Notification } from './components/notification/Notification.svelte';
export { default as Tooltip } from './components/tooltip/Tooltip.svelte';
export { default as Skeleton } from './components/skeleton/Skeleton.svelte';

// Data and layout
export { default as Avatar } from './components/avatar/Avatar.svelte';
export { default as Table } from './components/table/Table.svelte';
export { default as TableToolbar } from './components/table/TableToolbar.svelte';
export { default as DragRow } from './components/drag-row/DragRow.svelte';
export { default as EmptyState } from './components/empty-state/EmptyState.svelte';
export { default as Splitter } from './components/splitter/Splitter.svelte';
