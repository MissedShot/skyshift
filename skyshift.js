const skyshiftTemplate = document.createElement("template");

skyshiftTemplate.innerHTML = `
  <style>
    :host {
      --theme-switch-width: 112px;
      --theme-switch-height: 56px;
      --theme-switch-knob-size: 44px;
      --theme-switch-inset: 5px;
      --theme-switch-travel: 56px;

      --theme-switch-day-top: #f6df86;
      --theme-switch-day-bottom: #fff2c2;
      --theme-switch-day-border: #e4bd45;
      --theme-switch-day-cloud-far: #eadca9;
      --theme-switch-day-cloud-mid: #f4e8bd;
      --theme-switch-day-cloud-front: #fff7dc;
      --theme-switch-day-ink: #8c6c1e;

      --theme-switch-sun-light: #f9d85a;
      --theme-switch-sun-mid: #f4c542;
      --theme-switch-sun-edge: #d9aa20;

      --theme-switch-night-top: #145da0;
      --theme-switch-night-bottom: #063b72;
      --theme-switch-night-border: #1683dc;
      --theme-switch-night-cloud-far: #4b86bf;
      --theme-switch-night-cloud-mid: #619bd2;
      --theme-switch-night-cloud-front: #79afe0;
      --theme-switch-night-ink: #b8ddff;

      --theme-switch-moon-light: #ffffff;
      --theme-switch-moon-mid: #edf4fa;
      --theme-switch-moon-edge: #c9d8e5;
      --theme-switch-moon-detail: #7392ad;
      --theme-switch-focus: #2684ff;

      display: inline-block;
      width: var(--theme-switch-width);
      height: var(--theme-switch-height);
      vertical-align: middle;
      -webkit-tap-highlight-color: transparent;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    .control {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      cursor: pointer;
      border-radius: 999px;
    }

    input {
      position: absolute;
      inset: 0;
      z-index: 3;
      width: 100%;
      height: 100%;
      margin: 0;
      opacity: 0;
      cursor: inherit;
    }

    .track {
      position: absolute;
      inset: 0;
      overflow: hidden;
      isolation: isolate;
      border: 1px solid var(--theme-switch-day-border);
      border-radius: 999px;
      background: linear-gradient(135deg,
        var(--theme-switch-day-top),
        var(--theme-switch-day-bottom));
      box-shadow:
        inset 0 1px 2px rgba(70, 50, 10, .12),
        0 7px 18px rgba(201, 157, 30, .2);
      transition: border-color 320ms ease, box-shadow 320ms ease;
    }

    .track::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 0;
      border-radius: inherit;
      background: linear-gradient(135deg,
        var(--theme-switch-night-top),
        var(--theme-switch-night-bottom));
      opacity: 0;
      transition: opacity 320ms cubic-bezier(.22, .61, .36, 1);
    }

    .control:hover .track {
      box-shadow:
        inset 0 1px 2px rgba(70, 50, 10, .12),
        0 0 0 4px rgba(38, 132, 255, .16);
    }

    input:focus-visible + .track {
      outline: 3px solid var(--theme-switch-focus);
      outline-offset: 3px;
    }

    input:checked + .track {
      border-color: var(--theme-switch-night-border);
      box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, .12),
        0 7px 20px rgba(6, 59, 114, .28);
    }

    input:checked + .track::before {
      opacity: 1;
    }

    .scene {
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      pointer-events: none;
      transition: opacity 260ms ease, transform 360ms ease;
    }

    .scene path {
      stroke: none;
    }

    .scene .line-art {
      fill: none;
      stroke-width: 1.4;
      stroke-linecap: round;
    }

    .day-scene {
      opacity: .84;
      transform: translateX(0);
    }

    .day-scene .far { fill: var(--theme-switch-day-cloud-far); }
    .day-scene .mid { fill: var(--theme-switch-day-cloud-mid); }
    .day-scene .front { fill: var(--theme-switch-day-cloud-front); }
    .day-scene .line-art { stroke: var(--theme-switch-day-ink); }

    .night-scene {
      opacity: 0;
      transform: translateX(-8px);
      color: var(--theme-switch-night-ink);
    }

    .night-scene .far { fill: var(--theme-switch-night-cloud-far); }
    .night-scene .mid { fill: var(--theme-switch-night-cloud-mid); }
    .night-scene .front { fill: var(--theme-switch-night-cloud-front); }
    .night-scene .line-art { stroke: var(--theme-switch-night-ink); }
    .night-scene circle { fill: var(--theme-switch-night-ink); }

    input:checked + .track .day-scene {
      opacity: 0;
      transform: translateX(8px);
    }

    input:checked + .track .night-scene {
      opacity: .96;
      transform: translateX(0);
    }

    .knob {
      position: absolute;
      top: var(--theme-switch-inset);
      left: var(--theme-switch-inset);
      z-index: 2;
      display: grid;
      place-items: center;
      width: var(--theme-switch-knob-size);
      height: var(--theme-switch-knob-size);
      overflow: hidden;
      isolation: isolate;
      border-radius: 50%;
      background: radial-gradient(circle at 44% 40%,
        var(--theme-switch-sun-light),
        var(--theme-switch-sun-mid) 72%,
        var(--theme-switch-sun-edge));
      box-shadow:
        0 2px 10px rgba(180, 132, 12, .3),
        inset 0 0 0 1px rgba(90, 67, 12, .16);
      transform: translateX(0);
      transition:
        transform 340ms cubic-bezier(.22, .9, .28, 1.16),
        box-shadow 300ms ease;
    }

    .knob::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 0;
      border-radius: inherit;
      background: radial-gradient(circle at 34% 28%,
        var(--theme-switch-moon-light),
        var(--theme-switch-moon-mid) 68%,
        var(--theme-switch-moon-edge));
      opacity: 0;
      transform: scale(.94);
      transition:
        opacity 260ms cubic-bezier(.22, .61, .36, 1),
        transform 320ms cubic-bezier(.22, .61, .36, 1);
    }

    input:checked + .track .knob {
      box-shadow:
        0 2px 10px rgba(5, 36, 68, .3),
        inset 0 0 0 1px rgba(38, 74, 105, .18);
      transform: translateX(var(--theme-switch-travel));
    }

    input:checked + .track .knob::before {
      opacity: 1;
      transform: scale(1);
    }

    input:active + .track .knob {
      transform: scale(.9);
    }

    input:checked:active + .track .knob {
      transform: translateX(var(--theme-switch-travel)) scale(.9);
    }

    .moon {
      position: absolute;
      z-index: 1;
      width: 34px;
      height: 34px;
      opacity: 0;
      transform: rotate(-70deg) scale(.5);
      color: var(--theme-switch-moon-detail);
      transition: opacity 240ms ease, transform 360ms cubic-bezier(.22, .9, .28, 1.18);
    }

    .moon .shade {
      fill: currentColor;
      fill-opacity: .08;
    }

    .moon .crater {
      fill: currentColor;
      fill-opacity: .16;
    }

    input:checked + .track .moon {
      opacity: 1;
      transform: rotate(0) scale(1);
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        transition: none !important;
      }
    }
  </style>

  <label class="control">
    <input type="checkbox" role="switch" aria-label="Switch to dark mode">
    <span class="track" aria-hidden="true">
      <svg class="scene day-scene" viewBox="0 0 112 56" preserveAspectRatio="none">
        <path class="far" d="M34 60V49c3-5 7-7 12-6 2-6 7-10 13-10 5 0 9 3 11 7 3-7 8-11 15-11 8 0 13 5 15 12 8-1 14 5 16 12v7Z"></path>
        <path class="mid" d="M31 60V53c3-6 8-10 14-9 2-6 7-10 14-10 6 0 10 3 13 8 3-5 8-8 14-8 8 0 13 5 15 12 7 0 12 4 15 10v4Z"></path>
        <path class="front" d="M28 60v-2c4-7 10-11 17-10 3-7 9-11 16-11 7 0 12 4 15 10 3-5 8-8 14-8 8 0 14 5 16 12 5 0 9 2 12 5v4Z"></path>
        <path class="line-art" d="M58 21q2.4-2.8 4.8 0q2.4-2.8 4.8 0M74 15q2-2.3 4 0q2-2.3 4 0M88 23q1.8-2 3.6 0q1.8-2 3.6 0M98 13q1.4-1.7 2.8 0q1.4-1.7 2.8 0"></path>
      </svg>

      <svg class="scene night-scene" viewBox="0 0 112 56" preserveAspectRatio="none">
        <path class="far" d="M-8 60V46c3-6 8-9 14-8 2-6 7-10 14-10 6 0 11 4 13 9 4-7 10-11 17-11 8 0 14 5 16 13 7 0 13 4 16 10v11Z"></path>
        <path class="mid" d="M-10 60V51c4-7 10-11 17-10 3-7 9-11 16-11 7 0 12 4 15 10 3-5 8-8 14-8 8 0 14 5 16 12 7 0 12 4 15 10v6Z"></path>
        <path class="front" d="M-12 60v-4c4-8 11-12 19-11 3-7 9-11 17-11 7 0 13 4 16 11 3-5 8-8 14-8 8 0 14 5 16 13 5 0 10 2 13 6v4Z"></path>
        <path class="line-art" d="M17 16 40 4M11 28l14-7M44 15l8-4M37 21v5M34.5 23.5h5"></path>
        <circle cx="12" cy="12" r="1.2"></circle>
        <circle cx="28" cy="18" r=".8"></circle>
        <circle cx="48" cy="8" r=".7"></circle>
        <circle cx="55" cy="25" r="1"></circle>
      </svg>

      <span class="knob">
        <svg class="moon" viewBox="0 0 24 24">
          <path class="shade" d="M3.8 13.2c2.8-1.1 4.9-3.8 5.2-7.1 2.2 2.1 3.5 5 3.5 8.1 0 2.4-.8 4.7-2.1 6.5-3.5-.5-6.2-3.5-6.6-7.5Z"></path>
          <circle class="crater" cx="8" cy="8.7" r="1.8"></circle>
          <circle class="crater" cx="15.8" cy="14.5" r="2.6"></circle>
          <circle class="crater" cx="9.3" cy="18" r="1.2"></circle>
          <circle class="crater" cx="17.3" cy="7.4" r=".9"></circle>
        </svg>
      </span>
    </span>
  </label>
`;

