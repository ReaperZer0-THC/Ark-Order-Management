// Run after npm install --no-save playwright && npx playwright install chromium
const { chromium }=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const mime={'.js':'text/javascript','.json':'application/json','.html':'text/html','.css':'text/css'};
const server=http.createServer((req,res)=>{
 const file=path.join(process.cwd(),decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]).replace(/^\/+/,''));
 if(!file.startsWith(process.cwd()+path.sep)){res.writeHead(403).end();return}
 fs.readFile(file,(err,bytes)=>{if(err){res.writeHead(404).end();return}res.setHeader('Content-Type',mime[path.extname(file)]||'text/plain');res.end(bytes)});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  page.on('dialog',d=>d.accept());
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.getByRole('button',{name:'Import',exact:true}).click();
  await page.locator('#import-input').fill('Name: Acceptance Test\nOrder:\nPair Basilisk\nPayment: 200 Tek');
  await page.locator('#parse').click();
  assert.equal(await page.locator('[data-import]').count(),1);
  await page.locator('[data-import]').click();
  await page.getByRole('button',{name:'Production',exact:true}).click();
  await page.locator('[data-all="Basilisk"]').click();
  await page.getByRole('button',{name:'Fulfillment',exact:true}).click();
  await page.locator('[data-allocate]').click();
  assert.match(await page.locator('#view').innerText(),/2\/2 allocated/);
  await page.locator('[data-status]').selectOption('Completed');
  await page.getByRole('button',{name:'Orders',exact:true}).click();
  assert.match(await page.locator('#view').innerText(),/Completed/);
  await page.getByRole('button',{name:'Backup',exact:true}).click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('thc-phase1-v3')));
  assert.equal(saved.orders[0].status,'Completed');
  assert.equal(saved.stock.Basilisk.m,0);assert.equal(saved.stock.Basilisk.f,0);
  assert.deepEqual(saved.allocation,{});
  // Browser persistence: reload and confirm completed order remains.
  await page.reload();
  await page.getByRole('button',{name:'Orders',exact:true}).click();
  assert.match(await page.locator('#view').innerText(),/Acceptance Test/);
  assert.equal(errors.length,0,'Browser console exceptions: '+errors.join('; '));
  console.log('PASS Chromium import -> production -> allocation -> completion -> persistence');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
