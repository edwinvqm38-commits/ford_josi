// Medición de rendimiento (Chromium de escritorio + emulación de CPU lenta). NO equivale a una tablet real.
// node tests/perf.mjs
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('playwright'); import path from 'path'; import { fileURLToPath } from 'url'; import fs from 'fs';
const dir = path.dirname(fileURLToPath(import.meta.url)), FILE = path.resolve(dir, '../index.html');
const b = await chromium.launch(); const rows = [];
for (const rate of [1, 4]) for (const lv of ['off', 'standard', 'premium']) {
  const pg = await b.newPage({ viewport: { width: 1024, height: 600 } }); const cdp = await pg.context().newCDPSession(pg);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await pg.addInitScript(l => localStorage.setItem('ecodrive.settings.v1', JSON.stringify({ welcomed: true, theme: 'luxury', nightAuto: false, anim: l })), lv);
  const t0 = Date.now(); await pg.goto('file://' + FILE); await pg.waitForFunction(() => document.querySelector('#view')?.children.length > 0);
  const load = Date.now() - t0;
  await pg.getByText('Conectar', { exact: true }).first().click(); await pg.getByText('Iniciar simulación').click(); await pg.waitForTimeout(2000);
  const r = await pg.evaluate(() => new Promise(res => { let n = 0, worst = 0, last = performance.now(); const t0 = last;
    (function f(t) { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < 4000) requestAnimationFrame(f); else res({ fps: +(n / ((t - t0) / 1000)).toFixed(1), worstMs: Math.round(worst), heapMB: performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : null }); })(t0); }));
  rows.push({ cpu: rate + 'x', anim: lv, loadMs: load, ...r }); await pg.close();
}
await b.close(); console.table(rows); console.log('index.html:', (fs.statSync(FILE).size / 1048576).toFixed(2), 'MB');
