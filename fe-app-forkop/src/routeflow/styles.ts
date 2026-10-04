/** Scoped presentation layer; backend and UCI package remain Forkop-compatible. */
export const RouteflowStyles = `
.rf-shell {
 --rf-bg:#f3f6fa; --rf-card:#fff; --rf-ink:#17243c; --rf-muted:#65748b;
 --rf-line:#e1e7ef; --rf-accent:#087f8c; --rf-soft:#e6f5f4; --rf-space:20px;
 --background-color-low:var(--rf-line); --text-color-high:var(--rf-ink);
 --text-color-medium:var(--rf-muted); --primary-color-high:var(--rf-accent);
 --success-color-medium:#16825d; --error-color-medium:#d34455;
 color:var(--rf-ink); background:var(--rf-bg); padding:24px;
 border-radius:24px; font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;
}
.rf-shell[data-rf-theme="dark"] {
 --rf-bg:#101827; --rf-card:#192437; --rf-ink:#edf3fc; --rf-muted:#a2b2c9;
 --rf-line:#304057; --rf-accent:#54d4cb; --rf-soft:#203c43;
 --success-color-medium:#62d5a5; --error-color-medium:#ff8290; color-scheme:dark;
}
.rf-shell[data-rf-density="compact"] { --rf-space:12px; }
.rf-toolbar { display:flex; gap:20px; align-items:center; justify-content:space-between;
 padding-bottom:24px; margin-bottom:20px; border-bottom:1px solid var(--rf-line); }
.rf-brand {display:flex; align-items:center; gap:14px;}
.rf-mark { width:44px; height:44px; display:grid; place-items:center; border-radius:14px;
 background:var(--rf-accent);color:var(--rf-card);font-size:25px;font-weight:800; }
.rf-brand strong {display:block;font-size:24px;letter-spacing:-1px;line-height:1.3;}
.rf-brand small {color:var(--rf-muted);font-size:12px;}
.rf-controls {display:flex;flex-wrap:wrap;gap:8px;}
.rf-shell .rf-control { border:1px solid var(--rf-line); background:var(--rf-card);
 color:var(--rf-ink); border-radius:10px;padding:10px 14px;cursor:pointer;min-height:42px; }
.rf-shell .rf-control[aria-pressed="true"] {background:var(--rf-soft);border-color:var(--rf-accent);}
.rf-shell :is(button,input,select,a):focus-visible {outline:3px solid var(--rf-accent);outline-offset:3px;}
.rf-shell h2 {font-size:18px;color:var(--rf-muted);font-weight:500;}
.rf-shell .cbi-map-descr {color:var(--rf-muted);}
.rf-shell .cbi-tabmenu {display:flex;flex-wrap:wrap;gap:6px;border:0;padding:8px 0;}
.rf-shell .cbi-tabmenu li {border:0;background:transparent;border-radius:10px;}
.rf-shell .cbi-tabmenu li a {color:var(--rf-muted);padding:10px 16px;display:block;}
.rf-shell .cbi-tabmenu .cbi-tab {background:var(--rf-soft);}
.rf-shell .cbi-tabmenu .cbi-tab a {color:var(--rf-accent);font-weight:700;}
.rf-shell .fkp_dashboard-page__widgets-section {gap:14px;margin-top:18px;}
.rf-shell :is(.fkp_dashboard-page__widgets-section__item,.fkp_dashboard-page__outbound-section) {
 background:var(--rf-card);border:1px solid var(--rf-line);border-radius:18px;padding:var(--rf-space);
 box-shadow:0 4px 20px #00000004;
}
.rf-shell .fkp_dashboard-page__widgets-section__item__title {font-weight:700;margin-bottom:14px;font-size:14px;}
.rf-shell .fkp_dashboard-page__widgets-section__item__row {display:flex;justify-content:space-between;gap:10px;padding:5px 0;}
.rf-shell .fkp_dashboard-page__widgets-section__item__row__key {color:var(--rf-muted);}
.rf-shell .fkp_dashboard-page__widgets-section__item__row__value {font-variant-numeric:tabular-nums;font-weight:600;}
.rf-shell .fkp_dashboard-page__outbound-section {margin-top:18px;}
.rf-shell .fkp_dashboard-page__outbound-section__title-section {margin-bottom:16px;flex-wrap:wrap;}
.rf-shell .fkp_dashboard-page__outbound-section__title-section__title {font-size:18px;letter-spacing:-.4px;}
.rf-shell .fkp_dashboard-page__outbound-grid {gap:12px;}
.rf-shell .fkp_dashboard-page__outbound-grid__item {padding:var(--rf-space);border:1px solid var(--rf-line);border-radius:14px;background:var(--rf-card);}
.rf-shell .fkp_dashboard-page__outbound-grid__item--active {border:2px solid var(--rf-accent);background:var(--rf-soft);}
.rf-shell .fkp_dashboard-page__outbound-grid__item--selectable:hover {border-color:var(--rf-accent);box-shadow:0 4px 16px #087f8c12;}
.rf-shell .fkp_dashboard-page__outbound-grid__item__type {color:var(--rf-muted);font-size:12px;}
.rf-shell .fkp_dashboard-page__outbound-grid__item__latency {font-variant-numeric:tabular-nums;}
.rf-shell .btn {border-radius:9px;box-shadow:none;}
.rf-shell .rf-search {margin:18px 0 6px;display:flex;flex-wrap:wrap;align-items:center;gap:12px;}
.rf-shell .rf-search input {box-sizing:border-box;width:min(100%,360px);padding:12px 16px;
 border:1px solid var(--rf-line);background:var(--rf-card);color:var(--rf-ink);border-radius:12px;font:inherit;}
.rf-shell .rf-search span {color:var(--rf-muted);font-size:13px;}
.rf-shell .rf-search-hidden {display:none !important;}
.rf-shell .rf-favorite {display:block;margin-top:12px;padding:4px 10px;border:1px solid var(--rf-line);
 border-radius:8px;background:var(--rf-card);color:var(--rf-muted);font-size:20px;cursor:pointer;min-height:36px;}
.rf-shell .rf-favorite[aria-pressed="true"] {color:var(--rf-accent);background:var(--rf-soft);}
.rf-shell .cbi-value {padding-top:10px;padding-bottom:10px;}
.rf-shell .cbi-value-description {color:var(--rf-muted);}
@media(max-width:700px) {
 .rf-shell {padding:14px;border-radius:16px;}
 .rf-toolbar {align-items:flex-start;flex-direction:column;gap:14px;padding-bottom:18px;}
 .rf-controls {width:100%;} .rf-controls button {flex:1;}
 .rf-shell .fkp_dashboard-page__outbound-section__title-section__actions {flex-wrap:wrap;justify-content:flex-start;}
 .rf-shell .fkp_dashboard-page .btn.fkp_dashboard-page__outbound-grid__item__copy-button {min-width:36px;min-height:36px;}
}
@media(prefers-reduced-motion:reduce) {
 .rf-shell *, .rf-shell *::before, .rf-shell *::after {transition:none !important;animation:none !important;}
}
`;
