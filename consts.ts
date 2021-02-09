import { DocNode } from './utils/docs.ts'

let RuntimeBuiltinNodes: DocNode[] | undefined
let Nodes: DocNode[] = []

const getRuntimeBuiltinNodes = (): DocNode[] | undefined => {
  return RuntimeBuiltinNodes
}

const getNodes = (): DocNode[] => {
  return Nodes
}

const setRuntimeBuiltinNodes = (nodes: DocNode[]) => {
  RuntimeBuiltinNodes = nodes
}

const setNodes = (nodes: DocNode[]) => {
  Nodes = nodes
}

export { getRuntimeBuiltinNodes, getNodes, setRuntimeBuiltinNodes, setNodes }
