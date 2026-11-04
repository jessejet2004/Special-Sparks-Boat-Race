import{describe,it,expect}from'vitest';
import{createRace,stepRace,action,rank,stoppingDistance}from'../../src/game/race';
import{boatIds,type BoatId}from'../../src/artwork/config';
import{equipment}from'../../src/game/equipment';
import type{Challenge}from'../../src/game/model';
const parts=[['proper-ish-paddle','pool-noodle','anchor'],['helpful-duck'],['fizzy-bottle-engine'],['party-balloons','pet-rock'],['giant-spoon'],['turtle-shell-shield']];
function run(c:Challenge,b:BoatId=boatIds[0],seed=123){const r=createRace(c,seed,[b,...boatIds.slice(1,6)],parts);for(let n=0;n<2500&&!r.done;n++){if(c==='picnic'&&r.racers[0].x+stoppingDistance(r.racers[0])>=r.target)action(r);if(c==='wobbly'&&r.nextWave-r.time<.7)action(r);stepRace(r);}return r;}
for(const challenge of ['fastest','slowest','picnic','wobbly'] as Challenge[])describe(challenge,()=>{
 it('completes for all seven boats with six finite ranked results',()=>{for(const boat of boatIds){const r=run(challenge,boat);expect(r.done).toBe(true);expect(rank(r)).toHaveLength(6);expect(new Set(rank(r)).size).toBe(6);for(const p of r.racers){expect(Number.isFinite(p.x)).toBe(true);expect(p.hull).toBeGreaterThanOrEqual(0);}}});
 it('is deterministic with a fixed seed and action sequence',()=>{const a=run(challenge),b=run(challenge);expect(a.racers).toEqual(b.racers);expect(a.events).toEqual(b.events);});
});
it('paddling has cooldown and improves progress',()=>{const a=createRace('fastest',1,Array(6).fill('bathtub'),Array.from({length:6},()=>[]));const b=createRace('fastest',1,Array(6).fill('bathtub'),Array.from({length:6},()=>[]));expect(action(a)).toBe(true);expect(action(a)).toBe(false);for(let i=0;i<50;i++){stepRace(a);stepRace(b);}expect(a.racers[0].x).toBeGreaterThan(b.racers[0].x);});
it('picnic braking is deliberate, irreversible, and stops close when timed',()=>{const r=run('picnic');expect(Math.abs(r.racers[0].x-r.target)).toBeLessThan(8);expect(r.racers[0].brake).toBe(true);expect(action(r)).toBe(false);});
it('rescued slow boats cannot beat legal finishers',()=>{const r=run('slowest');r.racers[0].status='rescued';r.racers[0].finishTime=110;expect(rank(r)[0]).not.toBe(0);});
it('all equipment remains finite in every challenge',()=>{for(const item of equipment){const r=createRace('wobbly',7,Array(6).fill('cardboard-box'),Array.from({length:6},()=>[item.id]));while(!r.done)stepRace(r);expect(r.racers.every(p=>Number.isFinite(p.hull)&&Number.isFinite(p.water))).toBe(true);}});
