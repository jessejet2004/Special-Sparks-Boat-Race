export const characters = ['lantern','foxy','ruby','dizzy','nibbles','tilly'] as const;
export type Character = typeof characters[number];
export const characterNames = ['Lantern','Foxy','Ruby','Dizzy','Nibbles','Tilly'];
export const boatIds = ['bathtub','cardboard-box','raft','doughnut','teacup','welly','picnic-basket'] as const;
export type BoatId = typeof boatIds[number];
export type BoatPlacement = {seatX:number;seatY:number;characterWidth:number;rimY:number;waterline:number;mounts:[number,number,number][]};
// Normalised to the trimmed boat artwork; rim is redrawn over the character.
export const placements: Record<BoatId,BoatPlacement> = {
  bathtub:{seatX:.48,seatY:.43,characterWidth:.48,rimY:.48,waterline:.88,mounts:[[.18,.6,-.25],[.78,.58,.2],[.58,.13,0]]},
  'cardboard-box':{seatX:.48,seatY:.45,characterWidth:.48,rimY:.49,waterline:.9,mounts:[[.18,.62,-.2],[.8,.6,.2],[.62,.12,0]]},
  raft:{seatX:.47,seatY:.48,characterWidth:.47,rimY:.57,waterline:.9,mounts:[[.12,.7,-.3],[.83,.67,.2],[.55,.12,0]]},
  doughnut:{seatX:.48,seatY:.47,characterWidth:.44,rimY:.56,waterline:.91,mounts:[[.16,.65,-.25],[.83,.64,.2],[.54,.1,0]]},
  teacup:{seatX:.44,seatY:.43,characterWidth:.43,rimY:.48,waterline:.9,mounts:[[.12,.62,-.2],[.83,.65,.2],[.56,.1,0]]},
  welly:{seatX:.59,seatY:.34,characterWidth:.4,rimY:.39,waterline:.9,mounts:[[.16,.7,-.2],[.84,.65,.25],[.54,.05,0]]},
  'picnic-basket':{seatX:.49,seatY:.47,characterWidth:.45,rimY:.55,waterline:.91,mounts:[[.12,.7,-.2],[.82,.7,.2],[.5,.12,0]]},
};
export function poseId(character:Character, pose:string) {
  if (pose==='surprised' && character!=='lantern') pose=character==='dizzy'?'worried':'looking-back';
  if (pose==='looking-back' && character==='dizzy') pose='singing';
  if (pose==='looking-back' && character==='lantern') pose='surprised';
  return `character.${character}.${pose}`;
}
