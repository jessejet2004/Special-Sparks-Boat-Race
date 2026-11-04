export type Entry = {url:string;name:string;usage:string;page?:number;source:string;sourceHash:string;bounds:number[]};
export class Artwork {
  entries:Record<string,Entry>={};
  images=new Map<string,HTMLImageElement>();
  errors=new Set<string>();
  pending=new Map<string,Promise<void>>();
  async init(){this.entries=await (await fetch('./art/registry.json')).json();}
  async load(ids:string[]) {
    await Promise.all([...new Set(ids)].map(id=>{
      if(this.images.has(id)) return;
      if(this.pending.has(id)) return this.pending.get(id);
      const task=new Promise<void>(resolve=>{
        const entry=this.entries[id]; if(!entry){this.errors.add(id);resolve();return;}
        const image=new Image();image.onload=()=>{this.images.set(id,image);resolve();};image.onerror=()=>{this.errors.add(id);resolve();};image.src=entry.url;
      });this.pending.set(id,task);return task;
    }));
  }
  image(id:string){return this.images.get(id);}
}
