/* eslint-env node */
const _ = require('lodash/fp')
const utils = require('../utils')
const glob = require('glob')
const fs = require('fs')

module.exports = {
  name: 'i18n:split',
  description:
    'split bundled i18n-pod locale into pod translations. \nUsage:\n ember i18n:split <locale>',
  works: 'insideProject',

  run(commandOptions, args) {
    let locale = args[0]
    let translations = _.flow(
      _.curry(utils.podLocaleBundlePath),
      _.curry(utils.readJsonFromModule)
    )(locale)

    _.each(
      x => this.splitPodTranslation(x, translations),
      glob.sync(`app/pods/**/translations.${locale}.y*ml`, {})
    )
  },

  splitPodTranslation(filePath, translations) {
    _.flow(
      _.split('/'),
      _.slice(2, -1),
      _.join('/'),
      _.curry(utils.translationPath),
      _.curry(path => _.get(path, translations)),
      _.curry(content => {
        if (!content) return fs.writeFileSync(filePath, '')
        utils.writeTranslations(filePath, content)
      })
    )(filePath)
  }
}
