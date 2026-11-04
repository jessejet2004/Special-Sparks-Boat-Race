import {boatIds,type BoatId} from '../artwork/config';
export type Challenge='fastest'|'slowest'|'picnic'|'wobbly';
export type Stats={speed:number;stability:number;durability:number;handling:number;glide:number};
export const boats:Record<BoatId,{name:string;description:string;traits:string[];stats:Stats}>={
 bathtub:{name:'The Good Old Bathtub',description:'First-class comfort. Slightly suspicious plumbing.',traits:['Steady','Sturdy','Rather heavy'],stats:{speed:24,stability:8,durability:105,handling:6,glide:5}},
 'cardboard-box':{name:'A Very Brave Cardboard Box',description:'Confidently ignoring the word “waterproof”.',traits:['Quick','Nimble','Soggy risk'],stats:{speed:33,stability:4,durability:65,handling:8,glide:4}},
 raft:{name:'The Stick-Together Raft',description:'A team of logs with a very optimistic rope.',traits:['Stable','Easy to steer','Unhurried'],stats:{speed:25,stability:9,durability:95,handling:8,glide:3}},
 doughnut:{name:'The Doughnut of Destiny',description:'A well-rounded choice. Please don’t nibble.',traits:['Bouncy','Glides far','Wobbly'],stats:{speed:31,stability:5,durability:85,handling:4,glide:8}},
 teacup:{name:'An Enormous Teacup',description:'For sailors who take their tea very seriously.',traits:['Smooth glide','Sturdy','Tricky turns'],stats:{speed:28,stability:6,durability:95,handling:4,glide:9}},
 welly:{name:'The Left Welly',description:'Still looking for its right-hand crew member.',traits:['Fast','Turns well','Tips easily'],stats:{speed:34,stability:3,durability:80,handling:9,glide:4}},
 'picnic-basket':{name:'The Picnic Basket',description:'Packed for adventure. And possibly sandwiches.',traits:['Balanced','Gentle glide','Not watertight'],stats:{speed:29,stability:7,durability:80,handling:7,glide:6}},
};
export const challenges:Record<Challenge,{name:string;kicker:string;description:string;rule:string;art:string;colour:string}>={
 fastest:{name:'Fastest Race',kicker:'FULL STEAM. QUESTIONABLE BOAT.',description:'Outpace the fleet. Try to keep your dignity.',rule:'First across the line wins. Paddle for a short burst, then catch your breath.',art:'fastest-race.golden-winner-trophy',colour:'#eab85b'},
 slowest:{name:'Slowest Race',kicker:'ABSOLUTELY NO HURRY.',description:'The last finisher gets the first slow clap.',rule:'Finish last, but keep moving. Brake gently; eight seconds stranded means a friendly tow. Towed boats cannot win.',art:'slowest-race.sleeping-frog-floating-chair',colour:'#a9c797'},
 picnic:{name:'Picnic Panic',kicker:'THE SANDWICHES ARE AT STAKE.',description:'A little momentum. A very important stop.',rule:'Brake once, then glide. Stop closest to the picnic marker to win. Watch the distance and stopping estimate.',art:'supporting-effect.sandwich-trophy',colour:'#efa783'},
 wobbly:{name:'Wobbly Waters',kicker:'PROBABLY SAFE. PROBABLY.',description:'Stay afloat as the waves get a bit ambitious.',rule:'Time your brace for each wave. Survive the most waves. Ties favour the least damage, then less water aboard.',art:'wobbly-waters.probably-safe-sign',colour:'#8bcbd8'},
};
export function random(seed:number){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function shuffle<T>(values:readonly T[],rng:()=>number){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function offers(seed:number){return shuffle(boatIds,random(seed)).slice(0,4);}
export function nextOffer(list:BoatId[],index:number){if(index>=list.length-1)throw Error('The final offer must be accepted');return index+1;}
