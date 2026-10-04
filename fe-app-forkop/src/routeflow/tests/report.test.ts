import { describe, it, expect } from 'vitest';
import type { StoreType } from '../../forkop/services/store.service';
import { createSupportReport } from '../report';

describe('support report privacy', () => {
  it('includes health summaries while excluding proxy links and detailed diagnostic values', () => {
    const state = {
      diagnosticsSystemInfo: {openwrt_version:'25.12',forkop_version:'1',luci_app_version:'1',sing_box_version:'1'},
      servicesInfoWidget: {loading:false,failed:false,data:{forkopRunning:1,singbox:0,password:'SECRET'}},
      diagnosticsChecks: [{state:'error',title:'private.example',items:[{state:'error',value:'192.168.2.1 SECRET'}]}],
      sectionsWidget: {loading:false,failed:false,data:[{subscriptionUrl:'https://secret.example/SECRET',outbounds:[{latency:42,link:'vless://SECRET',displayName:'PRIVATE'}]}]},
    } as unknown as StoreType;
    const report = createSupportReport(state);
    expect(report.nodes.measured).toBe(1);
    expect(report.services.singboxRunning).toBe(false);
    expect(JSON.stringify(report)).not.toMatch(/SECRET|PRIVATE|192\.168|private\.example|secret\.example/);
    expect(report.diagnostics).toEqual([{check:1,state:'error',results:['error']}]);
  });
});
