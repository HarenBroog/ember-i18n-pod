/* eslint-env node */
const _ = require('lodash/fp')
const utils = require('../utils')
const fs = require('fs')

module.exports = {
  name: 'i18n:merge',
  description:
    'merge pod translations into bundled i18n-pod locale . \nUsage:\n ember i18n:merge <locale>',
  works: 'insideProject',

  run(commandOptions, args) {
    let locale = args[0]
    utils.updateLocaleBundleBasedOnTree(locale, 'app/pods')
  }
}