class SkyshiftToggle extends HTMLElement {
  static observedAttributes = ["theme"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(skyshiftTemplate.content.cloneNode(true));
    this._input = this.shadowRoot.querySelector("input");
    this._reflecting = false;
    this._connected = false;

    this._handleChange = () => {
      this._setTheme(this._input.checked ? "dark" : "light", {
        emit: true,
        persist: true,
        reflect: true
      });
    };

    this._handleSync = (event) => {
      if (event.detail.source === this) return;
      this._setTheme(event.detail.theme, {
        emit: false,
        persist: false,
        reflect: true
      });
    };

    this._handleStorage = (event) => {
      if (event.key !== this._storageKey()) return;
      if (event.newValue !== "light" && event.newValue !== "dark") return;
      this._setTheme(event.newValue, {
        emit: true,
        persist: false,
        reflect: true
      });
    };
  }

  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    this._input.addEventListener("change", this._handleChange);
    window.addEventListener("skyshift-theme-sync", this._handleSync);
    window.addEventListener("storage", this._handleStorage);

    const initialTheme = this._readInitialTheme();
    this._setTheme(initialTheme, { emit: false, persist: false, reflect: true });
  }

  disconnectedCallback() {
    this._input.removeEventListener("change", this._handleChange);
    window.removeEventListener("skyshift-theme-sync", this._handleSync);
    window.removeEventListener("storage", this._handleStorage);
    this._connected = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== "theme" || oldValue === newValue || this._reflecting || !this._connected) return;
    if (newValue === "light" || newValue === "dark") {
      this._setTheme(newValue, { emit: true, persist: true, reflect: false });
    }
  }

  get theme() {
    return this._theme || "light";
  }

  set theme(value) {
    if (value !== "light" && value !== "dark") {
      throw new TypeError('theme must be "light" or "dark"');
    }
    this._setTheme(value, { emit: true, persist: true, reflect: true });
  }

  toggle() {
    this.theme = this.theme === "dark" ? "light" : "dark";
  }

  _readInitialTheme() {
    const explicitTheme = this.getAttribute("theme");
    if (explicitTheme === "light" || explicitTheme === "dark") return explicitTheme;

    const savedTheme = this._readStoredTheme();
    if (savedTheme) return savedTheme;

    if (this.getAttribute("default-theme") === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    return this.getAttribute("default-theme") === "dark" ? "dark" : "light";
  }

  _storageKey() {
    const value = this.getAttribute("storage-key");
    return value === "" ? null : (value || "theme-mode");
  }

  _readStoredTheme() {
    const key = this._storageKey();
    if (!key) return null;

    try {
      const value = window.localStorage.getItem(key);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  _storeTheme(theme) {
    const key = this._storageKey();
    if (!key) return;

    try {
      window.localStorage.setItem(key, theme);
    } catch {
      // Storage may be blocked in privacy mode; the switch still works.
    }
  }

  _applyTheme(theme) {
    if (this.hasAttribute("no-apply")) return;

    const selector = this.getAttribute("apply-to") || "html";
    let target;

    try {
      target = document.querySelector(selector);
    } catch {
      target = document.documentElement;
    }

    if (!target) target = document.documentElement;
    target.dataset.theme = theme;
    target.style.colorScheme = theme;
  }

  _setTheme(theme, options) {
    if (theme !== "light" && theme !== "dark") return;

    const changed = this._theme !== theme;
    this._theme = theme;
    this._input.checked = theme === "dark";
    this._input.setAttribute("aria-label", theme === "dark"
      ? "Switch to light mode"
      : "Switch to dark mode");

    if (options.reflect && this.getAttribute("theme") !== theme) {
      this._reflecting = true;
      this.setAttribute("theme", theme);
      this._reflecting = false;
    }

    if (options.persist) this._storeTheme(theme);
    this._applyTheme(theme);

    if (options.emit && changed) {
      this.dispatchEvent(new CustomEvent("themechange", {
        bubbles: true,
        composed: true,
        detail: { theme }
      }));
      window.dispatchEvent(new CustomEvent("skyshift-theme-sync", {
        detail: { theme, source: this }
      }));
    }
  }
}

if (!customElements.get("skyshift-toggle")) {
  customElements.define("skyshift-toggle", SkyshiftToggle);
}

globalThis.SkyshiftToggle = SkyshiftToggle;
