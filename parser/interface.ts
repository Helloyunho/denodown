import { DocNodeInterface } from '../utils/docs.ts'
import { TsType } from './tstype.ts'
import { typeParams } from './classes.ts'
import { params } from './functions.ts'
import { checkIfNotNullOrUndefined } from '../utils/checker.ts'

const interfaceToMarkdown = (node: DocNodeInterface) => {
  const parent = node
  const extendsItems = node.interfaceDef.extends.map((tstype) => {
    return TsType(tstype, parent.scope ?? [])
  })

  const result = [`# interface ${node.name}`]

  // suffix
  if (node.interfaceDef.typeParams.length !== 0) {
    result.push(
      `\\<${typeParams(node.interfaceDef.typeParams, node.scope ?? [])}\\>`
    )
  }
  if (extendsItems.length !== 0) {
    result.push(` extends ${extendsItems.join(', ')}`)
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

  // details
  if (node.interfaceDef.callSignatures.length !== 0) {
    result.push('\n\n## Call Signatures:\n')

    const callSignaturesMarkdowned = node.interfaceDef.callSignatures
      .map((node) => {
        const result = [`### • ${params(node.params, parent.scope ?? [])}`]

        if (checkIfNotNullOrUndefined(node.tsType)) {
          result.push(`: ${TsType(node.tsType, parent.scope ?? [])}`)
        }

        return result.join('')
      })
      .join('\n')

    result.push(callSignaturesMarkdowned)
  }
  if (node.interfaceDef.properties.length !== 0) {
    result.push('\n\n## Properties:\n')

    const propertiesMarkdowned = node.interfaceDef.properties
      .map((node) => {
        const result = [`### • ${node.name}`]

        if (node.optional) {
          result.push('?')
        }
        if (checkIfNotNullOrUndefined(node.tsType)) {
          result.push(`: ${TsType(node.tsType, parent.scope ?? [])}`)
        }

        return result.join('')
      })
      .join('\n')

    result.push(propertiesMarkdowned)
  }
  if (node.interfaceDef.methods.length !== 0) {
    result.push('\n\n## Methods:\n')

    const methodsMarkdowned = node.interfaceDef.methods
      .map((node) => {
        const result = [`### • ${node.name}`]

        if (node.optional) {
          result.push('?')
        }
        result.push(`(${params(node.params, parent.scope ?? [])})`)
        if (checkIfNotNullOrUndefined(node.returnType)) {
          result.push(`: ${TsType(node.returnType, parent.scope ?? [])}`)
        }

        return result.join('')
      })
      .join('\n')

    result.push(methodsMarkdowned)
  }
  if (node.interfaceDef.indexSignatures.length !== 0) {
    result.push('\n\n## Index Signatures:\n')

    const indexSignaturesMarkdowned = node.interfaceDef.indexSignatures
      .map((node) => {
        const result = [`### • `]

        if (node.readonly) {
          result.push('readonly ')
        }
        result.push(`[${params(node.params, parent.scope ?? [])}]`)
        if (checkIfNotNullOrUndefined(node.tsType)) {
          result.push(`: ${TsType(node.tsType, parent.scope ?? [])}`)
        }

        return result.join('')
      })
      .join('\n')

    result.push(indexSignaturesMarkdowned)
  }

  // return
  return result.join('')
}

export { interfaceToMarkdown }
