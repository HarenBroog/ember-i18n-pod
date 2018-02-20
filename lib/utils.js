const fs    = require('fs')
const Path  = require('path')
const fse   = require('fs-extra')
const _     = require('lodash/fp')
const yaml = require('js-yaml')
const utils = {}

let parseMethods = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  yml:  yaml.safeLoad
}

utils.podLocaleBundlePath = function(locale) {
  return `app/locales/${locale}/i18n-pod.js`
}

utils.parseTranslations = function(path, content) {
  let ext = Path.extname(path).replace('.', '')
  return parseMethods[ext](content)
}

utils.readTranslations = function(path) {
  let content = fs.readFileSync(path)
  return utils.parseTranslations(path, content)
}

utils.readJsonFromModule = function(path) {
  if(!fs.existsSync(path))
    return null
  return _.flow(
    _.curry(x => fs.readFileSync(x, { encoding: 'utf8'})),
    _.replace('export default', ''),
    _.curry(x => JSON.parse(x))
  )(path)
}

utils.writeJsonToModule = function(path, json) {
  return _.flow(
    _.curry(x => JSON.stringify(x, null, 2)),
    _.curry(x => `export default ${x}`),
    _.curry(x => fse.outputFileSync(path, x)),
  )(json)
}

module.exports = utils
