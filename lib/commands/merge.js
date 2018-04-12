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
    )(glob.sync(`app/pods/**/translations.${locale}.y*ml`, {}))
  }
}
