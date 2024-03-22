import request from '@/utils/request'

/**
 * Simple RESTful resource class
 */
class Resource {
  constructor(uri) {
    this.uri = uri
  }
  list(query) { // corresponde al metodo o funcion index del controlador
    return request({
      url: '/' + this.uri,
      method: 'get',
      params: query
    })
  }
  get(id) { // corresponde al metodo o funcion show del controlador
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'get'
    })
  }
  store(resource) { // corresponde al metodo o funcion store del controlador
    return request({
      url: '/' + this.uri,
      method: 'post',
      data: resource
    })
  }
  update(id, resource) { // corresponde al metodo o funcion update del controlador
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'put',
      data: resource
    })
  }
  destroy(id) { // corresponde al metodo o funcion destroy del controlador
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'delete'
    })
  }
}

export { Resource as default }
