import { SupportedSiteGenerators } from '../utils/checker.ts'
import { DocNodeNamespace, groupNodes, sortByAlphabet } from '../utils/docs.ts'
import { generateMarkdown } from '../utils/generate.ts'

const namespaceToMarkdown = (
  node: DocNodeNamespace,
  output: string,
  siteGenerators: SupportedSiteGenerators[]
) => {
  generateMarkdown({
    groups: groupNodes(sortByAlphabet(node.namespaceDef.elements)),
    pathPrefix: `${output}/${node.name}`,
    siteGenerators
  })
}

export { namespaceToMarkdown }
