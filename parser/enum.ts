import { checkIfNotNullOrUndefined } from '../utils/checker.ts'
import { DocNodeEnum } from '../utils/docs.ts'

const enumToMarkdown = (node: DocNodeEnum): string => {
  const result: string[] = [`## enum ${node.name}`]

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

  // details
  if (node.enumDef.members.length !== 0) {
    result.push('\n\n')
    result.push(
      node.enumDef.members.map((member) => ' - ' + member.name).join('\n')
    )
  }

  // return
  return result.join('')
}

export { enumToMarkdown }
