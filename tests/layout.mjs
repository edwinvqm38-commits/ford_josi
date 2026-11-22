// Matriz de tamaños de tablet: node tests/layout.mjs [carpeta_capturas] [sim]
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import path from 'path'; import { fileURLToPath } from 'url';
const FILE = 'file://' + path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../index.html'); let fails = 0;
const { chromium } = require('playwright'); const b = await chromium.launch();
const ALL=[[960,540],[1024,600],[1280,720],[1280,800],[1024,768],[1366,768],[1920,1200],[2560,1080],[800,1280],[600,1024],[768,1024]];
const sizes=process.env.SIZES?ALL.filter(([w,h])=>process.env.SIZES.split(',').includes(w+'x'+h)):ALL;
const sim=process.argv[3]==='sim';
for (const [w,h] of sizes) {
  const pg = await b.newPage({ viewport:{width:w,height:h} });
  await pg.addInitScript(()=>{localStorage.setItem('ecodrive.settings.v1',JSON.stringify({welcomed:true,theme:'luxury',nightAuto:false}))});
  await pg.goto(FILE); await pg.waitForTimeout(600);
  await pg.getByText('Conectar',{exact:true}).first().click(); await pg.getByText('Iniciar simulación').click(); await pg.waitForTimeout(2500);
  if(!sim) await pg.evaluate(()=>{document.querySelector('.live').classList.remove('has-sim');document.querySelector('#simPanel')?.remove();});
  await pg.waitForTimeout(600);
  const m = await pg.evaluate(()=>{
    const vw=innerWidth,vh=innerHeight,bad=[];
    document.querySelectorAll('#view .live *, header.top *, #tabs *').forEach(e=>{ const r=e.getBoundingClientRect(); if(!r.width||!r.height) return;
      const cs=getComputedStyle(e); if(cs.display==='none'||cs.visibility==='hidden') return;
      if(r.right>vw+1||r.bottom>vh+1||r.left<-1) bad.push((e.id||e.className||e.tagName).toString().slice(0,30)+` r${Math.round(r.right)} b${Math.round(r.bottom)}`);
      if(e.children.length===0 && e.scrollWidth>e.clientWidth+2 && cs.overflow!=='visible' && e.clientWidth>0) bad.push('clip:'+(e.id||e.className).toString().slice(0,25)); });
    document.querySelectorAll('.tile').forEach(t=>{const tr=t.getBoundingClientRect();t.querySelectorAll('.v,.u,.t').forEach(c=>{const r=c.getBoundingClientRect(); if(r.height&&(r.bottom>tr.bottom+1||r.top<tr.top-1||r.right>tr.right+1)) bad.push('tile-overflow:'+(c.id||c.className))})});const v=document.querySelector('#view'); return {hs:document.documentElement.scrollWidth>vw, vscroll:v? v.scrollHeight-v.clientHeight:0, bad:[...new Set(bad)].slice(0,6)};});
  console.log(`${w}x${h}`, sim ? 'sim' : 'real', JSON.stringify(m)); if (m.hs || m.bad.length) fails++;
  if (process.argv[2]) await pg.screenshot({path:`${process.argv[2]}/m-${w}x${h}${sim?'-sim':''}.png`}); await pg.close();
}
await b.close(); process.exit(fails ? 1 : 0);
