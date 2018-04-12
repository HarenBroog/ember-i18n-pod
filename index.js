'use strict'

const utils = require('./lib/utils')
const commands = require('./lib/commands')
const I18nFilter = require('./lib/i18n-filter')
module.exports = {
  name: 'ember-i18n-pod',

  includedCommands() {
    return commands
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      registry.add('js', {
        name: 'ember-i18n-pod',
        ext: ['json', 'yml'],
        toTree(tree) {
          return new I18nFilter(tree)
        }
      })
    }
  }
}
