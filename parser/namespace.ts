import { DocNodeNamespace, groupNodes, sortByAlphabet } from '../utils/docs.ts'
import { generateMarkdown } from '../utils/generate.ts'

const namespaceToMarkdown = (node: DocNodeNamespace, output: string) => {
  generateMarkdown(
    groupNodes(sortByAlphabet(node.namespaceDef.elements)),
    `${output}/${node.name}`
  )
}

export { namespaceToMarkdown }
