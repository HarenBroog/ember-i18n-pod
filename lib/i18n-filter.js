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
    let directoryPath = `app/${/([^/]*)\/(.*)\/translations(.*)/.exec(relativePath)[2]}`
    let podLocaleBundlePath = utils.podLocaleBundlePath(locale)
    utils.updateLocaleBasedOnFiles(
      podLocaleBundlePath, 
      glob.sync(`${directoryPath}/**/translations.${locale}.y*ml`, {})
    )
  }
}
