import HttpRequest from '@/libs/axios'
import config from '@/config'
export const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const axios = new HttpRequest(baseUrl)
export const post = (url, data, params = {}) => {
  return axios.request(Object.assign({
    url,
    data,
    method: 'post'
  }, params))
}

export const get = (url, data, params = {}) => {
  return axios.request(Object.assign({
    url,
    params: data,
    method: 'get'
  }, params))
}

export const del = (url, data, params = {}) => {
  return axios.request(Object.assign({
    url,
    params: data,
    method: 'delete'
  }, params))
}

export const put = (url, data, params = {}) => {
  return axios.request(Object.assign({
    url,
    data,
    method: 'put'
  }, params))
}
