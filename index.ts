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
  const uri: string = parsed.args[0]

  if (uri === undefined) {
    console.log(errorText('No input file detected.'))
    Deno.exit(1)
  }

  await validateUri(uri)

  const startTime = Date.now()
  console.log(infoText('Reading files and generating nodes...'))

  const fileProcess = await Deno.run({
    cmd: ['deno', 'doc', uri, '--reload', '--json'],
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
  await main()
}

async function validateUri(uri: string) {
  let url: URL
  try {
    url = new URL(uri)
  } catch (error) {
    console.log(errorText(`Cannot parse '${uri}' to a valid URI!`))
    Deno.exit(1)
  }

  if (url.protocol.startsWith('http')) {
    // try to fetch file from URL
    const controller = new AbortController()
    const handle = setTimeout(() => controller.abort(), 10 * 1000) // 10 seconds timeout
    try {
      const res = await fetch(uri, {
        method: 'HEAD',
        signal: controller.signal
      })
      console.log(infoText('Entrypoint file check status:', res.status))
      clearTimeout(handle)
    } catch (e) {
      if (controller.signal.aborted) {
        console.log(errorText(`Download from '${uri}' timed out.`))
        Deno.exit(1)
      } else {
        throw e
      }
    }
  } else {
    // try to read file from disk
    try {
      await Deno.readTextFile(uri)
    } catch (e) {
      if (e.name === 'NotFound') {
        console.log(errorText(`File "${uri}" not found.`))
        Deno.exit(1)
      } else {
        throw e
      }
    }
  }
}
