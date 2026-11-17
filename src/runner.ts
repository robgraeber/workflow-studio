import { matchesType, outputType, type FlowNode } from './types';
export function runScript(node: FlowNode, input: unknown): Promise<unknown> {
 return new Promise((resolve,reject) => {
 const source = `self.onmessage = async ({data}) => { try { const fn = new Function('"use strict"; return (' + data.script + '\\n);')(); if(typeof fn !== 'function') throw new Error('Script must be a function taking one input parameter.'); const value = await fn(data.input); self.postMessage({ok:true,value}); } catch(e) { self.postMessage({ok:false,error:e.message || String(e)}); } };`;
 const url = URL.createObjectURL(new Blob([source], {type:'text/javascript'}));
 const worker = new Worker(url); const finish = () => {clearTimeout(timer);worker.terminate(); URL.revokeObjectURL(url);};
 const timer = setTimeout(() => {finish();reject(new Error('Script exceeded the 2 second time limit.'));},2000);
 worker.onmessage = ({data}) => {finish(); if(!data.ok) reject(new Error(data.error)); else if(!matchesType(data.value,outputType(node))) reject(new Error(`${node.name} must return ${outputType(node)}; received ${Array.isArray(data.value)?'array':data.value===null?'null':typeof data.value}.`)); else resolve(data.value);};
 worker.onerror = e => {finish();reject(new Error(e.message));};
 worker.postMessage({script:node.script,input});
 });
}
