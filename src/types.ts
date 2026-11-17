export const dataTypes = ['string', 'number', 'boolean', 'object', 'array'] as const;
export type DataType = typeof dataTypes[number];
export type NodeType = 'transform' | 'if-else';
export type OutputPort = 'nextId' | 'trueNextId' | 'falseNextId';
export interface FlowNode { type: NodeType; trueNextId: string | null; falseNextId: string | null; id: string; name: string; inputType: DataType; outputType: DataType; script: string; x: number; y: number; nextId: string | null }
export interface Workflow { id: string; name: string; description: string; nodes: FlowNode[]; startNodeId: string; startingValue: string; updatedAt: string }
export const sampleFor = (type: DataType): unknown => ({string: 'hello world', number: 10, boolean: true, object: {value: 10}, array: [1, 2, 3]})[type];
export function matchesType(value: unknown, type: DataType): boolean { if(type === 'array') return Array.isArray(value); if(type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value); return typeof value === type && (type !== 'number' || Number.isFinite(value)); }
export function parseInput(value: string, type: DataType): unknown { const result = type === 'string' ? value : JSON.parse(value); if(!matchesType(result,type)) throw new Error(`Starting value must be a ${type}.`); return result; }
export function display(value: unknown): string { return typeof value === 'string' ? value : JSON.stringify(value, null, 2) ?? String(value); }

export function outputPorts(node: FlowNode): OutputPort[] { return node.type === 'if-else' ? ['trueNextId', 'falseNextId'] : ['nextId']; }
export function outputType(node: FlowNode): DataType { return node.type === 'if-else' ? 'boolean' : node.outputType; }
export function portY(port: OutputPort): number { return port === 'trueNextId' ? 61 : port === 'falseNextId' ? 112 : 78; }

/** Starting nodes have no incoming edges, including either conditional branch. */
export function removeStartingNodeInputs(workflow: Workflow): Workflow {
 return {...workflow,nodes:workflow.nodes.map(node=>({...node,
  nextId:node.nextId===workflow.startNodeId?null:node.nextId,
  trueNextId:node.trueNextId===workflow.startNodeId?null:node.trueNextId,
  falseNextId:node.falseNextId===workflow.startNodeId?null:node.falseNextId
 }))};
}
