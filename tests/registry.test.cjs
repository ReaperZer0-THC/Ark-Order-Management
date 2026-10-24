// Run: node tests/registry.test.cjs
const assert=require('node:assert/strict');
const registry=require('../creature-registry.json');
const names=registry.species.map(x=>x.name);
assert.equal(names.length,new Set(names).size,'No duplicate canonical names');
const fixtureNames=['Basilisk','Ankylosaurus','Ossidon','Yutyrannus','Griffin','Fasolasuchus','Gigadesmodus','Snow Owl','Karkinos','Elderclaw','Dreadnoughtus','Mantis','Argentavis','Maeguana','Woolly Rhino','Yi Ling','Deinonychus','Terror Bird','Burrowbuck','Carcharodontosaurus','Ice Wyvern','Giganotosaurus','Reaper V2','Aberrant Spino','Fire Wyvern','Lightning Wyvern','Tek Rex','Rock Drake','Brontosaurus V2','Cosmo','Gasbags','Megaraptor'];
for(const n of fixtureNames)assert(names.includes(n),'Missing creature '+n);
for(const item of registry.species){
 assert(item.name&&typeof item.name==='string');
 assert(Array.isArray(item.breeding)&&item.breeding.every(x=>['Egg','Embryo','Impregnation'].includes(x)));
}
const expected={Karkinos:'Embryo',Gasbags:'Embryo',Reaper:'Impregnation','Reaper V2':'Impregnation','Brontosaurus V2':'Egg',Brontosaurus:'Egg',Basilisk:'Egg','Tek Rex':'Egg'};
for(const [name,type] of Object.entries(expected))assert.equal(registry.species.find(x=>x.name===name)?.breeding[0],type,name+' classification');
console.log('PASS '+registry.species.length+' registry entries; '+fixtureNames.length+' fixture names covered; no duplicates');
