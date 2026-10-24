// Run: node tests/parser.test.cjs
const fs=require('node:fs');
const assert=require('node:assert/strict');
const source=fs.readFileSync('app.js','utf8');
const start=source.indexOf('function parseOrderText(text){');
const end=source.indexOf('function renderImport(el){');
assert(start>=0&&end>start,'Parser function not found');
const parse=Function('canonicalCreature','creatureRegistry','creatureKnown',source.slice(start,end)+';return parseOrderText')(x=>x,{species:[]},()=>true);
const cases=[
 {name:'Samy Alpha Pair heading',text:'Name: **@Samy** y\nOrder Alpha Pair:\nBurrowbuck\nCarcharodontosaurus\nIce Wyvern\nGiganotosaurus\nReaper v2\nPayment: 1000 Tek Ceilings',count:1,totals:[10]},
 {name:'Samy compact Alpha Pair order',text:'Name: @Samy y Order Alpha Pair: Burrowbuck\nCarcharodontosaurus\nIce Wyvern\nGiganotosaurus\nReaper v2\nPayment: 1000 Tek Ceilings',count:1,totals:[10]},
 {name:'separate same-customer posts',text:'### ZOUFRIYA948[Member](https://discord.com) 10/19/2026\nName: ZOUFRIYA948\nOrder:\nPaire +1F Basilisk\nPaire +1F Ankylosaurus\nPayment: 1500 Tek\n### ZOUFRIYA948[Member](https://discord.com) 10/21/2026\nName: ZOUFRIYA948\nOrder:\nPaire +1F Snow Owl\nPayment: 1500 Tek',count:2,totals:[6,3]},
 {name:'optional females before and after names',text:'Name: Duster\nOrder:\nPair +1F if available Aberrant Spino\nPair +1F Karkinos if available\nPayment: 1500 Tek',count:1,totals:[4],optional:[2]},
 {name:'compressed metadata fields',text:'Name: Arinn Order: Fire Wyvern pair Payment: 1000 Tek',count:1,totals:[2]},
 {name:'pair-mode lines',text:'Name: mystic_ripple\nOrder:\nAll pairs alpha\nYutyrannus\nTek Rex\nRock Drake\nArgentavis\nAnkylosaurus\nPayment: 1000 Tek',count:1,totals:[10]},
 {name:'nine separate Discord posts and quantities',text:[
  ['ZOUFRIYA948','Basilisk','Ankylosaurus','Ossidon','Yutyrannus','Griffin'],
  ['ZOUFRIYA948','Fasolasuchus','Gigadesmodus','Snow Owl','Karkinos','Elderclaw'],
  ['lachin','Dreadnoughtus','Gigadesmodus','Mantis','Argentavis','Maeguana'],
  ['Lobita737','Woolly Rhino','Yi Ling','Yutyrannus','Deinonychus','Terror Bird'],
  ['Samy','Burrowbuck','Carcharodontosaurus','Ice Wyvern','Giganotosaurus','Reaper V2'],
  ['Duster','Aberrant Spino','Karkinos','Ice Wyvern','Fire Wyvern','Basilisk'],
  ['Arinn','Fire Wyvern','Lightning Wyvern','Ice Wyvern','Giganotosaurus','Snow Owl'],
  ['mystic_ripple','Yutyrannus','Tek Rex','Rock Drake','Argentavis','Ankylosaurus'],
  ['Chacal','Brontosaurus V2','Cosmo','Gasbags','Megaraptor','Woolly Rhino']
 ].map((row,i)=>'### '+row[0]+'[member](https://discord.com) 10/'+(10+i)+'/2026\nName: '+row[0]+'\nOrder:\n'+row.slice(1).map(n=>i===5?'Pair +1F '+n+' if available':[0,1,8].includes(i)?'Paire +1F '+n:'Pair '+n).join('\n')+'\nPayment: 1000 Tek').join('\n'),count:9,totals:[15,15,10,10,10,10,10,10,15],optional:[0,0,0,0,0,5,0,0,0]}
];
for(const c of cases){
 const result=parse(c.text);
 assert.equal(result.length,c.count,c.name+' count');
 assert.deepEqual(result.map(o=>o.items.reduce((sum,i)=>sum+i.m+i.f,0)),c.totals,c.name+' totals');
 if(c.optional)assert.deepEqual(result.map(o=>o.items.reduce((sum,i)=>sum+i.optionalF,0)),c.optional,c.name+' optional');
 assert(result.every(o=>o.customer&&o.items.length),c.name+' missing customer or items');
 console.log('PASS',c.name);
}
