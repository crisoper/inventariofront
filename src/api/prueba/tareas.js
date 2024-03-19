import request from '@/utils/request'

import Resource from "../resource";
class TareasResource extends Resource {
  constructor() {
    super("prueba/tareas");
  }
//  Methodo Get
//   algunmetodo(params) {
//     return request({
//         url: 'algunmetodo',
//         method: 'get',
//         params: params
//     })
//   }

//  Methodo Post
//   algunmetodo(data) {
//     return request({
//         url: 'algunmetodo',
//         method: 'post',
//         data: data
//     })
//   }
}

export { TareasResource as default }
