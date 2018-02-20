/* eslint-env node */
const _       = require('lodash/fp')
const glob    = require('glob')

module.exports = {
  name: 'i18n:import',
  description: 'split bundled i18n-pod locale into pod translations WIP',
  works: 'insideProject',

  run() {
    let files = glob.sync('app/locales/**/i18n-pod.js', {})

    _.flow(
      _.map(x => _.flow(
        _.split('/'),
        _.nth(2)
      )(x)),
      _.each(x => _.flow(
        _.curry(y => glob.sync(`app/pods/**/translations.${y}.y*ml`, {})),
        _.each(y => console.log(y))
      )(x))
    )(files)
  },
}
