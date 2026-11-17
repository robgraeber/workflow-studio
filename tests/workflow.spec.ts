import { test, expect } from '@playwright/test';
test('runs the connected workflow and persists input',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Run workflow',exact:true}).click();
 await expect(page.locator('.final-output pre')).toHaveText('11');
 await expect(page.locator('.node-output')).toHaveCount(3);
 await page.locator('.run-form input').fill('testing');
 await expect(page.getByText('Saved locally')).toBeVisible();
 await page.reload();
 await expect(page.locator('.run-form input')).toHaveValue('testing');
});
test('rejects invalid scripts and mismatched connection types',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Edit Clean up text',exact:true}).click();
 await page.locator('#script').fill('function transform(input) { return 42; }');
 await page.getByRole('button',{name:'Validate & save'}).click();
 await expect(page.getByRole('alertdialog')).toContainText('must return string');
 await page.getByRole('button',{name:'Got it'}).click();
 await page.getByRole('button',{name:'Close settings'}).click();
 await page.getByRole('button',{name:'Connect Count characters',exact:true}).click();
 await page.getByRole('button',{name:'Edit Make it uppercase',exact:true}).click();
 await expect(page.getByRole('alertdialog')).toContainText('Type mismatch');
});
test('creates, saves, reloads and deletes workflow nodes',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'New workflow',exact:true}).click();
 await page.getByRole('button',{name:'Add node',exact:true}).click();
 await page.getByLabel('Node name',{exact:true}).fill('My transform');
 await page.getByRole('button',{name:'Validate & save'}).click();
 await expect(page.getByRole('button',{name:'Edit My transform',exact:true})).toBeVisible();
 await expect(page.getByText('Saved locally')).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Edit My transform',exact:true}).click();
 await page.getByRole('button',{name:'Delete node',exact:true}).click();
 await expect(page.locator('.node')).toHaveCount(1);
});
test('times out a stuck script without freezing the editor',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Edit Clean up text',exact:true}).click();
 await page.locator('#script').fill('function transform(input) { while(true) {} }');
 await page.getByRole('button',{name:'Validate & save'}).click();
 await expect(page.getByRole('alertdialog')).toContainText('2 second time limit');
 await page.getByRole('button',{name:'Got it'}).click();
 await expect(page.getByRole('button',{name:'Validate & save'})).toBeEnabled();
});
test('drags nodes, reconnects them and rejects cycles',async({page})=>{
 await page.goto('/');
 const node=page.getByRole('button',{name:'Edit Clean up text',exact:true});
 const before=await node.boundingBox();
 await page.mouse.move(before!.x+100,before!.y+50);await page.mouse.down();await page.mouse.move(before!.x+145,before!.y+90,{steps:8});await page.mouse.up();
 await expect.poll(async()=>Math.round((await node.boundingBox())!.x)).toBe(Math.round(before!.x+45));
 await page.getByRole('button',{name:'Connect Clean up text',exact:true}).click();
 await page.getByRole('button',{name:'Edit Count characters',exact:true}).click();
 await page.getByRole('button',{name:'Run workflow',exact:true}).click();
 await expect(page.locator('.final-output pre')).toHaveText('11');
 await expect(page.locator('.node-output')).toHaveCount(2);
 await page.getByRole('button',{name:'Edit Count characters',exact:true}).click();
 await page.getByRole('button',{name:'Set as starting node',exact:true}).click();
 await page.getByRole('button',{name:'Close settings'}).click();
 await page.getByRole('button',{name:'Connect Make it uppercase',exact:true}).click();
 await node.click();
 await page.getByRole('button',{name:'Connect Clean up text',exact:true}).click();
 await page.getByRole('button',{name:'Edit Make it uppercase',exact:true}).click();
 await expect(page.getByRole('alertdialog')).toContainText('cycle');
});

test('connection preview follows the pointer through zoom and scroll',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Connect Clean up text',exact:true}).click();
 const preview=page.getByTestId('connection-preview');
 await page.mouse.move(700,420);
 await expect(preview).toBeVisible();
 const assertEndpoint=async()=>{const point=await page.locator('.connection-cursor').evaluate(el=>{const circle=el as SVGCircleElement;const matrix=circle.getScreenCTM()!;const p=new DOMPoint(circle.cx.baseVal.value,circle.cy.baseVal.value).matrixTransform(matrix);return {x:p.x,y:p.y};});expect(point.x).toBeCloseTo(700,0);expect(point.y).toBeCloseTo(420,0);};
 await assertEndpoint();
 await page.getByRole('button',{name:'Zoom out',exact:true}).click();
 await page.mouse.move(700,420);
 await assertEndpoint();
 await page.locator('.canvas').evaluate(el=>el.scrollTo(100,60));
 await expect.poll(async()=>page.locator('.connection-cursor').evaluate(el=>{const circle=el as SVGCircleElement;return new DOMPoint(circle.cx.baseVal.value,circle.cy.baseVal.value).matrixTransform(circle.getScreenCTM()!).x;})).toBeCloseTo(700,0);
 await page.keyboard.press('Escape');
 await expect(preview).toHaveCount(0);
});

