import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--disable-gpu'] });
const pg = await b.newPage();
await pg.setViewport({ width:390, height:900, deviceScaleFactor:1, isMobile:true, hasTouch:true });
await pg.goto('http://localhost:4173/', { waitUntil:'networkidle0' });
const info = await pg.evaluate(() => {
  const de = document.documentElement;
  const vw = window.innerWidth;
  const offenders = [];
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.width > vw + 1) {
      offenders.push({ tag: el.tagName, cls: (el.className && el.className.toString) ? el.className.toString().slice(0,44) : '', w: Math.round(r.width), right: Math.round(r.right) });
    }
  });
  return { vw, scrollWidth: de.scrollWidth, top: offenders.slice(0,14) };
});
console.log('innerWidth', info.vw, 'scrollWidth', info.scrollWidth);
info.top.forEach(o => console.log(`  ${o.w}px right=${o.right}  <${o.tag}> .${o.cls}`));
await b.close();
