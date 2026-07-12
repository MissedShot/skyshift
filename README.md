# Skyshift

**A tiny theme switch with a whole sky inside.**

Skyshift is an illustrated, dependency-free light and dark mode switch built as a standards-based Web Component. Drop one JavaScript file into almost any website and get a polished theme control with isolated styles, persistence, accessibility, and a small public API.

## Why Skyshift?

- **Portable:** works with plain HTML, React, Vue, Svelte, Astro, and other modern web stacks.
- **Dependency-free:** no framework, icon package, stylesheet, or build step required.
- **Style-safe:** Shadow DOM prevents website CSS from breaking the illustration.
- **Accessible:** native checkbox semantics, keyboard interaction, a stable accessible name, focus visibility, and reduced-motion support.
- **Persistent:** remembers the selected theme using `localStorage`.
- **Customizable:** exposes CSS variables for every important visual color.

## Quick start

Copy [`skyshift.js`](./skyshift.js) into your project and load it as a deferred script:

```html
<script src="./skyshift.js" defer></script>

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

### Prevent an initial theme flash

Because the component loads with `defer`, add this small script early in `<head>` if the page must use the saved theme before its first paint:

```html
<script>
  (() => {
    let theme;
    try {
      theme = localStorage.getItem("theme-mode");
    } catch {}

    if (theme !== "light" && theme !== "dark") {
      theme = matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  })();
</script>
```

Open [`index.html`](./index.html) to see a complete responsive demo. It also works when opened directly from your file browser; a local server is optional.

## Attributes

| Attribute | Values | Default | Purpose |
| --- | --- | --- | --- |
| `theme` | `light`, `dark` | — | Controls the current theme. |
| `default-theme` | `light`, `dark`, `system` | `light` | Sets the fallback when no preference is saved. `system` follows OS theme changes live. |
| `storage-key` | Any string | `theme-mode` | Changes the localStorage and synchronization key. An empty value isolates the switch and disables persistence. |
| `apply-to` | CSS selector | `html` | Selects the element that receives `data-theme`. |
| `no-apply` | Boolean attribute | Off | Prevents automatic page changes so your app can handle the event itself. |
| `label` | Any string | `Dark mode` | Sets the switch's stable accessible name. |

Example with custom behavior:

```html
<skyshift-toggle
  default-theme="system"
  storage-key="my-site-theme"
  apply-to="body"
></skyshift-toggle>
```

Switches with the same non-empty `storage-key` stay synchronized on the page and across tabs. Use `storage-key=""` for an independent preview or a fully controlled instance.

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

Listen for user, programmatic, or synchronized changes:

```js
skyshift.addEventListener("themechange", (event) => {
  console.log(event.detail.theme);
});
```

If your application owns theme state, add `no-apply` and update it from the event:

```html
<skyshift-toggle no-apply storage-key=""></skyshift-toggle>

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
- Interaction: `--theme-switch-focus`, `--theme-switch-hover-ring`

Knob travel is calculated automatically from the width, knob size, and inset. Override `--theme-switch-travel` only when you want custom geometry.

## Framework examples

The package can be imported during server rendering without accessing browser globals. Registration happens when the same module runs in the browser.

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

Skyshift uses Custom Elements, Shadow DOM, CSS custom properties, and `color-scheme`. It targets current versions of Chrome, Edge, Firefox, and Safari.

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
