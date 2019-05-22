/* eslint-disable */
import module from './js/index'
let myPlugin = {};
myPlugin.install = function(Vue, option = {}) {
  let config = module.config(option);
  Object.keys(module).forEach((m, i) => {
    switch(m) {
      case 'config':
        Vue.prototype[`${config.prefix}${m}`] = config;
      break;
      case 'prototype':
        Vue.prototype[`${config.prefix}${m}`] = Object.values(module)[i](config);
        break;
      case 'isIe':
        Vue.prototype[`${config.prefix}${m}`] = Object.values(module)[i];
        break;
      default:
        if (module.indexOf(config[m] === 'boolean') && config[m]) Vue.prototype[`${config.prefix}${m}`] = Object.values(module)[i];
        break;
    }
  })
};
export default myPlugin
