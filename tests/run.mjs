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
  const sim = App.transport; for (const th of ['luxury', 'sport', 'classic', 'nightdrive', 'estandar']) { S.theme = th; applyTheme(); out['tema ' + th] = document.body.dataset.theme === th && getComputedStyle(document.body).getPropertyValue('--accent').trim() === THEMES[th][2]; }
  out['cambio de tema no toca el transporte'] = App.transport === sim;
  for (const lv of ['off', 'premium', 'standard']) { S.anim = lv; applyTheme(); out['animación ' + lv] = document.body.dataset.anim === lv && (lv !== 'off' || Fx.reduced() === true); }
  S.anim = 'off'; out['gráficas sin animar en off'] = chartAnim('bar') === false;
  S.anim = 'standard'; out['gráficas estándar'] = chartAnim('bar').duration === 450;
  S.anim = 'premium'; out['gráficas premium: línea progresiva'] = typeof chartAnim('line', 10).x.delay === 'function' && chartAnim('bar').duration === 900; S.anim = 'standard';
  { const d = document.createElement('div'); d.style.cssText = 'position:fixed;left:0;top:0;width:300px;height:150px'; document.body.appendChild(d); const n0 = charts.length; const mk = () => { const w = document.createElement('div'); w.style.cssText = 'width:300px;height:150px'; w.innerHTML = '<canvas></canvas>'; d.appendChild(w); return w; };
    for (const lv of ['off', 'standard', 'premium']) { S.anim = lv; try { lineChart(mk(), [1, 2, 3, 4], [3, 5, 4, 6]); barChart(mk(), ['a', 'b'], [1, 2]); } catch (e) { out['gráficas ' + lv] = 'ERR ' + e.message; continue; } }
    out['gráficas se crean en los 3 niveles'] = charts.length - n0 === 6; destroyCharts(); d.remove(); S.anim = 'standard'; }
  for (const lv of ['off', 'strong', 'soft']) { S.ambient = lv; applyTheme(); out['ambiente ' + lv] = document.body.dataset.amb === lv && !!document.getElementById('ambient'); }
  { const t = document.createElement('div'); t.className = 'tile'; t.innerHTML = '<i class="meter"><b id="zzM"></b></i>'; document.body.appendChild(t); meter('zz', 0.5, 'info'); out['meter fija --f'] = t.style.getPropertyValue('--f') === '0.500'; t.remove(); }
  for (const bg of ['plain', 'carbon', 'grid', 'aurora', 'default']) { S.bg = bg; applyTheme(); out['fondo ' + bg] = document.body.dataset.bg === bg; }
  S.accent = '#38e0d0'; applyTheme(); out['acento personalizado'] = document.body.style.getPropertyValue('--accent') === '#38e0d0' && C.accent === '#38e0d0' && document.body.style.getPropertyValue('--acc') === '56,224,208' && ACC_RGB.join() === '56,224,208';
  S.accent = 'malo'; applyTheme(); out['acento inválido se ignora'] = document.body.style.getPropertyValue('--accent') === ''; S.accent = ''; applyTheme();
  out['tipografía Barlow cargada'] = document.fonts.check('600 20px "Barlow Condensed"') && document.fonts.check('500 15px "Barlow"');
  setConn('sim'); const i1 = !document.body.classList.contains('idle'); setConn('off'); out['cabecera limpia sin conexión'] = i1 && document.body.classList.contains('idle'); 
  out['marca sin logo no cambia cabecera'] = (Brand.applyHeader(), !document.body.classList.contains('brand-custom'));
  const cn = App.connected, sv = App.vals.speed; App.connected = true; App.vals.speed = 60; await new Promise(r => setTimeout(r, 200));
  out['modo conducción (>5 km/h)'] = document.body.classList.contains('driving');
  App.vals.speed = 0; await new Promise(r => setTimeout(r, 200)); out['modo conducción se apaga detenido'] = !document.body.classList.contains('driving'); App.connected = cn; App.vals.speed = sv;
  return out;
});
let fail = 0; for (const [k, v] of Object.entries(r)) { console.log(v === true ? 'OK  ' : 'FAIL', k, v === true ? '' : v); if (v !== true) fail++; }
console.log('Errores de consola/página:', errs.length ? errs : 'ninguno'); if (errs.length) fail++;
await pg.screenshot({ path: process.argv[2] || 'tests/baseline-1024x600.png' }); await b.close(); process.exit(fail ? 1 : 0);
