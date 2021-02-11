import { getNodes, getRuntimeBuiltinNodes } from '../consts.ts'
import {
  DocNodeClass,
  getFieldsForClassRecursive,
  getLinkByScopedName,
  TsTypeParamDef
} from '../utils/docs.ts'
import { params } from './functions.ts'
import { TsType, linkRef } from './tstype.ts'
import { checkIfNotNullOrUndefined } from '../utils/checker.ts'

const typeParams = (params: TsTypeParamDef[], scope: string[]): string => {
  return params
    .map((p) => {
      const result = [p.name]

      if (checkIfNotNullOrUndefined(p.constraint)) {
        result.push(` extends ${TsType(p.constraint, scope)}`)
      }
      if (checkIfNotNullOrUndefined(p.default)) {
        result.push(` = ${TsType(p.default, scope)}`)
      }

      return result.join('')
    })
    .join(', ')
}

const classToMarkdown = (node: DocNodeClass): string => {
  const constructors = node.classDef.constructors
  const indexSignatures = node.classDef.indexSignatures

  const fileNodes = getNodes()
  const fullClass = getFieldsForClassRecursive(fileNodes, node)

  const properties = fullClass.properties.filter(
    (node) => node.accessibility !== 'private'
  )
  const realProperties = properties.filter((node) => !node.isStatic)
  const staticProperties = properties.filter((node) => node.isStatic)

  const methods = fullClass.methods.filter(
    (node) => node.accessibility !== 'private'
  )
  const realMethods = methods.filter((node) => !node.isStatic)
  const staticMethod = methods.filter((node) => node.isStatic)

  const parent = node

  const { extends: extends_ } = node.classDef
  const runtimeBuiltins = getRuntimeBuiltinNodes()
  const extendsLink =
    extends_ !== undefined && extends_ !== null
      ? getLinkByScopedName(
          fileNodes,
          runtimeBuiltins,
          extends_,
          node.scope ?? []
        )
      : undefined

  const result: string[] = ['# ']

  // prefix
  if (node.classDef.isAbstract) {
    result.push('abstract ')
  }

  // name
  result.push(`class ${node.name}`)

  // suffix
  if (node.classDef.typeParams.length !== 0) {
    result.push(`\\<${typeParams(node.classDef.typeParams, node.scope ?? [])}>`)
  }
  if (checkIfNotNullOrUndefined(node.classDef.extends)) {
    result.push(` extends ${linkRef(extendsLink, node.classDef.extends)}`)
    if (node.classDef.superTypeParams.length !== 0) {
      result.push(
        `\\<${node.classDef.superTypeParams
          .map((tstype) => TsType(tstype, node.scope ?? []))
          .join(', ')}>`
      )
    }
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

  // contents
  if (constructors.length !== 0) {
    result.push('\n\n## Constructors:\n')
    result.push(
      constructors
        .map(
          (node) =>
            `### ${node.name}(${params(node.params, parent.scope ?? [])})`
        )
        .join('\n')
    )
  }
  if (realProperties.length !== 0) {
    result.push('\n\n## Properties:\n')
    const propertiesMarkdowned = realProperties
      .map((node) => {
        const result = ['### ']

        // prefix
        if (checkIfNotNullOrUndefined(node.accessibility)) {
          result.push(node.accessibility + ' ')
        }
        if (node.isAbstract) {
          result.push('abstract ')
        }
        if (node.readonly) {
          result.push('readonly ')
        }

        // name
        result.push(node.name)

        // suffix
        if (node.optional) {
          result.push('?')
        }
        if (node.tsType) {
          result.push(`: ${TsType(node.tsType, parent.scope ?? [])}`)
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
      })
      .join('\n')
    result.push(propertiesMarkdowned)
  }
  if (realMethods.length !== 0) {
    result.push('\n\n## Methods:\n')
    const methodsMarkdowned = realMethods
      .map((node) => {
        const result = ['### ']

        // prefix
        if (checkIfNotNullOrUndefined(node.accessibility)) {
          result.push(node.accessibility + ' ')
        }
        if (node.isAbstract) {
          result.push('abstract ')
        }
        switch (node.kind) {
          case 'getter':
            result.push('get ')
            break
          case 'setter':
            result.push('set ')
            break
        }

        // name
        result.push(node.name)

        // suffix
        if (node.optional) {
          result.push('?')
        }
        result.push(`(${params(node.functionDef.params, parent.scope ?? [])})`)
        if (node.functionDef.returnType) {
          result.push(
            `: ${TsType(node.functionDef.returnType, parent.scope ?? [])}`
          )
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
      })
      .join('\n')
    result.push(methodsMarkdowned)
  }
  if (indexSignatures.length !== 0) {
    result.push('\n\n## Index Signatures:\n')
    const indexSignaturesMarkdowned = indexSignatures
      .map((node) => {
        const result = ['### ']

        if (node.readonly) {
          result.push('readonly ')
        }
        result.push(`[${params(node.params, parent.scope ?? [])}]`)
        if (node.tsType) {
          result.push(`: ${TsType(node.tsType, parent.scope ?? [])}`)
        }

        return result.join('')
      })
      .join('\n')

    result.push(indexSignaturesMarkdowned)
  }
  if (staticProperties.length !== 0) {
    result.push('\n\n## Static Properties:\n')
    const propertiesMarkdowned = staticProperties
      .map((node) => {
        const result = ['### ']

        // prefix
        if (checkIfNotNullOrUndefined(node.accessibility)) {
          result.push(node.accessibility + ' ')
        }
        if (node.isAbstract) {
          result.push('abstract ')
        }
        if (node.readonly) {
          result.push('readonly ')
        }

        // name
        result.push(node.name)

        // suffix
        if (node.optional) {
          result.push('?')
        }
        if (node.tsType) {
          result.push(`: ${TsType(node.tsType, parent.scope ?? [])}`)
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
      })
      .join('\n')
    result.push(propertiesMarkdowned)
  }
  if (staticMethod.length !== 0) {
    result.push('\n\n## Static Methods:\n')
    const methodsMarkdowned = staticMethod
      .map((node) => {
        const result = ['### ']

        // prefix
        if (checkIfNotNullOrUndefined(node.accessibility)) {
          result.push(node.accessibility + ' ')
        }
        if (node.isAbstract) {
          result.push('abstract ')
        }
        switch (node.kind) {
          case 'getter':
            result.push('get ')
            break
          case 'setter':
            result.push('set ')
            break
        }

        // name
        result.push(node.name)

        // suffix
        if (node.optional) {
          result.push('?')
        }
        result.push(`(${params(node.functionDef.params, parent.scope ?? [])})`)
        if (node.functionDef.returnType) {
          result.push(
            `: ${TsType(node.functionDef.returnType, parent.scope ?? [])}`
          )
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
      })
      .join('\n')
    result.push(methodsMarkdowned)
  }

  // return
  return result.join('')
}

export { classToMarkdown, typeParams }
