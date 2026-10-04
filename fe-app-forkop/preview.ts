import { styles as DashboardStyles } from './src/forkop/tabs/dashboard/styles';
import { RouteflowStyles } from './src/routeflow/styles';
import { enhanceRouteflow } from './src/routeflow/enhance';

const style = document.createElement('style');
style.textContent = DashboardStyles + RouteflowStyles;
document.head.append(style);
document.querySelectorAll<HTMLElement>('.fkp_dashboard-page__outbound-grid__item').forEach((node, index) => {
  node.dataset.rfKey = `demo-${index}`;
  node.dataset.rfLatency = node.querySelector('.fkp_dashboard-page__outbound-grid__item__latency--green')?.textContent?.match(/\d+/)?.[0] ?? '';
});
enhanceRouteflow(document.getElementById('cbi-forkop')!, () => ({demo: true, note: 'Предпросмотр, соединения с роутером нет'}));
