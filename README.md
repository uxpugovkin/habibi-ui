# Habibi UI

The **habibi-library** design system, moved from Figma into code — plus the prototypes built with it.

- **Design system** → `src/lib` (tokens + Svelte components)
- **Live docs** → the `/ds` page: every token and component, in all four themes and in right-to-left
- **Prototypes** → one folder each under `src/routes` (`/abac-as-is`, `/abac-to-be`, `/rego-playground` and `/edit-attributes`)

Built with [Svelte 5](https://svelte.dev) and SvelteKit. Plain JavaScript and plain CSS — no TypeScript, no CSS framework.

## Run it

```sh
npm install
npm run dev        # then open http://localhost:5173/ds
```

Other commands:

| Command           | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `npm run build`   | Builds the site into `build/` (this is what gets published)   |
| `npm run preview` | Shows the built site locally                                  |
| `npm run package` | Packs `src/lib` into `dist/` so other products can install it |
| `npm run check`   | Looks for mistakes in the code and accessibility problems     |
| `npm run format`  | Tidies up the formatting of all files                         |

## What is where

```
src/
  lib/                          THE DESIGN SYSTEM
    index.js                    the list of everything it exports
    styles.css                  all CSS in one file (for products without Svelte)
    tokens/
      index.css                 import this one file to get all tokens
      colours.css               all colours × 4 themes (light, dark, olive, olive-night)
      sizes.css                 corner radius and shadows
      typography.css            fonts and text styles
      base.css                  page defaults (background, text, focus ring)
    components/
      button/
        Button.svelte           the markup and the props (how to use it is written at the top)
        button.css              the look
      …one folder per component

  routes/                       THE SITE
    +page.svelte                home page
    ds/                         the docs page  →  /ds
      sections/                 the examples, one file per group
      content.js                every text the examples show, English and Arabic side by side
      examples.svelte.js        the "Arabic examples" switch (only the examples change, not the docs)
      employees.js              the made-up people of the table examples (ids only, words in content.js)
      tables/                   the table guidelines  →  /ds/tables
    abac-as-is/                 the ABAC prototype as designed today  →  /abac-as-is
    abac-to-be/                 its copy where changes are tried out  →  /abac-to-be
    rego-playground/            Flow Designer's Rego sandbox          →  /rego-playground
    edit-attributes/            editing a user's attributes in place  →  /edit-attributes
    (your-prototype)/           prototypes go here, one folder each
```

## The rules of this design system

1. **Tokens are the Figma variables, 1:1.** Same names, `/` replaced by `-`:
   `boring-blue/50` in Figma is `var(--boring-blue-50)` in CSS.
2. **Components only use tokens.** No colours or font sizes typed by hand inside a component.
3. **One folder per component, two files.** `Name.svelte` (markup + props) and `name.css` (the look).
4. **Every file starts with a comment** that says what it is, where it lives in Figma, and how to use it.
5. **Components stay dumb.** They show what they are given and report clicks. They do not fetch, sort
   or remember things — the page does that.
6. **Readable beats clever.** If a simpler version is a few lines longer, take the simpler version.
7. **Ask before changing the design system.** Everything in `src/lib` is shared by every product
   and every prototype. Adding a prop, a variant, a style or a new component there needs a "yes"
   from the owner first — say what would change and why, then wait.
   Prototypes and docs pages (`src/routes`) may be changed freely.

   > **For AI assistants (Claude, Copilot, Cursor…): this rule is not optional.**
   > Never edit, add or delete anything under `src/lib` without asking first and getting an
   > explicit "yes" in the conversation. Not even "small" or "obvious" changes, and not because
   > another rule (e.g. "library first") seems to call for it. If a prototype needs something the
   > library lacks, stop and ask: build it in the library, or keep it local to the prototype?

## Guidelines

Some components come with written rules for how to use them. They live next to the component;
the docs page shows them with a live example under every rule.

| Topic          | File                                     | Docs page            |
| -------------- | ---------------------------------------- | -------------------- |
| Tables         | `src/lib/components/table/guidelines.js` | `/ds/tables`         |
| Table settings | `src/lib/components/table/guidelines.js` | `/ds/table-settings` |

Read the guidelines before building a screen that uses that component.

## Themes and right-to-left

Set the theme on `<html>` (or on any wrapper):

```html
<html data-theme="dark" dir="ltr"></html>
```

Themes: `light` (default), `dark`, `olive`, `olive-night`. For right-to-left add `dir="rtl"`.
Nothing else changes — every component follows.

## Use a component

```svelte
<script>
	import { Button, Tag } from '#lib';
</script>

<Button appearance="accent" mode="primary" icon="plus">Add user</Button>
<Tag colour="success">Active</Tag>
```

Open any component file to see all of its options — they are listed in the comment at the top.

## Add a component

1. Make a folder in `src/lib/components/`, with `Name.svelte` and `name.css`.
   Copying a small existing one (for example `badge/`) is the easiest start.
2. Add one line to `src/lib/index.js`, and the CSS file to `src/lib/styles.css`.
3. Add a `<Demo>` for it in `src/routes/ds/sections/`, and its name to the menu in `src/routes/ds/+layout.svelte`.
   Put the texts the example shows into `src/routes/ds/content.js`, in English and Arabic.

## Add a prototype

Make a folder in `src/routes/`, for example `src/routes/abac-as-is/+page.svelte` for the ABAC prototype.
It is live at `/abac-as-is` on the site.
Import components from `#lib`. If the prototype needs a component that does not exist yet,
add it to the design system first, then use it.

## Use it in another product

```sh
npm run package      # builds dist/
```

- **Svelte product:** `import { Button } from 'habibi-ui'` and, once, `import 'habibi-ui/tokens'`.
- **Any other product (React, Vue, plain HTML…):** `import 'habibi-ui/styles'` and use the same
  HTML and class names the components use (open the `.svelte` file to see them).

## What was moved from Figma

| Figma page                             | In code                                        |
| -------------------------------------- | ---------------------------------------------- |
| colour                                 | `tokens/colours.css` (4 themes)                |
| typo                                   | `tokens/typography.css`                        |
| radius variables, shadow styles        | `tokens/sizes.css`                             |
| icons                                  | `Icon` (105 icons), `Loader`                   |
| button                                 | `Button` (also covers icon-button)             |
| input                                  | `TextInput`, `Select`, `MultiSelect`           |
| checkbox, radio-button, switch, slider | `Checkbox`, `Radio`, `Switch`, `Slider`        |
| tabs                                   | `Tabs`                                         |
| chips                                  | `Chip`, `Segmented`, `FilterChip`              |
| avatar, badge, marker, tag             | `Avatar`, `Badge`, `Marker`, `Tag`             |
| notification, tooltip, skeleton        | `Notification`, `Tooltip`, `Skeleton`          |
| table                                  | `Table`, `TableToolbar`                        |
| drag-row                               | `DragRow`                                      |
| splitter                               | `Splitter`                                     |
| Drop List                              | `Menu`, `MenuItem`                             |
| Empty                                  | `EmptyState` (with the monkey mascot, 5 types) |
| Tree                                   | `Tree`                                         |
| Sidebar                                | `Sidebar` (expanded and collapsed)             |

**Not moved yet:** Date Picker, Charts, Messages, browser frame, and a few variants
(split-button, inline-input, combobox, vertical slider, flag and file-type icons).

## Visits

Visits of the docs (`/ds`) and of every prototype are counted with GoatCounter
(the home page is not). See them at https://habibi-ui.goatcounter.com. The code is in `src/routes/goatcounter.js`;
nothing is counted while you run the site on your own computer.

## Publishing

Every push to `main` builds the site and publishes it to GitHub Pages
(see `.github/workflows/deploy.yml`).

One-time setup on GitHub: **Settings → Pages → Source: GitHub Actions**.
