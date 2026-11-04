import{test,expect}from'@playwright/test';
for(const name of ['Fastest Race','Slowest Race','Picnic Panic','Wobbly Waters'])test(`${name}: playable start, action, pause, and six results`,async({page})=>{
 test.setTimeout(180000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install();await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/?seed=22');
 await page.getByLabel('Take your time: untimed equipment picking').check();await page.locator('.challenge-card').filter({hasText:name}).click();
 await page.getByRole('button',{name:/That’s my boat/}).click();
 for(const part of ['Proper-ish Paddle','Bottle Outriggers','Turtle-Shell Shield'])await page.locator('.equipment-card').filter({hasText:part}).click();
 await page.getByRole('button',{name:/Ready to race/}).click();await page.getByRole('button',{name:/Launch the extremely official race/}).click();
 await expect(page.locator('#race-canvas')).toBeVisible();await page.clock.runFor(1000);
 await page.getByRole('button',{name:'Pause',exact:true}).click();const frozen=await page.locator('#race-time').textContent();await page.clock.runFor(2000);await expect(page.locator('#race-time')).toHaveText(frozen!);
 await page.getByRole('button',{name:/Back to the river/}).click();
 await page.screenshot({path:`artifacts/race-${name.replaceAll(' ','-')}.png`});
 for(let t=0;t<125;t+=4){
  if(await page.locator('.results-table').count())break;
  if(name==='Picnic Panic'){
   const text=await page.locator('#race-metric').textContent();const estimate=await page.locator('#race-secondary').textContent();
   const distance=Number(text?.match(/[\d.]+/)?.[0]),stopping=Number(estimate?.match(/[\d.]+/)?.[0]);
   if(distance<stopping+50&&await page.locator('#race-action').isEnabled())await page.locator('#race-action').click();
  }else if(await page.locator('#race-action').isEnabled())await page.locator('#race-action').click();
  await page.clock.runFor(4000);
 }
 await expect(page.locator('.results-table li')).toHaveCount(6);await expect(page.getByRole('button',{name:'Choose another challenge'})).toBeVisible();
 expect(errors).toEqual([]);await page.screenshot({path:`artifacts/results-${name.replaceAll(' ','-')}.png`,fullPage:true});
});
