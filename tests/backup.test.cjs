// Run: node tests/backup.test.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('app.js','utf8');
const start=source.indexOf('function validateBackup(data){'),end=source.indexOf('function save(){',start);
assert(start>=0&&end>start,'Backup validator missing');
const validate=Function('empty',source.slice(start,end)+';return validateBackup')(()=>({version:3,orders:[],stock:{},allocation:{},categories:{}}));
const fixture={version:3,orders:[{id:'order-1',customer:'Example',items:[{name:'Basilisk',m:1,f:1,optionalF:1}]}],stock:{Basilisk:{m:2,f:2}},allocation:{'order-1:0':{m:1,f:1}},categories:{Basilisk:'Unverified'}};
assert.deepEqual(validate(JSON.parse(JSON.stringify(fixture))),fixture,'round trip preserves records');
const invalid=[
 {...fixture,version:2},
 {...fixture,orders:[...fixture.orders,fixture.orders[0]]},
 {...fixture,allocation:{'missing:0':{m:1,f:1}}},
 {...fixture,allocation:{'order-1:0':{m:3,f:1}}},
 {...fixture,stock:{Basilisk:{m:-1,f:2}}},
 {...fixture,orders:[{...fixture.orders[0],items:[{name:'Basilisk',m:-1,f:1}]}]}
];
for(const sample of invalid)assert.throws(()=>validate(sample));
console.log('PASS backup round-trip and '+invalid.length+' invalid-backup cases');
