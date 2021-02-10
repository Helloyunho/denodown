import { getRuntimeBuiltinNodes, getNodes } from '../consts.ts'
import {
  getLinkByScopedName,
  LiteralDefKind,
  TsTypeDef,
  TsTypeDefKind
} from '../utils/docs.ts'
import { params } from './functions.ts'

const linkRef = (
  link: ReturnType<typeof getLinkByScopedName>,
  name: string
) => {
  switch (link?.type) {
    case 'local':
    case 'external': {
      return `[${name}](${link.href})`
    }
    case 'builtin': {
      return `[${name}](https://doc.deno.land/builtin/stable${link.href})`
    }
    case 'remote': {
      const url = link.remote
      if (url.startsWith('https://')) {
        return `[${name}](https://doc.deno.land/${url.replace(
          'https://',
          '/https/'
        )}#${link.node})`
      }
      return name
    }
    default: {
      return name
    }
  }
}

const TsType = (tstype: TsTypeDef, scope: string[]): string => {
  switch (tstype.kind) {
    case TsTypeDefKind.Array: {
      return `${TsType(tstype.array, scope)}[]`
    }
    case TsTypeDefKind.Conditional: {
      return (
        TsType(tstype.conditionalType.checkType, scope) +
        ' extends ? ' +
        TsType(tstype.conditionalType.trueType, scope) +
        ' : ' +
        TsType(tstype.conditionalType.falseType, scope)
      )
    }
    case TsTypeDefKind.FnOrConstructor: {
      return `${tstype.fnOrConstructor.constructor ? 'new ' : ''}(${params(
        tstype.fnOrConstructor.params,
        scope
      )}) => ${TsType(tstype.fnOrConstructor.tsType, scope)}`
    }
    case TsTypeDefKind.IndexedAccess: {
      return `${TsType(tstype.indexedAccess.objType, scope)}[${TsType(
        tstype.indexedAccess.indexType,
        scope
      )}]`
    }
    case TsTypeDefKind.Intersection: {
      const elements: string[] = tstype.intersection.map(
        (tstype) => TsType(tstype, scope) ?? 'undefined'
      )
      return elements.join(' & ')
    }
    case TsTypeDefKind.Keyword: {
      return tstype.keyword
    }
    case TsTypeDefKind.Literal: {
      switch (tstype.literal.kind) {
        case LiteralDefKind.Number: {
          return tstype.literal.number.toString()
        }
        case LiteralDefKind.String: {
          return tstype.literal.string
        }
        case LiteralDefKind.Boolean: {
          return tstype.literal.boolean.toString()
        }
      }
    }
    case TsTypeDefKind.Optional: {
      return `${TsType(tstype.optional, scope)}?`
    }
    case TsTypeDefKind.Parenthesized: {
      return `(${TsType(tstype.parenthesized, scope)})`
    }
    case TsTypeDefKind.Rest: {
      return `...${TsType(tstype.rest, scope)}`
    }
    case TsTypeDefKind.This: {
      return 'this'
    }
    case TsTypeDefKind.Tuple: {
      const elements: string[] = tstype.tuple.map(
        (tstype) => TsType(tstype, scope) ?? 'undefined'
      )
      return `[${elements.join(', ')}]`
    }
    case TsTypeDefKind.TypeLiteral: {
      const callSignatures = tstype.typeLiteral.callSignatures.map(
        (callSignature) =>
          `(${params(callSignature.params, scope)})${
            callSignature.tsType !== undefined && callSignature.tsType !== null
              ? `: ${TsType(callSignature.tsType, scope)}`
              : ''
          }`
      )
      const methods = tstype.typeLiteral.methods.map(
        (method) =>
          `${method.name}(${params(method.params, scope)})${
            method.returnType !== undefined && method.returnType !== null
              ? `${TsType(method.returnType, scope)}`
              : ''
          }`
      )
      const properties = tstype.typeLiteral.properties.map(
        (property) =>
          `${property.name}${
            property.tsType !== undefined && property.tsType !== null
              ? `: ${TsType(property.tsType, scope)}`
              : ''
          }`
      )
      const indexSignatures = tstype.typeLiteral.indexSignatures.map(
        (indexSignature) =>
          `${indexSignature.readonly ? 'readonly ' : ''} [${params(
            indexSignature.params,
            scope
          )}]${
            indexSignature.tsType !== undefined &&
            indexSignature.tsType !== null
              ? `: ${TsType(indexSignature.tsType, scope)} `
              : ''
          }`
      )

      const result: string[] = []

      return `{${result
        .concat(callSignatures, methods, properties, indexSignatures)
        .join(', ')}}`
    }
    case TsTypeDefKind.TypeOperator: {
      return `${tstype.typeOperator.operator} ${TsType(
        tstype.typeOperator.tsType,
        scope
      )}`
    }
    case TsTypeDefKind.TypeQuery: {
      const nodes = getNodes()
      const runtimeBuiltins = getRuntimeBuiltinNodes()
      const link = getLinkByScopedName(
        nodes,
        runtimeBuiltins,
        tstype.typeQuery,
        scope ?? []
      )

      return linkRef(link, tstype.typeQuery)
    }
    case TsTypeDefKind.TypeRef: {
      const nodes = getNodes()
      const runtimeBuiltins = getRuntimeBuiltinNodes()
      const link = getLinkByScopedName(
        nodes,
        runtimeBuiltins,
        tstype.typeRef.typeName,
        scope ?? [],
        'type'
      )
      const params = (tstype.typeRef.typeParams ?? [])
        .map((tstype) => TsType(tstype, scope))
        .join(', ')

      return `${linkRef(link, tstype.typeRef.typeName)}${
        tstype.typeRef.typeParams !== undefined &&
        tstype.typeRef.typeParams !== null
          ? `\\<${params}\\>`
          : ''
      }`
    }
    case TsTypeDefKind.Union: {
      const things: string[] = tstype.union.map(
        (tstype) => `${TsType(tstype, scope)}`
      )

      return things.join(' | ')
    }
    default: {
      return '_notimpl_'
    }
  }
}

export { TsType, linkRef }
