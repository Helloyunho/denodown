import { DirectoryCreationError } from './errors.ts'

const checkIfNotNullOrUndefined = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null

const checkAndCreateDir = (path: string) => {
  try {
    const { isDirectory } = Deno.statSync(path)
    if (!isDirectory) {
      throw new DirectoryCreationError(
        `There's a file in path ${path}. Please remove of rename it.`
      )
    }
  } catch (err) {
    if (err.name === 'NotFound') {
      Deno.mkdirSync(path, {
        recursive: true
      })
    } else {
      throw err
    }
  }
}

type SupportedSiteGenerators = 'vuepress' | 'docusaurus'

const checkIfSiteGeneratorActivated = (
  vuepress?: boolean,
  docusaurus?: boolean
): SupportedSiteGenerators[] => {
  const result: SupportedSiteGenerators[] = []

  if (vuepress) {
    result.push('vuepress')
  }
  if (docusaurus) {
    throw Error('This site generator is currently not supported.')
  }

  return result
}

export {
  checkAndCreateDir,
  checkIfNotNullOrUndefined,
  checkIfSiteGeneratorActivated
}

export type { SupportedSiteGenerators }