test('configures an if-else node, persists both connections and executes only the selected branch',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Run workflow',exact:true}).waitFor();
 await page.evaluate(()=>{
  const workflow={id:'branch-test',name:'Branch test',description:'Branch test',startNodeId:'condition',startingValue:'yes',updatedAt:new Date().toISOString(),nodes:[
   {id:'condition',name:'Check input',inputType:'string',outputType:'string',script:'input => input',x:100,y:185,nextId:null},
   {id:'yes',name:'True result',type:'transform',inputType:'boolean',outputType:'string',script:'input => "accepted: " + input',x:520,y:90,nextId:null,trueNextId:null,falseNextId:null},
   {id:'no',name:'False result',type:'transform',inputType:'boolean',outputType:'string',script:'input => "rejected: " + input',x:520,y:350,nextId:null,trueNextId:null,falseNextId:null}
  ]};
  localStorage.setItem('forma.workflows.v1',JSON.stringify([workflow]));localStorage.setItem('forma.activeWorkflow',workflow.id);
 });
 await page.reload();
 await page.getByRole('button',{name:'Edit Check input',exact:true}).click();
 await expect(page.getByRole('combobox',{name:'Node type',exact:true})).toHaveValue('transform');
 await page.getByRole('combobox',{name:'Node type',exact:true}).selectOption('if-else');
 await expect(page.getByRole('combobox',{name:'Output type',exact:true})).toHaveValue('boolean');
 await expect(page.getByRole('combobox',{name:'Output type',exact:true})).toBeDisabled();
 await page.locator('#script').fill('input => "not a boolean"');
 await page.getByRole('button',{name:'Validate & save'}).click();
 await expect(page.getByRole('alertdialog')).toContainText('must return boolean');
 await page.getByRole('button',{name:'Got it'}).click();
 await page.locator('#script').fill('input => input === "yes"');
 await page.getByRole('button',{name:'Validate & save'}).click();
 await page.getByRole('button',{name:'Connect Check input true path',exact:true}).click();
 await page.getByRole('button',{name:'Edit True result',exact:true}).click();
 await page.getByRole('button',{name:'Connect Check input false path',exact:true}).click();
 await page.getByRole('button',{name:'Edit False result',exact:true}).click();
 await expect(page.getByText('Saved locally')).toBeVisible();
 await page.reload();
 await expect(page.locator('path[data-port=trueNextId]')).toHaveCount(1);
 await expect(page.locator('path[data-port=falseNextId]')).toHaveCount(1);
 const truePort=await page.getByRole('button',{name:'Connect Check input true path',exact:true}).boundingBox();
 const falsePort=await page.getByRole('button',{name:'Connect Check input false path',exact:true}).boundingBox();
 expect(truePort!.y).toBeLessThan(falsePort!.y);
 await page.getByRole('button',{name:'Run workflow',exact:true}).click();
 await expect(page.locator('.final-output pre')).toHaveText('accepted: true');
 await expect(page.locator('path[data-port=trueNextId]')).toHaveAttribute('data-taken','true');
 await expect(page.locator('path[data-port=falseNextId]')).toHaveAttribute('data-taken','false');
 await expect(page.getByRole('button',{name:'Edit True result',exact:true})).toHaveClass(/executed/);
 await expect(page.locator('.node-output')).toHaveCount(2);
 await expect(page.locator('.node-wrap').filter({has:page.getByRole('button',{name:'Edit False result',exact:true})}).locator('.node-output')).toHaveCount(0);
 await page.locator('.run-form input').fill('no');
 await page.getByRole('button',{name:'Run workflow',exact:true}).click();
 await expect(page.locator('.final-output pre')).toHaveText('rejected: false');
 await expect(page.locator('path[data-port=falseNextId]')).toHaveAttribute('data-taken','true');
 await expect(page.locator('path[data-port=falseNextId]')).not.toHaveAttribute('stroke-dasharray');
 await expect(page.locator('path[data-port=trueNextId]')).toHaveAttribute('data-taken','false');
 await expect(page.getByRole('button',{name:'Edit False result',exact:true})).toHaveClass(/executed/);
 await expect(page.getByRole('button',{name:'Edit True result',exact:true})).not.toHaveClass(/executed/);
 await expect(page.getByText('FALSE PATH TAKEN')).toBeVisible();
 await expect(page.locator('.node-output')).toHaveCount(2);
 // Even a matching branch output cannot connect into the starting node.
 await page.getByRole('button',{name:'Connect False result',exact:true}).click();
 await page.getByRole('button',{name:'Edit Check input',exact:true}).click();
 await expect(page.getByRole('alertdialog')).toContainText('starting node');
});

