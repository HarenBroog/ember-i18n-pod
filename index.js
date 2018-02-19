'use strict';

const Filter  = require('broccoli-filter')
const fs      = require('fs')
const yaml    = require('js-yaml')
const _       = require('lodash/fp')
const jf      = require('jsonfile')
const fse     = require('fs-extra')

class I18nFilter extends Filter {
  constructor(inputNode, options) {
    super(inputNode, options)
  }

  getDestFilePath(path) {
    if(/.*\/translations\..*\.(yaml|yml)/.test(path))
      return path
  }

  processString(source, relativePath) {
    let locale = /translations\.(.*)\..*/.exec(relativePath)[1]
    let content = yaml.safeLoad(source)
    let key = relativePath.split('/').slice(2).reverse().slice(1).reverse().join('.')
    let localeFilePath = `app/locales/${locale}/i18n-pod.js`


    let finalize = (translations) => {
      let json = JSON.stringify(_.set(key, content, translations), null, 2)
      fse.outputFileSync(localeFilePath, `export default ${json}`)
    }

    if(fs.existsSync(localeFilePath)) {
      fs.readFile(localeFilePath, "utf8", function (error, content) {
        finalize(JSON.parse(content.replace('export default', '')))
      })
    } else {
      finalize({})
    }
  }
}

module.exports = {
  name: 'ember-i18n-pod',

  isDevelopingAddon() {
    return true
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      registry.add('js', {
        name: 'ember-i18n-pod',
        ext: 'yml',
        toTree(tree) {
          return new I18nFilter(tree)
        }
      })
    }
  }
};
