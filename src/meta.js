/**
 * All meta information related tasks, like getting the code snippets and the language templates.
 */

import all from 'promise-all'

export function gatherCode (nodeIds, client, options) {
  return Promise.resolve([])
}

export function gatherTemplates (language, client, options) {
  return all({
    source: client.getConfig(`${language}/source`),
    compound: client.getConfig(`${language}/compound`),
    recursion: client.getConfig(`${language}/recursion`),
    process: client.getConfig(`${language}/process`)
  })
}
