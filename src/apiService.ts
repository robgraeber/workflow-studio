import { removeStartingNodeInputs, type Workflow } from './types';
const KEY = 'forma.workflows.v1';
const clone = <T,>(value: T): T => structuredClone(value);
function read(): Workflow[] { const raw = localStorage.getItem(KEY); if(!raw) return []; const data = JSON.parse(raw); if(!Array.isArray(data)) throw new Error('Stored workflow data is invalid.'); return data.map((w: Workflow) => ({...w, nodes: w.nodes.map(n => ({...n, type: n.type ?? 'transform', trueNextId: n.trueNextId ?? null, falseNextId: n.falseNextId ?? null}))})).map(removeStartingNodeInputs); }
function write(workflows: Workflow[]) { localStorage.setItem(KEY, JSON.stringify(workflows.map(removeStartingNodeInputs))); }
/** Async CRUD service. Replace this adapter with HTTP without changing the UI. */
export const apiService = {
 async listWorkflows(): Promise<Workflow[]> { return clone(read()); },
 async getWorkflow(id: string): Promise<Workflow> { const workflow = read().find(w => w.id === id); if(!workflow) throw new Error('Workflow not found.'); return clone(workflow); },
 async createWorkflow(workflow: Workflow): Promise<Workflow> { const all = read(); if(all.some(w => w.id === workflow.id)) throw new Error('Workflow already exists.'); const saved = {...removeStartingNodeInputs(clone(workflow)), updatedAt: new Date().toISOString()}; write([...all,saved]); return clone(saved); },
 async updateWorkflow(id: string, workflow: Workflow): Promise<Workflow> { const all = read(); const index = all.findIndex(w => w.id === id); if(index < 0) throw new Error('Workflow not found.'); const saved = {...removeStartingNodeInputs(clone(workflow)), id, updatedAt: new Date().toISOString()}; all[index] = saved; write(all); return clone(saved); },
 async deleteWorkflow(id: string): Promise<void> { write(read().filter(w => w.id !== id)); }
};
export function createWorkflow(name = 'Text transformation'): Workflow { const a = crypto.randomUUID(), b = crypto.randomUUID(), c = crypto.randomUUID(); return {id: crypto.randomUUID(), name, description: 'A little input. A world of possibilities.', startNodeId: a, startingValue: 'hello world', updatedAt: new Date().toISOString(), nodes: [
{type:'transform',trueNextId:null,falseNextId:null,id:a,name:'Clean up text',inputType:'string',outputType:'string',script:'function transform(input) {\n  return input.trim();\n}',x:100,y:185,nextId:b},
{type:'transform',trueNextId:null,falseNextId:null,id:b,name:'Make it uppercase',inputType:'string',outputType:'string',script:'function transform(input) {\n  return input.toUpperCase();\n}',x:435,y:185,nextId:c},
{type:'transform',trueNextId:null,falseNextId:null,id:c,name:'Count characters',inputType:'string',outputType:'number',script:'function transform(input) {\n  return input.length;\n}',x:770,y:185,nextId:null}]}; }
