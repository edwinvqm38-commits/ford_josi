// Pruebas en Chromium: node tests/run.mjs  (requiere playwright)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import { fileURLToPath } from 'url';
import path from 'path';
const file = 'file://' + path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../index.html');
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1024, height: 600 } });
const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => m.type() === 'error' && errs.push(m.text()));
await pg.goto(file); await pg.waitForTimeout(1500);
const r = await pg.evaluate(async () => {
  const out = {}; const t = (n, f) => { try { out[n] = f() === true; } catch (e) { out[n] = 'ERR ' + e.message; } };
  t('decodeDTC P0301', () => decodeDTC(0x03, 0x01) === 'P0301');
  t('isReadOnly consulta', () => ['0100', '010C', '03', '07', '0902', 'ATZ', 'AT SP0'].every(ELM327.isReadOnly));
  t('isReadOnly bloquea', () => ['04', '2E1234', '3101', '1001', '14FFFF', '0805', '2F'].every(c => !ELM327.isReadOnly(c)));
  S.allowClearDtc = false; const e = new ELM327({ write() {}, }, () => {}); let sent = false; e.send = async () => { sent = true; return '44'; };
  out['clearDTCs bloqueado por defecto'] = (await e.clearDTCs()) === false && !sent;
  S.allowClearDtc = true; out['clearDTCs con permiso'] = (await e.clearDTCs()) === true && sent; S.allowClearDtc = false;
  out['defecto allowClearDtc=false'] = DEFAULTS.allowClearDtc === false;
  return out;
});
let fail = 0; for (const [k, v] of Object.entries(r)) { console.log(v === true ? 'OK  ' : 'FAIL', k, v === true ? '' : v); if (v !== true) fail++; }
console.log('Errores de consola/página:', errs.length ? errs : 'ninguno'); if (errs.length) fail++;
await pg.screenshot({ path: process.argv[2] || 'tests/baseline-1024x600.png' }); await b.close(); process.exit(fail ? 1 : 0);
