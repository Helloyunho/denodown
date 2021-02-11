import { colors } from 'https://deno.land/x/cliffy@v0.17.2/ansi/colors.ts'

const errorText = (...args: any[]) =>
  `${colors.bgBrightRed.black('  ERROR  ')} ${args.join(' ')}`

const warningText = (...args: any[]) =>
  `${colors.bgYellow.black('  WARNING  ')} ${args.join(' ')}`

const infoText = (...args: any[]) =>
  `${colors.bgBrightCyan.black('  INFO  ')} ${args.join(' ')}`

const successText = (...args: any[]) =>
  `${colors.bgBrightGreen.black('  SUCCESS  ')} ${args.join(' ')}`

export { errorText, warningText, infoText, successText }
