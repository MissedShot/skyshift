# Skyshift

**A tiny theme switch with a whole sky inside.**

Skyshift is an illustrated, dependency-free light and dark mode switch built as a standards-based Web Component. Drop one JavaScript file into almost any website and get a polished theme control with isolated styles, persistence, accessibility, and a small public API.

## Why Skyshift?

- **Portable:** works with plain HTML, React, Vue, Svelte, Astro, and other modern web stacks.
- **Dependency-free:** no framework, icon package, stylesheet, or build step required.
- **Style-safe:** Shadow DOM prevents website CSS from breaking the illustration.
- **Accessible:** native checkbox semantics, keyboard interaction, dynamic labels, focus visibility, and reduced-motion support.
- **Persistent:** remembers the selected theme using `localStorage`.
- **Customizable:** exposes CSS variables for every important visual color.

## Quick start

Copy [`skyshift.js`](./skyshift.js) into your project and load it as an ES module:

```html
<script type="module" src="/skyshift.js"></script>

<skyshift-toggle default-theme="system"></skyshift-toggle>
```

Skyshift sets `data-theme="light"` or `data-theme="dark"` on the `<html>` element and updates `color-scheme` automatically.

Add the matching website styles:

```css
:root {
  color-scheme: light;
  background: #fffaf0;
  color: #211b11;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  background: #071b2f;
  color: #edf7ff;
}
```

Open [`index.html`](./index.html) to see a complete responsive demo.

## Attributes

| Attribute | Values | Default | Purpose |
| --- | --- | --- | --- |
| `theme` | `light`, `dark` | — | Controls the current theme. |
| `default-theme` | `light`, `dark`, `system` | `light` | Sets the initial fallback when no preference is saved. |
| `storage-key` | Any string | `theme-mode` | Changes the localStorage key. Use an empty value to disable persistence. |
| `apply-to` | CSS selector | `html` | Selects the element that receives `data-theme`. |
| `no-apply` | Boolean attribute | Off | Prevents automatic page changes so your app can handle the event itself. |

Example with custom behavior:

```html
<skyshift-toggle
  default-theme="system"
  storage-key="my-site-theme"
  apply-to="body"
></skyshift-toggle>
```

## JavaScript API

### `theme`

Read or set the current theme:

```js
const skyshift = document.querySelector("skyshift-toggle");

console.log(skyshift.theme); // "light" or "dark"
skyshift.theme = "dark";
```

### `toggle()`

Switch between light and dark:

```js
skyshift.toggle();
```

### `themechange`

Listen for user or programmatic changes:

```js
skyshift.addEventListener("themechange", (event) => {
  console.log(event.detail.theme);
});
```

If your application owns theme state, add `no-apply` and update it from the event:

```html
<skyshift-toggle no-apply></skyshift-toggle>

<script>
  document.querySelector("skyshift-toggle")
    .addEventListener("themechange", ({ detail }) => {
      appStore.setTheme(detail.theme);
    });
</script>
```

## Customize the illustration

Set variables directly on the custom element:

```css
skyshift-toggle {
  --theme-switch-sun-mid: #f4c542;
  --theme-switch-day-top: #f6df86;
  --theme-switch-day-bottom: #fff2c2;
  --theme-switch-night-top: #145da0;
  --theme-switch-night-bottom: #063b72;
  --theme-switch-focus: #8b5cf6;
}
```

Available variable groups:

- Size: `--theme-switch-width`, `--theme-switch-height`, `--theme-switch-knob-size`, `--theme-switch-inset`, `--theme-switch-travel`
- Day: `--theme-switch-day-top`, `--theme-switch-day-bottom`, `--theme-switch-day-border`, cloud colors, and `--theme-switch-day-ink`
- Sun: `--theme-switch-sun-light`, `--theme-switch-sun-mid`, `--theme-switch-sun-edge`
- Night: `--theme-switch-night-top`, `--theme-switch-night-bottom`, `--theme-switch-night-border`, cloud colors, and `--theme-switch-night-ink`
- Moon: `--theme-switch-moon-light`, `--theme-switch-moon-mid`, `--theme-switch-moon-edge`, `--theme-switch-moon-detail`
- Focus: `--theme-switch-focus`

When changing dimensions, keep the relationship below so the knob lands evenly on both sides:

```text
travel = width - knob size - (2 × inset)
```

## Framework examples

### React

Import the module once, then use the custom element in JSX:

```jsx
import "./skyshift.js";

export function ThemeControl() {
  return <skyshift-toggle default-theme="system" />;
}
```

### Vue

```vue
<script setup>
import "./skyshift.js";
</script>

<template>
  <skyshift-toggle default-theme="system" />
</template>
```

## Browser support

Skyshift uses Custom Elements, Shadow DOM, ES modules, CSS custom properties, and `color-scheme`. It targets current versions of Chrome, Edge, Firefox, and Safari.

## Development

No dependencies are required. Serve the directory with any static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

Validate the module syntax with:

```bash
node --check skyshift.js
```

## License

[MIT](./LICENSE) © MissedShot
