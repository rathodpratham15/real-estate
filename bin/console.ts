/*
|--------------------------------------------------------------------------
| Ace console entrypoint
|--------------------------------------------------------------------------
|
| The "console.ts" file is the entrypoint for running ace commands. You must
| call the "kernel.handle" method in this file to execute commands registered
| under the "commands" array.
|
*/

import { Ignitor, prettyPrintError } from '@adonisjs/core'

/**
 * URL to the application root. AdonisJS need it to resolve
 * paths to file and directories for scaffolding commands
 */
const APP_ROOT = new URL('../', import.meta.url)

/**
 * The importer is used to import files in context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')
    })
  })
  .ace()
  .handle(process.argv.slice(2))
  .catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
  })
