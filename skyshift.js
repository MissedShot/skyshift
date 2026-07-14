(() => {
if (
  typeof window === "undefined" ||
  typeof document === "undefined" ||
  typeof HTMLElement === "undefined" ||
  typeof customElements === "undefined"
) return;

const registeredToggle = customElements.get("skyshift-toggle");
if (registeredToggle) {
  globalThis.SkyshiftToggle = registeredToggle;
  return;
}

const skyshiftTemplate = document.createElement("template");

skyshiftTemplate.innerHTML = `
  <style>
    :host {
      --theme-switch-width: 112px;
      --theme-switch-height: 56px;
      --theme-switch-knob-size: 44px;
      --theme-switch-inset: 5px;
      --theme-switch-border-width: 1px;
      --theme-switch-travel: calc(
        var(--theme-switch-width) -
        var(--theme-switch-knob-size) -
        var(--theme-switch-inset) -
        var(--theme-switch-inset) -
        var(--theme-switch-border-width) -
        var(--theme-switch-border-width)
      );

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
      --theme-switch-focus: #0868d4;
      --theme-switch-hover-ring: rgba(8, 104, 212, .18);

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
      border: var(--theme-switch-border-width) solid var(--theme-switch-day-border);
      border-radius: 999px;
      background: linear-gradient(135deg,
        var(--theme-switch-day-top),
        var(--theme-switch-day-bottom));
      box-shadow:
        inset 0 1px 2px rgba(70, 50, 10, .1),
        0 2px 4px rgba(0, 0, 0, .1),
        0 6px 14px rgba(0, 0, 0, .14);
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

    .track::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      border-radius: inherit;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, .5),
        inset 0 -1px 0 rgba(92, 68, 10, .08);
      pointer-events: none;
      transition: box-shadow 320ms ease;
    }

    input:focus-visible + .track {
      outline: 3px solid var(--theme-switch-focus);
      outline-offset: 3px;
    }

    input:checked + .track {
      border-color: var(--theme-switch-night-border);
      box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, .1),
        0 2px 4px rgba(0, 0, 0, .1),
        0 6px 14px rgba(0, 0, 0, .14);
    }

    input:checked + .track::before {
      opacity: 1;
    }

    input:checked + .track::after {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, .22),
        inset 0 -1px 0 rgba(0, 22, 43, .2);
    }

    .scene {
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      pointer-events: none;
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
      transition: opacity 220ms ease, transform 360ms ease;
    }

    .day-scene .far { fill: var(--theme-switch-day-cloud-far); }
    .day-scene .mid { fill: var(--theme-switch-day-cloud-mid); }
    .day-scene .front { fill: var(--theme-switch-day-cloud-front); }
    .day-scene .line-art { stroke: var(--theme-switch-day-ink); }

    .night-scene {
      opacity: 0;
      transform: translateX(-8px);
      color: var(--theme-switch-night-ink);
      transition: opacity 90ms ease, transform 360ms ease;
    }

    .night-scene .far { fill: var(--theme-switch-night-cloud-far); }
    .night-scene .mid { fill: var(--theme-switch-night-cloud-mid); }
    .night-scene .front { fill: var(--theme-switch-night-cloud-front); }
    .night-scene .line-art { stroke: var(--theme-switch-night-ink); }
    .night-scene circle { fill: var(--theme-switch-night-ink); }

    input:checked + .track .day-scene {
      opacity: 0;
      transform: translateX(8px);
      transition: opacity 90ms ease, transform 360ms ease;
    }

    input:checked + .track .night-scene {
      opacity: .96;
      transform: translateX(0);
      transition: opacity 220ms ease, transform 360ms ease;
    }

    .knob {
      position: absolute;
      top: 50%;
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
        inset 0 0 0 1px color-mix(in srgb,
          var(--theme-switch-day-ink) 34%, transparent);
      translate: 0 -50%;
      scale: 1;
      transition:
        translate 340ms cubic-bezier(.2, .85, .25, 1.08),
        scale 140ms cubic-bezier(.2, .8, .2, 1),
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

    .knob::after {
      content: "";
      position: absolute;
      inset: 1px;
      z-index: 0;
      border-radius: inherit;
      background: radial-gradient(circle at 34% 26%,
        rgba(255, 255, 255, .48),
        rgba(255, 255, 255, .12) 28%,
        transparent 48%);
      opacity: .72;
      pointer-events: none;
      transition: opacity 260ms ease;
    }

    input:checked + .track .knob {
      box-shadow:
        0 2px 10px rgba(5, 36, 68, .3),
        inset 0 0 0 1px color-mix(in srgb,
          var(--theme-switch-moon-detail) 36%, transparent);
      translate: var(--theme-switch-travel) -50%;
    }

    input:checked + .track .knob::before {
      opacity: 1;
      transform: scale(1);
    }

    input:checked + .track .knob::after {
      opacity: .24;
    }

    input:active + .track .knob {
      scale: .92;
    }

    .moon {
      position: absolute;
      z-index: 1;
      width: 78%;
      height: 78%;
      opacity: 0;
      transform: rotate(-70deg) scale(.5);
      color: var(--theme-switch-moon-detail);
      transition: opacity 240ms ease, transform 360ms cubic-bezier(.22, .9, .28, 1.18);
    }

    .moon .shade {
      fill: currentColor;
      fill-opacity: .11;
    }

    .moon .crater {
      fill: currentColor;
      fill-opacity: .24;
    }

    input:checked + .track .moon {
      opacity: 1;
      transform: rotate(0) scale(1);
    }

    @media (hover: hover) and (pointer: fine) {
      .control:hover .track {
        box-shadow:
          inset 0 1px 2px rgba(70, 50, 10, .1),
          0 2px 4px rgba(0, 0, 0, .1),
          0 6px 14px rgba(0, 0, 0, .14),
          0 0 0 4px var(--theme-switch-hover-ring);
      }

      .control:hover input:checked + .track {
        box-shadow:
          inset 0 1px 2px rgba(255, 255, 255, .1),
          0 2px 4px rgba(0, 0, 0, .1),
          0 6px 14px rgba(0, 0, 0, .14),
          0 0 0 4px var(--theme-switch-hover-ring);
      }

      .control:hover input:focus-visible + .track {
        box-shadow:
          inset 0 1px 2px rgba(70, 50, 10, .1),
          0 2px 4px rgba(0, 0, 0, .1),
          0 6px 14px rgba(0, 0, 0, .14);
      }

      .control:hover input:checked:focus-visible + .track {
        box-shadow:
          inset 0 1px 2px rgba(255, 255, 255, .1),
          0 2px 4px rgba(0, 0, 0, .1),
          0 6px 14px rgba(0, 0, 0, .14);
      }
    }

    @media (forced-colors: active) {
      .track,
      input:checked + .track,
      .control:hover .track,
      .control:hover input:checked + .track {
        border-color: CanvasText;
        background: Canvas;
        box-shadow: none;
        forced-color-adjust: none;
      }

      .track::before {
        background: Canvas;
      }

      .track::after,
      .scene,
      .moon,
      .knob::after {
        display: none;
      }

      .knob,
      input:checked + .track .knob {
        background: CanvasText;
        box-shadow: none;
      }

      input:checked + .track .knob::before {
        background: Highlight;
      }

      input:focus-visible + .track {
        outline-color: Highlight;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        transition: none !important;
      }
    }
  </style>

  <label class="control">
    <input type="checkbox" role="switch" aria-label="Dark mode">
    <span class="track" aria-hidden="true">
      <svg class="scene day-scene" viewBox="0 0 112 56" preserveAspectRatio="none">
        <path class="far" d="M33 60V50C36 44 41 41 47 43C49 35 53 31 59 32C65 32 70 36 73 41C77 33 83 29 90 29C98 29 103 36 104 43C111 42 116 47 118 54V60Z"></path>
        <path class="mid" d="M30 60V54C33 49 37 46 42 46C45 41 49 39 54 39C59 39 63 42 65 46C68 39 73 34 79 34C85 34 90 40 91 46C95 41 100 39 105 41C111 43 115 49 118 56V60Z"></path>
        <path class="front" d="M27 60V58C32 52 38 49 45 50C49 42 57 38 66 38C75 38 81 44 83 51C87 46 93 43 99 44C108 44 114 50 118 57V60Z"></path>
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
  static observedAttributes = ["theme", "label", "aria-label"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(skyshiftTemplate.content.cloneNode(true));
    this._input = this.shadowRoot.querySelector("input");
    this._reflecting = false;
    this._connected = false;
    this._initialized = false;
    this._followsSystem = false;
    this._systemThemeQuery = null;

    this._handleChange = () => {
      this._stopFollowingSystem();
      this._setTheme(this._input.checked ? "dark" : "light", {
        notify: true,
        persist: true,
        reflect: true,
        synchronize: true
      });
    };

    this._handleSync = (event) => {
      const detail = event.detail;
      const storageKey = this._storageKey();
      if (
        !detail ||
        !storageKey ||
        detail.source === this ||
        detail.storageKey !== storageKey
      ) return;

      this._stopFollowingSystem();
      this._setTheme(detail.theme, {
        notify: true,
        persist: false,
        reflect: true,
        synchronize: false
      });
    };

    this._handleStorage = (event) => {
      const storageKey = this._storageKey();
      if (!storageKey || event.key !== storageKey) return;

      try {
        if (event.storageArea !== window.localStorage) return;
      } catch {
        return;
      }

      if (event.newValue !== "light" && event.newValue !== "dark") return;
      this._stopFollowingSystem();
      this._setTheme(event.newValue, {
        notify: true,
        persist: false,
        reflect: true,
        synchronize: false
      });
    };

    this._handleSystemThemeChange = (event) => {
      if (!this._followsSystem) return;
      if (this._readStoredTheme()) {
        this._stopFollowingSystem();
        return;
      }

      this._setTheme(event.matches ? "dark" : "light", {
        notify: true,
        persist: false,
        reflect: true,
        synchronize: false
      });
    };
  }

  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    this._input.addEventListener("change", this._handleChange);
    window.addEventListener("skyshift-theme-sync", this._handleSync);
    window.addEventListener("storage", this._handleStorage);

    this._updateAccessibleName();
    let initialTheme;
    if (!this._initialized) {
      initialTheme = this._readInitialTheme();
      this._initialized = true;
    } else {
      const savedTheme = this._readStoredTheme();
      if (savedTheme) {
        this._stopFollowingSystem();
        initialTheme = savedTheme;
      } else if (this._followsSystem) {
        initialTheme = this._systemTheme();
      } else {
        initialTheme = this.theme;
      }
    }

    if (this._followsSystem) {
      this._getSystemThemeQuery().addEventListener("change", this._handleSystemThemeChange);
    }
    this._setTheme(initialTheme, {
      notify: false,
      persist: false,
      reflect: true,
      synchronize: false
    });
  }

  disconnectedCallback() {
    this._input.removeEventListener("change", this._handleChange);
    window.removeEventListener("skyshift-theme-sync", this._handleSync);
    window.removeEventListener("storage", this._handleStorage);
    this._systemThemeQuery?.removeEventListener("change", this._handleSystemThemeChange);
    this._connected = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "label" || name === "aria-label") {
      this._updateAccessibleName();
      return;
    }

    if (name !== "theme" || this._reflecting || !this._connected) return;
    if (newValue === "light" || newValue === "dark") {
      this._stopFollowingSystem();
      this._setTheme(newValue, {
        notify: true,
        persist: true,
        reflect: false,
        synchronize: true
      });
    }
  }

  get theme() {
    return this._theme || "light";
  }

  set theme(value) {
    if (value !== "light" && value !== "dark") {
      throw new TypeError('theme must be "light" or "dark"');
    }
    this._stopFollowingSystem();
    this._setTheme(value, {
      notify: true,
      persist: true,
      reflect: true,
      synchronize: true
    });
  }

  toggle() {
    this.theme = this.theme === "dark" ? "light" : "dark";
  }

  _readInitialTheme() {
    const explicitTheme = this.getAttribute("theme");
    if (explicitTheme === "light" || explicitTheme === "dark") {
      this._stopFollowingSystem();
      return explicitTheme;
    }

    const savedTheme = this._readStoredTheme();
    if (savedTheme) {
      this._stopFollowingSystem();
      return savedTheme;
    }

    if (this.getAttribute("default-theme") === "system") {
      this._followsSystem = true;
      return this._systemTheme();
    }

    this._stopFollowingSystem();
    return this.getAttribute("default-theme") === "dark" ? "dark" : "light";
  }

  _getSystemThemeQuery() {
    if (!this._systemThemeQuery) {
      this._systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    }
    return this._systemThemeQuery;
  }

  _systemTheme() {
    return this._getSystemThemeQuery().matches ? "dark" : "light";
  }

  _stopFollowingSystem() {
    this._followsSystem = false;
    this._systemThemeQuery?.removeEventListener("change", this._handleSystemThemeChange);
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

  _updateAccessibleName() {
    const label = this.getAttribute("label") || this.getAttribute("aria-label");
    this._input.setAttribute("aria-label", label?.trim() || "Dark mode");
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

  _setTheme(theme, {
    notify = false,
    persist = false,
    reflect = false,
    synchronize = false
  } = {}) {
    if (theme !== "light" && theme !== "dark") return;

    const changed = this._theme !== theme;
    this._theme = theme;
    this._input.checked = theme === "dark";

    if (reflect && this.getAttribute("theme") !== theme) {
      this._reflecting = true;
      this.setAttribute("theme", theme);
      this._reflecting = false;
    }

    if (persist) this._storeTheme(theme);
    this._applyTheme(theme);

    if (notify && changed) {
      this.dispatchEvent(new CustomEvent("themechange", {
        bubbles: true,
        composed: true,
        detail: { theme }
      }));
    }

    if (synchronize && changed) {
      const storageKey = this._storageKey();
      if (storageKey) {
        window.dispatchEvent(new CustomEvent("skyshift-theme-sync", {
          detail: { theme, storageKey, source: this }
        }));
      }
    }
  }
}

customElements.define("skyshift-toggle", SkyshiftToggle);
globalThis.SkyshiftToggle = customElements.get("skyshift-toggle");
})();
