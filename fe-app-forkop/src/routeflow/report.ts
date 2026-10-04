import type { StoreType } from '../forkop/services/store.service';

/** An explicit allowlist prevents links, credentials, IPs and logs entering support exports. */
export function createSupportReport(state: StoreType) {
  const info = state.diagnosticsSystemInfo;
  return {
    schema: 'routeflow.support.v1',
    generatedAt: new Date().toISOString(),
    versions: {
      openwrt: info.openwrt_version,
      forkop: info.forkop_version,
      luci: info.luci_app_version,
      singbox: info.sing_box_version,
    },
    services: {
      loaded:
        !state.servicesInfoWidget.loading && !state.servicesInfoWidget.failed,
      forkopRunning: state.servicesInfoWidget.data.forkopRunning === 1,
      singboxRunning: state.servicesInfoWidget.data.singbox === 1,
    },
    diagnostics: state.diagnosticsChecks.map((check, index) => ({
      check: index + 1,
      state: check.state,
      results: check.items.map((item) => item.state),
    })),
    nodes: {
      loaded: !state.sectionsWidget.loading && !state.sectionsWidget.failed,
      groups: state.sectionsWidget.data.length,
      total: state.sectionsWidget.data.reduce(
        (sum, group) => sum + group.outbounds.length,
        0,
      ),
      measured: state.sectionsWidget.data
        .flatMap((group) => group.outbounds)
        .filter((node) => Number.isFinite(node.latency) && node.latency > 0)
        .length,
    },
  };
}
