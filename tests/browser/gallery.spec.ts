import {test,expect} from '@playwright/test';
test('gallery loads all official artwork and adjusts compositions',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/gallery.html');await expect(page.locator('.asset-card')).toHaveCount(155);
 await page.locator('.asset-card img').evaluateAll(imgs=>imgs.forEach(img=>(img as HTMLImageElement).loading='eager'));
 for(const boat of ['bathtub','cardboard-box','raft','doughnut','teacup','welly','picnic-basket']){
  await page.getByLabel('Boat',{exact:true}).selectOption(boat);
  await expect(page.locator('#errors')).toHaveText('All selected artwork loaded.');
 }
 await page.getByLabel('Character',{exact:true}).selectOption('dizzy');await page.getByLabel('Pose',{exact:true}).selectOption('looking-back');
 await expect(page.locator('#errors')).toHaveText('All selected artwork loaded.');
 await page.locator('.asset-card').last().scrollIntoViewIfNeeded();
 await expect.poll(()=>page.locator('.asset-card img').evaluateAll(imgs=>imgs.every(img=>(img as HTMLImageElement).complete&&(img as HTMLImageElement).naturalWidth>0))).toBe(true);
 expect(errors).toEqual([]);
 await page.setViewportSize({width:1366,height:768});await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'artifacts/gallery.png'});
});
