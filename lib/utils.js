const fs    = require('fs')
const Path  = require('path')
const fse   = require('fs-extra')
const _     = require('lodash/fp')
const yaml = require('js-yaml')
const utils = {}

utils.parseMethods = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  yml:  yaml.safeLoad
}

utils.dumpMethods = {
  json: x => JSON.stringify(x, null, 2),
  yaml: yaml.safeDump,
  yml:  yaml.safeDump
}

utils.podLocaleBundlePath = function(locale) {
  return `app/locales/${locale}/i18n-pod.js`
}

utils.parseTranslations = function(path, content) {
  let ext = Path.extname(path).replace('.', '')
  return utils.parseMethods[ext](content)
}

utils.readTranslations = function(path) {
  let content = fs.readFileSync(path)
  return utils.parseTranslations(path, content)
}

utils.writeTranslations = function(path, content) {
  let ext = Path.extname(path).replace('.', '')
  return fs.writeFileSync(path, utils.dumpMethods[ext](content))
}

utils.readJsonFromModule = function(path) {
  if(!fs.existsSync(path))
    return null
  return _.flow(
    _.curry(x => fs.readFileSync(x, { encoding: 'utf8'})),
    _.replace('export default', ''),
    _.curry(x => utils.parseMethods['json'](x))
  )(path)
}

utils.writeJsonToModule = function(path, json) {
  return _.flow(
    _.curry(x => utils.dumpMethods['json'](x)),
    _.curry(x => `export default ${x}`),
    _.curry(x => fse.outputFileSync(path, x)),
  )(json)
}

utils.translationPath = function(objectName, path = null) {
  return _.flow(
    _.replace(/\//g, '.'),
    _.replace('component:', 'components.'),
    _.replace(/^controller./, ''),
    _.curry(x => [x, path]),
    _.reject(x => !x),
    _.join('.'),
    _.split('.'),
    _.each(_.kebabCase),
    _.join('.')
  )(objectName)
}

module.exports = utils
