import { checkIfNotNullOrUndefined } from '../utils/checker.ts'
import {
  DocNodeVariable,
  LiteralPropertyDef,
  TsTypeDefKind,
  TsTypeDefTypeLiteral
} from '../utils/docs.ts'
import { TsType } from './tstype.ts'

const variableToMarkdown = (node: DocNodeVariable): string => {
  const type = node.variableDef.tsType
  const isNamespace =
    node.variableDef.kind === 'const' &&
    type !== null &&
    type.kind === TsTypeDefKind.TypeLiteral &&
    type.typeLiteral.properties.length > 0 &&
    type.typeLiteral.methods.length === 0 &&
    type.typeLiteral.callSignatures.length === 0

  const result = [`# ${node.variableDef.kind} ${node.name}`]

  // suffix
  if (isNamespace) {
    result.push(
      '\n\n' +
        variableNamespaceToMarkdown(
          (type as TsTypeDefTypeLiteral).typeLiteral.properties,
          node
        )
    )
  } else if (type !== null) {
    result.push(`: ${TsType(type, node.scope ?? [])}`)
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

const variableNamespaceToMarkdown = (
  nodes: LiteralPropertyDef[],
  parent: DocNodeVariable
): string => {
  const result = [
    '## Properties:',
    '\n\n',
    nodes
      .map((node) => {
        const result = [`### ${node.name}`]

        if (checkIfNotNullOrUndefined(node.tsType)) {
          result.push(`: ${TsType(node.tsType, parent.scope ?? [])}`)
        }

        return result.join('')
      })
      .join('\n')
  ]

  return result.join('')
}

export { variableToMarkdown, variableNamespaceToMarkdown }
