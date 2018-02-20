/* eslint-env node */
const Filter  = require('broccoli-filter')
const _       = require('lodash/fp')
const utils   = require('./utils')

module.exports = class I18nFilter extends Filter {
  constructor(inputNode, options) {
    super(inputNode, options)
  }

  getDestFilePath(path) {
    if(/.*\/translations\..*\.(json|yml|yaml)/.test(path))
      return path
  }

  processString(source, relativePath) {
    let locale = /translations\.(.*)\..*/.exec(relativePath)[1]
    let content = utils.parseTranslations(relativePath, source)
    let key = relativePath.split('/').slice(2).reverse().slice(1).reverse().join('.')
    let podLocaleBundlePath = utils.podLocaleBundlePath(locale)

    _.flow(
      _.curry(x => utils.readJsonFromModule(x)),
      _.set(key, content),
      _.curry(x => utils.writeJsonToModule(podLocaleBundlePath, x))
    )(podLocaleBundlePath)
  }
}
