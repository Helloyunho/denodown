import { checkIfNotNullOrUndefined } from '../utils/checker.ts'
import { DocNodeTypeAlias } from '../utils/docs.ts'
import { TsType } from './tstype.ts'

const typeAliasToMarkdown = (node: DocNodeTypeAlias): string => {
  const result = [`## type ${node.name}`]

  // suffix
  if (checkIfNotNullOrUndefined(node.typeAliasDef?.tsType)) {
    result.push(`: ${TsType(node.typeAliasDef.tsType, node.scope ?? [])}`)
  }

  // jsDoc
  if (checkIfNotNullOrUndefined(node.jsDoc)) {
    result.push(
      '\n\n' +
        node.jsDoc
          .split('\n')
          .map((jsdoc) => `> ${jsdoc}`)
          .join('\n> \n')
    )
  }
  return result.join('')
}

export { typeAliasToMarkdown }
