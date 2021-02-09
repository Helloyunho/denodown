import { getNodes, setNodes, setRuntimeBuiltinNodes } from './consts.ts'
import {
  expandNamespaces,
  flattenNamespaces,
  groupNodes,
  sortByAlphabet
} from './utils/docs.ts'
import { generateMarkdown } from './utils/generate.ts'
import { FileNotFoundError } from './utils/errors.ts'
import { parse } from './deps.ts'

interface parsedArg {
  _: Array<string | number>
  out?: string
  vuepress?: boolean
  docusaurus?: boolean // maybe later
}

const parsed: parsedArg = parse(Deno.args)
const filename: string = parsed._[0].toString()

if (filename === undefined) {
  throw new FileNotFoundError(`Filename not detected.`)
}

try {
  Deno.readTextFileSync(filename)
} catch (error) {
  if (error.name === 'NotFound') {
    throw new FileNotFoundError(`File "${filename}" not found.`)
  } else {
    throw error
  }
}

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

const groups = groupNodes(sortByAlphabet(getNodes()))

generateMarkdown(groups, parsed.out ?? 'out/')
