import request from '@/utils/request'

import Resource from "../resource";
class AlmacenResource extends Resource {
  constructor() {
    super("inventario/alamacenes");
  }
}

export { AlmacenResource as default }
