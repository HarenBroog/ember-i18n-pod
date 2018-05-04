/* eslint-env node */
const Filter = require('broccoli-filter')
const _ = require('lodash/fp')
const utils = require('./utils')
const glob = require('glob')

module.exports = class I18nFilter extends Filter {
  constructor(inputNode, options) {
    super(inputNode, options)
  }

  getDestFilePath(path) {
    if (/.*\/translations\..*\.(json|yml|yaml)/.test(path))
      return path
  }

  processString(source, relativePath) {
    let locale = /translations\.(.*)\..*/.exec(relativePath)[1]
    let directoryPath = /(.*)\/translations(.*)/.exec(relativePath)[1]
    let podLocaleBundlePath = utils.podLocaleBundlePath(locale)
    let translations = utils.readJsonFromModule(podLocaleBundlePath)

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
      }, translations),
      _.curry(x => {
        utils.writeJsonToModule(podLocaleBundlePath, x)
      })
    )(glob.sync(`${directoryPath}/**/translations.${locale}.y*ml`, {}))
  }
}
