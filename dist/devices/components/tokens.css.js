// Styles shared by every component. A host page can restyle them through these custom properties.
export const base = new CSSStyleSheet()
base.replaceSync(`
:host {
  --_bg: var(--io-surface, light-dark(#ffffff, #1b1f26));
  --_raised: var(--io-raised, light-dark(#eef1f4, #262b34));
  --_line: var(--io-line, light-dark(#d9dee4, #333a45));
  --_text: var(--io-text, light-dark(#1a1f27, #e8ebef));
  --_muted: var(--io-muted, light-dark(#667180, #98a2b0));
  --_accent: var(--io-accent, light-dark(#0b7a6b, #3ccbb4));
  --_on-accent: var(--io-on-accent, light-dark(#ffffff, #06211d));
  color-scheme: light dark;
  color: var(--_text);
  font: 14px/1.45 var(--io-font, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif);
}
* { box-sizing: border-box; }
button, select, input { font: inherit; color: inherit; }
button {
  min-height: 34px; padding: 0 12px; border: 1px solid var(--_line); border-radius: 8px;
  background: var(--_bg); cursor: pointer;
}
button:hover:not(:disabled) { border-color: var(--_accent); }
button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid var(--_accent); outline-offset: 1px; }
button:disabled, input:disabled, select:disabled { opacity: .5; cursor: not-allowed; }
button.active { background: var(--_accent); border-color: var(--_accent); color: var(--_on-accent); }
.label { display: flex; justify-content: space-between; gap: 8px; color: var(--_muted); font-size: 13px; }
.label output { color: var(--_text); font-variant-numeric: tabular-nums; }
.field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.inline { flex-direction: row; align-items: center; justify-content: space-between; }
.buttons { display: flex; flex-wrap: wrap; gap: 6px; }
`)
