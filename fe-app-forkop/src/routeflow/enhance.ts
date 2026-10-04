const nodeSelector = '.fkp_dashboard-page__outbound-grid__item';
const storageKey = 'routeflow.preferences.v1';
const cleanupHandlers = new WeakMap<HTMLElement, () => void>();

export function filterNodes(root: ParentNode, query: string): number {
  const needle = query.trim().toLocaleLowerCase();
  let visible = 0;
  root.querySelectorAll<HTMLElement>(nodeSelector).forEach((node) => {
    const match = (node.textContent ?? '').toLocaleLowerCase().includes(needle);
    node.classList.toggle('rf-search-hidden', !match);
    if (match) visible++;
  });
  return visible;
}

export function enhanceRouteflow(root: HTMLElement, getReport?: () => unknown) {
  if (root.querySelector(':scope > .rf-toolbar')) return;
  cleanupHandlers.get(root)?.();
  root.classList.add('rf-shell');
  let theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let compact = false;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    if (saved?.theme === 'light' || saved?.theme === 'dark') theme = saved.theme;
    compact = saved?.compact === true;
  } catch { /* LuCI also works when browser storage is unavailable. */ }

  const toolbar = document.createElement('header');
  toolbar.className = 'rf-toolbar';
  toolbar.innerHTML = '<div class="rf-brand"><span class="rf-mark" aria-hidden="true">↗</span><div><strong>Routeflow</strong><small>Управление сетью · на основе Forkop</small></div></div><div class="rf-controls"></div>';
  const controls = toolbar.querySelector('.rf-controls')!;
  const themeButton = document.createElement('button');
  const densityButton = document.createElement('button');
  [themeButton, densityButton].forEach((button) => {
    button.type = 'button'; button.className = 'rf-control'; controls.append(button);
  });
  function apply() {
    root.dataset.rfTheme = theme;
    root.dataset.rfDensity = compact ? 'compact' : 'comfortable';
    themeButton.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    densityButton.textContent = 'Компактный вид';
    densityButton.setAttribute('aria-pressed', String(compact));
    try { localStorage.setItem(storageKey, JSON.stringify({ theme, compact })); } catch { /* optional */ }
  }
  themeButton.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; apply(); });
  densityButton.addEventListener('click', () => { compact = !compact; apply(); });
  root.prepend(toolbar);
  apply();
  if (getReport) {
    const report = document.createElement('button');
    report.type = 'button'; report.className = 'rf-control'; report.textContent = 'Отчёт для поддержки';
    report.title = 'Скачать версии и результаты проверок без ссылок прокси, паролей и журналов';
    report.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(getReport(), null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'routeflow-support.json';
      link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    controls.append(report);
  }

  const dashboard = root.querySelector<HTMLElement>('.fkp_dashboard-page');
  if (!dashboard) return;
  const search = document.createElement('div');
  search.className = 'rf-search';
  const input = document.createElement('input');
  input.type = 'search'; input.placeholder = 'Найти узел: название, страна, протокол…';
  input.setAttribute('aria-label', 'Поиск узлов');
  const count = document.createElement('span');
  const favoriteFilter = document.createElement('button');
  favoriteFilter.type = 'button'; favoriteFilter.className = 'rf-control'; favoriteFilter.textContent = 'Только избранные';
  favoriteFilter.setAttribute('aria-pressed', 'false');
  const sort = document.createElement('select');
  sort.className = 'rf-control'; sort.setAttribute('aria-label', 'Сортировка узлов');
  sort.innerHTML = '<option value="original">Порядок подписки</option><option value="latency">Сначала быстрые</option>';
  const favoriteKey = 'routeflow.favorites.v1';
  let favorites: Set<string> = new Set();
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(favoriteKey) ?? '[]');
    if (Array.isArray(saved)) favorites = new Set(saved.filter((item): item is string => typeof item === 'string'));
  } catch { /* optional */ }
  let onlyFavorites = false;
  // Updating text must not generate live-region announcements every polling cycle.
  const update = () => {
    filterNodes(dashboard, input.value);
    const nodes = [...dashboard.querySelectorAll<HTMLElement>(nodeSelector)];
    nodes.forEach((node) => {
      const key = node.dataset.rfKey ?? node.querySelector('b')?.textContent ?? '';
      const favorite = favorites.has(key);
      let button = node.querySelector<HTMLButtonElement>('.rf-favorite');
      if (!button) {
        button = document.createElement('button'); button.type = 'button'; button.className = 'rf-favorite';
        button.addEventListener('click', (event) => {
          event.stopPropagation(); event.preventDefault();
          if (favorites.has(key)) favorites.delete(key); else favorites.add(key);
          try {localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));} catch { /* optional */ }
          update();
        });
        node.append(button);
      }
      const label = favorite ? 'Убрать из избранного' : 'Добавить в избранное';
      button.setAttribute('aria-label', label); button.title = label;
      button.setAttribute('aria-pressed', String(favorite));
      if (button.textContent !== (favorite ? '★' : '☆')) button.textContent = favorite ? '★' : '☆';
      if (onlyFavorites && !favorite) node.classList.add('rf-search-hidden');
    });
    dashboard.querySelectorAll<HTMLElement>('.fkp_dashboard-page__outbound-grid').forEach((grid) => {
      const children = [...grid.querySelectorAll<HTMLElement>(nodeSelector)];
      children.forEach((node, index) => { if (node.dataset.rfOriginal === undefined) node.dataset.rfOriginal = String(index); });
      const original = (node: HTMLElement) => Number(node.dataset.rfOriginal);
      const latency = (node: HTMLElement) => {
        const value = Number(node.dataset.rfLatency);
        return Number.isFinite(value) && value > 0 ? value : Infinity;
      };
      const ordered = [...children].sort((a, b) => sort.value === 'latency'
        ? (latency(a) - latency(b) || original(a) - original(b)) : original(a) - original(b));
      if (ordered.some((node, index) => node !== children[index])) ordered.forEach((node) => grid.append(node));
    });
    const visible = nodes.filter((node) => !node.classList.contains('rf-search-hidden')).length;
    const text = input.value.trim() || onlyFavorites ? `Найдено узлов: ${visible}` : '';
    if (count.textContent !== text) count.textContent = text;
  };
  search.append(input, favoriteFilter, sort, count); dashboard.prepend(search);
  input.addEventListener('input', update);
  favoriteFilter.addEventListener('click', (event) => {
    event.preventDefault(); onlyFavorites = !onlyFavorites;
    favoriteFilter.setAttribute('aria-pressed', String(onlyFavorites)); update();
  });
  sort.addEventListener('change', update);
  const observer = new MutationObserver((records) => {
    if (records.some((record) => !search.contains(record.target))) update();
  });
  observer.observe(dashboard, { childList: true, subtree: true, characterData: true });
  update();
  const cleanup = new MutationObserver(() => {
    if (!root.isConnected || !dashboard.isConnected) { observer.disconnect(); cleanup.disconnect(); }
  });
  cleanupHandlers.set(root, () => { observer.disconnect(); cleanup.disconnect(); });
  cleanup.observe(document.body, { childList: true, subtree: true });
}
