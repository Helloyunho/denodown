import { GroupedNodes } from './docs.ts'
import { classToMarkdown } from '../parser/classes.ts'
import { enumToMarkdown } from '../parser/enum.ts'
import { functionToMarkdown } from '../parser/functions.ts'
import { interfaceToMarkdown } from '../parser/interface.ts'
import { variableToMarkdown } from '../parser/variable.ts'
import { typeAliasToMarkdown } from '../parser/typeAlias.ts'
import { namespaceToMarkdown } from '../parser/namespace.ts'
import { checkAndCreateDir } from './checker.ts'

const generateMarkdown = (groups: GroupedNodes, pathPrefix?: string) => {
  const outDirPath = `${pathPrefix ?? ''}`
  if (groups.functions.length !== 0) {
    checkAndCreateDir(`${outDirPath}/functions/`)
    groups.functions.forEach((func) => {
      const name = func.name
      const content = functionToMarkdown(func)

      Deno.writeTextFileSync(`${outDirPath}/functions/${name}.md`, content)
    })
  }

  if (groups.variables.length !== 0) {
    checkAndCreateDir(`${outDirPath}/variables/`)
    groups.variables.forEach((variable) => {
      const name = variable.name
      const content = variableToMarkdown(variable)

      Deno.writeTextFileSync(`${outDirPath}/variables/${name}.md`, content)
    })
  }

  if (groups.classes.length !== 0) {
    checkAndCreateDir(`${outDirPath}/classes/`)
    groups.classes.forEach((classes) => {
      const name = classes.name
      const content = classToMarkdown(classes)

      Deno.writeTextFileSync(`${outDirPath}/classes/${name}.md`, content)
    })
  }

  if (groups.enums.length !== 0) {
    checkAndCreateDir(`${outDirPath}/enums/`)
    groups.enums.forEach((enums) => {
      const name = enums.name
      const content = enumToMarkdown(enums)

      Deno.writeTextFileSync(`${outDirPath}/enums/${name}.md`, content)
    })
  }

  if (groups.interfaces.length !== 0) {
    checkAndCreateDir(`${outDirPath}/interfaces/`)
    groups.interfaces.forEach((interfaces) => {
      const name = interfaces.name
      const content = interfaceToMarkdown(interfaces)

      Deno.writeTextFileSync(`${outDirPath}/interfaces/${name}.md`, content)
    })
  }

  if (groups.typeAliases.length !== 0) {
    checkAndCreateDir(`${outDirPath}/typeAliases/`)
    groups.typeAliases.forEach((typeAliases) => {
      const name = typeAliases.name
      const content = typeAliasToMarkdown(typeAliases)

      Deno.writeTextFileSync(`${outDirPath}/typeAliases/${name}.md`, content)
    })
  }

  if (groups.namespaces.length !== 0) {
    checkAndCreateDir(`${outDirPath}/namespaces/`)
    groups.namespaces.forEach((namespaces) => {
      namespaceToMarkdown(namespaces, `${outDirPath}/namespaces`)
    })
  }
}

export { generateMarkdown }
