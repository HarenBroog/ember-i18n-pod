import Helper from '@ember/component/helper'
import {inject as service} from '@ember/service'

export function localT(i18n, context, path, hash) {
  let objectName   = context._debugContainerKey
    .replace(/\//g, '.')
    .replace('component:', 'components.')
    .replace('controller:', '')

  let finalPath = [
    'pod',
    objectName,
    path
  ].join('.')
  .underscore()
  .replace('_', '-')

  return i18n.t(finalPath, hash)
}

export default Helper.extend({
  i18n: service(),

  compute(params, hash) {
    let [context, path] = params
    return localT(
      this.get('i18n'),
      context,
      path,
      hash
    )
  }
})
