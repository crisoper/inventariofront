// import request from '@/utils/request'

import Resource from "../resource";
class ProductoResource extends Resource {
  constructor() {
    super("inventario/productos");
  }
}

export { ProductoResource as default }
