// Run: node tests/parser.test.cjs
const fs=require('node:fs');
const assert=require('node:assert/strict');
const source=fs.readFileSync('app.js','utf8');
const start=source.indexOf('function parseOrderText(text){');
const end=source.indexOf('function renderImport(el){');
assert(start>=0&&end>start,'Parser function not found');
const parse=Function('canonicalCreature',source.slice(start,end)+';return parseOrderText')(x=>x);
const cases=[
 {name:'separate same-customer posts',text:'### ZOUFRIYA948[Member](https://discord.com) 10/19/2026\nName: ZOUFRIYA948\nOrder:\nPaire +1F Basilisk\nPaire +1F Ankylosaurus\nPayment: 1500 Tek\n### ZOUFRIYA948[Member](https://discord.com) 10/21/2026\nName: ZOUFRIYA948\nOrder:\nPaire +1F Snow Owl\nPayment: 1500 Tek',count:2,totals:[6,3]},
 {name:'optional females before and after names',text:'Name: Duster\nOrder:\nPair +1F if available Aberrant Spino\nPair +1F Karkinos if available\nPayment: 1500 Tek',count:1,totals:[4],optional:[2]},
 {name:'compressed metadata fields',text:'Name: Arinn Order: Fire Wyvern pair Payment: 1000 Tek',count:1,totals:[2]},
 {name:'pair-mode lines',text:'Name: mystic_ripple\nOrder:\nAll pairs alpha\nYutyrannus\nTek Rex\nRock Drake\nArgentavis\nAnkylosaurus\nPayment: 1000 Tek',count:1,totals:[10]}
];
for(const c of cases){
 const result=parse(c.text);
 assert.equal(result.length,c.count,c.name+' count');
 assert.deepEqual(result.map(o=>o.items.reduce((sum,i)=>sum+i.m+i.f,0)),c.totals,c.name+' totals');
 if(c.optional)assert.deepEqual(result.map(o=>o.items.reduce((sum,i)=>sum+i.optionalF,0)),c.optional,c.name+' optional');
 assert(result.every(o=>o.customer&&o.items.length),c.name+' missing customer or items');
 console.log('PASS',c.name);
}
