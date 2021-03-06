import { getNodes, setNodes, setRuntimeBuiltinNodes } from './consts.ts'
import {
  expandNamespaces,
  flattenNamespaces,
  groupNodes,
  sortByAlphabet
} from './utils/docs.ts'
import { generateMarkdown } from './utils/generate.ts'
import { checkIfSiteGeneratorActivated } from './utils/checker.ts'
import { Command } from './deps.ts'
import { errorText, infoText, doneText } from './utils/consoleStyles.ts'

interface parsedOptions {
  filename: string
  out: string
  vuepress: boolean
  docusaurus: boolean // maybe later
}

const main = async (): Promise<void> => {
  const parsed = await new Command<parsedOptions, string[]>()
    .name('Denodown')
    .description('Document generator for Deno projects.')
    .arguments('<filename:string>')
    .option('-o, --out <out>', 'Sets the output directory.', {
      default: 'out'
    })
    .option(
      '-v, --vuepress [vuepress:boolean]',
      'Sets vuepress mode to enable.',
      {
        default: false
      }
    )
    .parse(Deno.args)
  const filename: string = parsed.args[0]

  if (filename === undefined) {
    console.log(errorText('Filename not detected.'))
    Deno.exit(1)
  }

  try {
    Deno.readTextFileSync(filename)
  } catch (error) {
    if (error.name === 'NotFound') {
      console.log(errorText(`File "${filename}" not found.`))
      Deno.exit(1)
    } else {
      throw error
    }
  }

  const startTime = Date.now()
  console.log(infoText('Reading files and generating nodes...'))

  const fileProcess = await Deno.run({
    cmd: ['deno', 'doc', filename, '--reload', '--json'],
    stdout: 'piped'
  })
  const textDecoder = new TextDecoder()
  const fileJSON = textDecoder.decode(await fileProcess.output())

  setNodes(flattenNamespaces(expandNamespaces(JSON.parse(fileJSON))))

  const builtinProcess = await Deno.run({
    cmd: ['deno', 'doc', '--builtin', '--json'],
    stdout: 'piped'
  })
  const builtinJSON = textDecoder.decode(await builtinProcess.output())
  setRuntimeBuiltinNodes(
    flattenNamespaces(expandNamespaces(JSON.parse(builtinJSON)))
  )

  const siteGenerators = checkIfSiteGeneratorActivated(
    parsed.options.vuepress,
    parsed.options.docusaurus
  )

  const groups = groupNodes(sortByAlphabet(getNodes()))

  console.log(infoText('Generating markdown files...'))

  const configResult = generateMarkdown({
    groups,
    pathPrefix: parsed.options.out,
    siteGenerators
  })

  if (configResult.vuepress !== undefined) {
    Deno.writeTextFileSync(
      `${parsed.options.out}/vuepress-sidebar.js`,
      '// Move this config to where your vuepress config is in and import this config.\n' +
        '// And then you can use this config like this:\n' +
        '// "/": require("vuepress-sidebar")\n' +
        '// For more information please check this page: https://vuepress.vuejs.org/theme/default-theme-config.html#sidebar' +
        `module.exports = ${Deno.inspect(configResult.vuepress, {
          depth: 100,
          iterableLimit: Infinity
        })}`
    )
  }

  console.log(doneText(`Done! Took ${Date.now() - startTime}ms.`))
}

if (import.meta.main) {
  main()
}