test('protects the starting node and removes incoming edges when it changes',async({page})=>{
 await page.goto('/');
 const start=page.getByRole('button',{name:'Edit Clean up text',exact:true});
 const middle=page.getByRole('button',{name:'Edit Make it uppercase',exact:true});
 await expect(start.locator('.input-port')).toHaveCount(0);
 await expect(middle.locator('.input-port')).toHaveCount(1);
 await page.getByRole('button',{name:'Connect Make it uppercase',exact:true}).click();
 await expect(start).not.toHaveClass(/connection-target/);
 await start.click();
 await expect(page.getByRole('alertdialog')).toContainText('starting node cannot accept incoming connections');
 await page.getByRole('button',{name:'Got it'}).click();
 await page.keyboard.press('Escape');
 await middle.click();
 await page.getByRole('button',{name:'Set as starting node',exact:true}).click();
 await page.getByRole('button',{name:'Close settings'}).click();
 await expect(middle.locator('.input-port')).toHaveCount(0);
 await expect(start.locator('.input-port')).toHaveCount(1);
 await expect(page.locator('.connections path[data-port]')).toHaveCount(1);
 await expect(page.getByText('Saved locally')).toBeVisible();
 await page.reload();
 await expect(middle.locator('.input-port')).toHaveCount(0);
 await expect(page.locator('.connections path[data-port]')).toHaveCount(1);
});

test('saving edited types and script preserves the latest dragged position',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'New workflow',exact:true}).click();
 const node=page.getByRole('button',{name:'Edit Starting node',exact:true});
 await node.click();
 await page.getByRole('combobox',{name:'Input type',exact:true}).selectOption('number');
 await page.getByRole('combobox',{name:'Output type',exact:true}).selectOption('string');
 await page.locator('#script').fill('async input => { await new Promise(resolve => setTimeout(resolve, 600)); return String(input); }');
 const box=await node.boundingBox();
 await page.mouse.move(box!.x+90,box!.y+45);await page.mouse.down();await page.mouse.move(box!.x+160,box!.y+75,{steps:8});await page.mouse.up();
 const wrap=node.locator('..');
 const moved=await wrap.getAttribute('style');
 await page.getByRole('button',{name:'Validate & save'}).click();
 await expect(page.getByRole('button',{name:'Validate & save'})).toBeDisabled();
 const nextBox=await node.boundingBox();
 await page.mouse.move(nextBox!.x+90,nextBox!.y+45);await page.mouse.down();await page.mouse.move(nextBox!.x+120,nextBox!.y+65,{steps:5});await page.mouse.up();
 const latest=await wrap.getAttribute('style');
 expect(latest).not.toEqual(moved);
 await expect(page.locator('.inspector')).toHaveCount(0);
 await expect(wrap).toHaveAttribute('style',latest!);
 await expect(node.locator('.node-types')).toHaveText(/number.*string/);
 await expect(page.getByText('Saved locally')).toBeVisible();
 await page.reload();
 await expect(node.locator('..')).toHaveAttribute('style',latest!);
});

test('shows both branch buttons immediately when selecting if-else and saves before connecting',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Edit Clean up text',exact:true}).click();
 await page.getByRole('combobox',{name:'Node type',exact:true}).selectOption('if-else');
 const truePath=page.getByRole('button',{name:'Connect Clean up text true path',exact:true});
 const falsePath=page.getByRole('button',{name:'Connect Clean up text false path',exact:true});
 await expect(truePath).toBeVisible();await expect(falsePath).toBeVisible();
 await expect(truePath).toHaveText('True');await expect(falsePath).toHaveText('False');
 expect((await truePath.boundingBox())!.y).toBeLessThan((await falsePath.boundingBox())!.y);
 await falsePath.click();
 await page.mouse.move(700,600);
 await expect(page.getByTestId('connection-preview')).toBeVisible();
 await expect(page.getByRole('button',{name:'Close settings'})).toHaveCount(0);
 await page.keyboard.press('Escape');
 await expect(page.getByText('Saved locally')).toBeVisible();
 await page.reload();
 await expect(page.getByRole('button',{name:'Connect Clean up text true path',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Connect Clean up text false path',exact:true})).toBeVisible();
});
