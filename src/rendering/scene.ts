import{Artwork}from'../artwork/registry';
import{drawBoat,drawImage}from'./composite';
import{type Race,rank}from'../game/race';
import{characterNames}from'../artwork/config';
export class RaceScene{
 camera=0;
 constructor(public art:Artwork){}
 draw(canvas:HTMLCanvasElement,r:Race,reduced:boolean){
  if(canvas.width!==1200){canvas.width=1200;canvas.height=650;}
  const ctx=canvas.getContext('2d')!,W=1200,H=650;
  const fleet=r.racers.filter(p=>p.status!=='rescued').map(p=>p.x).sort((a,b)=>a-b);
  const middle=fleet.length?fleet[Math.floor(fleet.length/2)]:r.racers[0].x;
  let goal=Math.max(0,middle-220);if(r.challenge==='picnic')goal=Math.min(goal,r.target-350);
  const waveMode=r.challenge==='wobbly';if(waveMode)goal=0;
  this.camera=reduced?Math.floor(goal/140)*140:this.camera+(goal-this.camera)*.07;
  const bg=this.art.image('background.lake');
  if(bg){const scale=Math.max(W/bg.width,H/bg.height);const margin=bg.width*scale-W;ctx.drawImage(bg,-(reduced?margin*.5:margin*Math.min(1,middle/r.target)),0,bg.width*scale,bg.height*scale);}
  const world=(x:number)=>(x-this.camera)*1.55+70;
  // Deliberate course placements, independent from collisions.
  const scenery=['environment.lily-pads-pink-flower','environment.cattails-rocks','environment.mossy-rock','environment.floating-log','environment.flagged-buoy','environment.wooden-jetty','environment.flowering-riverbank-bush'];
  for(let i=0;i<12;i++){const x=world(i*130-40);if(x> -150&&x<1300)drawImage(ctx,this.art,scenery[(i*3+2)%7],x,165+(i%2)*7,60+(i%3)*13);}
  const props:Record<string,string[]>={fastest:['fastest-race.very-official-race-judge','fastest-race.speed-limit-maybe-sign','fastest-race.cheering-duck-spectators'],slowest:['slowest-race.sleeping-frog-floating-chair','slowest-race.snail-lily-pad','slowest-race.sleeping-duck','slowest-race.floating-alarm-clock','slowest-race.no-rush-sign','slowest-race.floating-beach-ball'],picnic:['picnic-panic.picnic-basket-full-of-food','picnic-panic.seagull-on-rock','picnic-panic.floating-sandwich','picnic-panic.you-made-it-almost-sign'],wobbly:['wobbly-waters.probably-safe-sign','wobbly-waters.rubber-duck','wobbly-waters.warning-buoy','wobbly-waters.floating-treasure-chest','wobbly-waters.colourful-fish','wobbly-waters.little-shipwreck']};
  props[r.challenge].forEach((id,i)=>{const x=waveMode?70+i*195:world(60+i*(r.target-120)/Math.max(1,props[r.challenge].length-1));if(x> -100&&x<1250)drawImage(ctx,this.art,id,x,160-(i%2)*30,55+(i%3)*10);});
  if(!waveMode){
   const finish=world(r.target);
   if(finish>-100&&finish<1400){
    ctx.save();ctx.strokeStyle='#fff9df';ctx.lineWidth=5;ctx.setLineDash([13,10]);ctx.beginPath();ctx.moveTo(finish+20,220);ctx.lineTo(finish+20,610);ctx.stroke();ctx.restore();
    drawImage(ctx,this.art,r.challenge==='picnic'?'picnic-panic.floating-picnic-platform':r.challenge==='slowest'?'slowest-race.turtle-checkered-flag':'fastest-race.finish-line-arch',finish-48,110,r.challenge==='picnic'?160:105);
    if(r.challenge==='picnic')drawImage(ctx,this.art,'picnic-panic.picnic-finish-markers',finish-25,555,110);
    ctx.fillStyle='#fff9e9';ctx.fillRect(finish-42,208,124,28);ctx.fillStyle='#16484a';ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.fillText(r.challenge==='picnic'?'PICNIC TARGET':'FINISH',finish+20,228);
   }
  }
  if(waveMode){const until=r.nextWave-r.time;const progress=Math.max(0,1-until/4.5);if(until<2.5&&r.wave<10){const wx=reduced?1050:W-progress*W;ctx.save();ctx.globalAlpha=.35;ctx.strokeStyle='#e7fcff';ctx.lineWidth=14+r.wave;ctx.beginPath();for(let y=245;y<650;y+=8){const x=wx+Math.sin(y*.04)*18;y===245?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();ctx.restore();}drawImage(ctx,this.art,'wobbly-waters.warning-buoy',1080,175,60);}
  const standings=rank(r);
  r.racers.forEach((p,i)=>{
   let x=waveMode?115+(i%3)*345:world(p.x),y=waveMode?265+Math.floor(i/3)*185:250+i*57;
   const width=waveMode?180:116;
   if(!waveMode&&(x<0||x>W-80)){ctx.fillStyle=i===0?'#124c4d':'#375e5c';ctx.font='bold 12px sans-serif';ctx.textAlign=x<0?'left':'right';ctx.fillText(`${x<0?'◀ ':''}${characterNames[i]}${x>W-80?' ▶':''}`,x<0?10:W-10,y+30);return;}
   const bob=reduced?0:Math.sin(r.time*2.2+i)*2.5;
   const hit=[...r.events].reverse().find(e=>e.racer===i&&e.kind==='damage'&&r.time-e.time<1.5);
   const pose=p.status==='rescued'?'worried':p.status==='finished'?'celebrating':hit?'worried':p.boostUntil>r.time?'excited':p.equipment.includes('hamster-wheel')&&p.character==='dizzy'?'looking-back':'paddling';
   if(p.status==='rescued'){
    ctx.globalAlpha=.45;drawBoat(ctx,this.art,p.boat,p.character,x,y,width,'worried',[],r.time);ctx.globalAlpha=1;
    drawImage(ctx,this.art,'encounter.teddy-tow-boat.action',x+width*.45,y-15,width*.72);drawImage(ctx,this.art,'encounter.teddy-bear-captain.action',x+width*.78,y-18,width*.2);
    drawImage(ctx,this.art,'wobbly-waters.floating-rescue-ring',x-15,y+30,35);
   }else drawBoat(ctx,this.art,p.boat,p.character,x,y+bob,width,pose,p.equipment,r.time,hit?1:0);
   ctx.font=`${i===0?'bold ':''}12px sans-serif`;ctx.textAlign='center';const label=characterNames[i]+(i===0?' · YOU':'');const labelWidth=ctx.measureText(label).width+18;
   ctx.fillStyle=i===0?'#123e43':'#fffbeaee';ctx.beginPath();ctx.roundRect(x+width/2-labelWidth/2,y+width*.73,labelWidth,23,9);ctx.fill();ctx.fillStyle=i===0?'#fff8dc':'#163f43';ctx.fillText(label,x+width/2,y+width*.73+16);
   if(waveMode){ctx.fillStyle='#ffffffba';ctx.fillRect(x+15,y+width*.73+30,width-30,5);ctx.fillStyle=p.hull>35?'#2b8169':'#c26537';ctx.fillRect(x+15,y+width*.73+30,(width-30)*Math.max(0,p.hull/p.stats.durability),5);}
  });
  const recent=r.events.filter(e=>r.time-e.time<3.3);
  // Sparse debris: only selected damage/cosmetic moments, never every slowdown.
  for(const e of recent.filter(e=>e.asset&&(e.kind==='cosmetic'||(e.kind==='damage'&&e.id%7===0))).slice(-2)){
   const p=r.racers[e.racer],age=r.time-e.time;const x=waveMode?200+(e.racer%3)*345:world(p.x)+85,y=waveMode?290+Math.floor(e.racer/3)*185:260+e.racer*57;
   ctx.save();ctx.translate(x+(reduced?0:age*18),y+(reduced?0:-Math.sin(Math.min(1,age)*Math.PI)*26+age*10));ctx.rotate(reduced?0:age*1.4);drawImage(ctx,this.art,e.asset!,-16,-16,32);ctx.restore();
  }
  for(const e of r.encounters.filter(e=>r.time>=e.at-2&&r.time<e.at+3.5)){
   const prefix:Record<string,string>={fisherman:'disgruntled-fisherman',seal:'playful-seal','river-monster':'friendly-river-monster','potato-cannon':'potato-cannon'};const state=r.time<e.at?'initial':'action';
   const ex=850+(reduced?0:Math.max(0,e.at-1-r.time)*65);drawImage(ctx,this.art,`encounter.${prefix[e.kind]}.${state}`,ex,85,110);
   if(e.kind==='fisherman')drawImage(ctx,this.art,`encounter.fisherman-boat.${state}`,ex-10,170,125);
   if(e.kind==='potato-cannon'&&r.time>e.at)drawImage(ctx,this.art,'picnic-panic.flying-potato',ex-40-(reduced?0:(r.time-e.at)*110),180,35);
  }
  ctx.textAlign='left';ctx.font='bold 12px sans-serif';ctx.fillStyle='#123e43';ctx.fillText(waveMode?'WAVES ARRIVE FROM THE RIGHT →':`COURSE ${Math.round(Math.min(100,middle/r.target*100))}% · Fleet camera`,24,35);
 }
}
