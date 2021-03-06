const fs    = require('fs')
const Path  = require('path')
const fse   = require('fs-extra')
const _     = require('lodash/fp')
const yaml  = require('js-yaml')
const glob  = require('glob')
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
    _.curry(x => fse.outputFileSync(path, x))
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

utils.updateLocaleBundleBasedOnTree = function (locale, treeNodePath) {
  let podLocaleBundlePath = utils.podLocaleBundlePath(locale)
  _.flow(
    _.map(path => {
      let length = (path.match(/\//g) || []).length
      return { path, length }
    }),
    // Shortest path should be handler first.
    // (handling nested component translations)
    _.orderBy('length', 'asc'),
    _.map(x => x.path),
    _.reduce((acc, path) => {
      let key = path
        .split('/')
        .slice(2)
        .reverse()
        .slice(1)
        .reverse()
        .join('.')
      let data = utils.readTranslations(path)
      return _.set(key, data, acc)
    }, utils.readJsonFromModule(podLocaleBundlePath)),
    _.curry(x => {
      utils.writeJsonToModule(podLocaleBundlePath, x)
    })
  )(glob.sync(`${treeNodePath}/**/translations.${locale}.y*ml`, {}))
}

module.exports = utils
