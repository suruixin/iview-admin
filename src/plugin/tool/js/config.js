let config = (obj = {}) => {
  return Object.assign({
    cookies: true,
    indexOf: true,
    each: 'forEach',
    prefix: '$'
  }, process.env, obj)
}

export default config
