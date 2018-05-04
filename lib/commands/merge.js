/* eslint-env node */
const _ = require('lodash/fp')
const utils = require('../utils')
const glob = require('glob')
const fs = require('fs')

module.exports = {
  name: 'i18n:merge',
  description:
    'merge pod translations into bundled i18n-pod locale . \nUsage:\n ember i18n:merge <locale>',
  works: 'insideProject',

  run(commandOptions, args) {
    let locale = args[0]
    let podLocaleBundlePath = utils.podLocaleBundlePath(locale)
    utils.updateLocaleBasedOnFiles(
      podLocaleBundlePath,
      glob.sync(`app/pods/**/translations.${locale}.y*ml`, {})
    )
  }
}
