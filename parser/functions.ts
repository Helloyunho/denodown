import { checkIfNotNullOrUndefined } from '../utils/checker.ts'
import { DocNodeFunction, ObjectPatPropDef, ParamDef } from '../utils/docs.ts'
import { TsType } from './tstype.ts'

const functionToMarkdown = (node: DocNodeFunction): string => {
  const scope = node.scope ?? []
  const result = [
    `# function ${node.scope?.join('.') ?? ''}${node.name}(${params(
      node.functionDef.params,
      scope
    )})`
  ]

  // suffix
  if (checkIfNotNullOrUndefined(node.functionDef.returnType)) {
    result.push(`: ${TsType(node.functionDef.returnType, scope)}`)
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

const param = (p: ParamDef, scope: string[]): string => {
  switch (p.kind) {
    case 'array': {
      const result = [`[${params(p.elements, scope)}]`]

      if (p.optional) {
        result.push('?')
      }
      if (checkIfNotNullOrUndefined(p.tsType)) {
        result.push(`: ${TsType(p.tsType, scope)}`)
      }

      return result.join('')
    }
    case 'assign': {
      const result = [param(p.left, scope)]

      if (checkIfNotNullOrUndefined(p.tsType)) {
        result.push(`: ${TsType(p.tsType, scope)}`)
      }

      return result.join('')
    }
    case 'identifier': {
      const result = [p.name]

      if (p.optional) {
        result.push('?')
      }
      if (checkIfNotNullOrUndefined(p.tsType)) {
        result.push(`: ${TsType(p.tsType, scope)}`)
      }

      return result.join('')
    }
    case 'object': {
      const result = [
        p.props.map((prop) => objectPatProp(prop, scope)).join(', ')
      ]

      if (p.optional) {
        result.push('?')
      }
      if (checkIfNotNullOrUndefined(p.tsType)) {
        result.push(`: ${TsType(p.tsType, scope)}`)
      }

      return result.join('')
    }
    case 'rest': {
      const result = [`...${param(p.arg, scope)}`]

      if (checkIfNotNullOrUndefined(p.tsType)) {
        result.push(`: ${TsType(p.tsType, scope)}`)
      }

      return result.join('')
    }
  }
}

const params = (ps: (ParamDef | null)[], scope: string[]): string => {
  return ps
    .map((p) => {
      if (p === null) {
        return ''
      } else {
        return param(p, scope)
      }
    })
    .join(', ')
}

const objectPatProp = (prop: ObjectPatPropDef, scope: string[]): string => {
  switch (prop.kind) {
    case 'assign':
    case 'keyValue': {
      return prop.key
    }
    case 'rest': {
      return param(prop.arg, scope)
    }
  }
}

export { param, params, objectPatProp, functionToMarkdown }
