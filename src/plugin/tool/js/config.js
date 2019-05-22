import con from '@/config'
let config = (obj = {}) => {
  return Object.assign({
    cookies: false,
    indexOf: true,
    each: 'forEach',
    prefix: '$'
  }, process.env, con, obj)
}

export default config
