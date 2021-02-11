import { GroupedNodes } from './docs.ts'
import { classToMarkdown } from '../parser/classes.ts'
import { enumToMarkdown } from '../parser/enum.ts'
import { functionToMarkdown } from '../parser/functions.ts'
import { interfaceToMarkdown } from '../parser/interface.ts'
import { variableToMarkdown } from '../parser/variable.ts'
import { typeAliasToMarkdown } from '../parser/typeAlias.ts'
import { namespaceToMarkdown } from '../parser/namespace.ts'
import { checkAndCreateDir, SupportedSiteGenerators } from './checker.ts'
import { warningText } from './consoleStyles.ts'

export interface VuepressSidebarConfig {
  title: string
  children: Array<string | VuepressSidebarConfig>
}

interface SidebarObject {
  vuepress?: VuepressSidebarConfig[]
}

export interface MarkdownGeneratorArgs {
  groups: GroupedNodes
  pathPrefix?: string
  siteGenerators: SupportedSiteGenerators[]
}

const generateMarkdown = ({
  groups,
  pathPrefix,
  siteGenerators
}: MarkdownGeneratorArgs) => {
  const sidebar: SidebarObject = {}
  const outDirPath = `${pathPrefix ?? ''}`
  if (groups.functions.length !== 0) {
    checkAndCreateDir(`${outDirPath}/functions/`)
    groups.functions.forEach((func) => {
      const name = func.name
      const content = functionToMarkdown(func)

      Deno.writeTextFileSync(`${outDirPath}/functions/${name}.md`, content)

      if (siteGenerators.includes('vuepress')) {
        if (sidebar.vuepress === undefined) {
          sidebar.vuepress = []
        }

        let sidebarFunction = sidebar.vuepress.find(
          (e) => e.title === 'Functions'
        )

        if (sidebarFunction === undefined) {
          const newLength = sidebar.vuepress.push({
            title: 'Functions',
            children: []
          })

          sidebarFunction = sidebar.vuepress[newLength - 1]
        }
        sidebarFunction.children.push(`functions/${name}`)
      }
    })
  }

  if (groups.variables.length !== 0) {
    checkAndCreateDir(`${outDirPath}/variables/`)
    groups.variables.forEach((variable) => {
      const name = variable.name
      const content = variableToMarkdown(variable)

      Deno.writeTextFileSync(`${outDirPath}/variables/${name}.md`, content)

      if (siteGenerators.includes('vuepress')) {
        if (sidebar.vuepress === undefined) {
          sidebar.vuepress = []
        }

        let sidebarVariables = sidebar.vuepress.find(
          (e) => e.title === 'Variables'
        )

        if (sidebarVariables === undefined) {
          const newLength = sidebar.vuepress.push({
            title: 'Variables',
            children: []
          })

          sidebarVariables = sidebar.vuepress[newLength - 1]
        }
        sidebarVariables.children.push(`variables/${name}`)
      }
    })
  }

  if (groups.classes.length !== 0) {
    checkAndCreateDir(`${outDirPath}/classes/`)
    groups.classes.forEach((classes) => {
      const name = classes.name
      const content = classToMarkdown(classes)

      Deno.writeTextFileSync(`${outDirPath}/classes/${name}.md`, content)

      if (siteGenerators.includes('vuepress')) {
        if (sidebar.vuepress === undefined) {
          sidebar.vuepress = []
        }

        let sidebarClasses = sidebar.vuepress.find((e) => e.title === 'Classes')

        if (sidebarClasses === undefined) {
          const newLength = sidebar.vuepress.push({
            title: 'Classes',
            children: []
          })

          sidebarClasses = sidebar.vuepress[newLength - 1]
        }
        sidebarClasses.children.push(`classes/${name}`)
      }
    })
  }

  if (groups.enums.length !== 0) {
    checkAndCreateDir(`${outDirPath}/enums/`)
    groups.enums.forEach((enums) => {
      const name = enums.name
      const content = enumToMarkdown(enums)

      Deno.writeTextFileSync(`${outDirPath}/enums/${name}.md`, content)

      if (siteGenerators.includes('vuepress')) {
        if (sidebar.vuepress === undefined) {
          sidebar.vuepress = []
        }

        let sidebarEnums = sidebar.vuepress.find((e) => e.title === 'Enums')

        if (sidebarEnums === undefined) {
          const newLength = sidebar.vuepress.push({
            title: 'Enums',
            children: []
          })

          sidebarEnums = sidebar.vuepress[newLength - 1]
        }
        sidebarEnums.children.push(`enums/${name}`)
      }
    })
  }

  if (groups.interfaces.length !== 0) {
    checkAndCreateDir(`${outDirPath}/interfaces/`)
    groups.interfaces.forEach((interfaces) => {
      const name = interfaces.name
      const content = interfaceToMarkdown(interfaces)

      Deno.writeTextFileSync(`${outDirPath}/interfaces/${name}.md`, content)

      if (siteGenerators.includes('vuepress')) {
        if (sidebar.vuepress === undefined) {
          sidebar.vuepress = []
        }

        let sidebarInterfaces = sidebar.vuepress.find(
          (e) => e.title === 'Interfaces'
        )

        if (sidebarInterfaces === undefined) {
          const newLength = sidebar.vuepress.push({
            title: 'Interfaces',
            children: []
          })

          sidebarInterfaces = sidebar.vuepress[newLength - 1]
        }
        sidebarInterfaces.children.push(`interfaces/${name}`)
      }
    })
  }

  if (groups.typeAliases.length !== 0) {
    checkAndCreateDir(`${outDirPath}/typeAliases/`)
    groups.typeAliases.forEach((typeAliases) => {
      const name = typeAliases.name
      const content = typeAliasToMarkdown(typeAliases)

      Deno.writeTextFileSync(`${outDirPath}/typeAliases/${name}.md`, content)

      if (siteGenerators.includes('vuepress')) {
        if (sidebar.vuepress === undefined) {
          sidebar.vuepress = []
        }

        let sidebarTypeAliases = sidebar.vuepress.find(
          (e) => e.title === 'TypeAliases'
        )

        if (sidebarTypeAliases === undefined) {
          const newLength = sidebar.vuepress.push({
            title: 'TypeAliases',
            children: []
          })

          sidebarTypeAliases = sidebar.vuepress[newLength - 1]
        }
        sidebarTypeAliases.children.push(`typeAliases/${name}`)
      }
    })
  }

  if (groups.namespaces.length !== 0) {
    checkAndCreateDir(`${outDirPath}/namespaces/`)
    groups.namespaces.forEach((namespaces) => {
      namespaceToMarkdown(
        namespaces,
        `${outDirPath}/namespaces`,
        siteGenerators
      )
      if (siteGenerators.includes('vuepress')) {
        console.log(
          warningText(
            `Generating sidebar config for namespaces are currently not supported. Skipping namespace ${namespaces.name}...`
          )
        )
      }
    })
  }

  return sidebar
}

export { generateMarkdown }
