const checkIfNotNullOrUndefined = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null

const checkAndCreateDir = (path: string) => {
  try {
    const { isDirectory } = Deno.statSync(path)
    if (!isDirectory) {
      throw Error(`There's a file in path ${path}. Please remove of rename it.`)
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

export { checkAndCreateDir, checkIfNotNullOrUndefined }
