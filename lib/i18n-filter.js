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
    let directoryPath = `app/${/([^/]*)\/(.*)\/translations(.*)/.exec(relativePath)[2]}`
    utils.updateLocaleBundleBasedOnTree(locale, directoryPath)
  }
}
