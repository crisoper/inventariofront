import request from '@/utils/request'

import Resource from '../resource'

class UserRequest extends Resource {
  constructor() {
    super('auth/usuarios')
  }

  fetchVendedores() {
    return request({
      url: '/' + this.uri + 'vendedores',
      method: 'get'
    })
  }
}

export { UserRequest as default }