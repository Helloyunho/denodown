export class FileNotFoundError extends Error {
  name = 'FileNotFoundError'

  constructor(message?: string) {
    super(message)
  }
}

export class DirectoryCreationError extends Error {
  name = 'DirectoryCreationError'

  constructor(message?: string) {
    super(message)
  }
}
