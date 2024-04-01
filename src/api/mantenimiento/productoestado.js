// import request from '@/utils/request'

import Resource from "../resource";
class ProductoEstadoResource extends Resource {
  constructor() {
    super("inventario/productoestados");
  }
}

export { ProductoEstadoResource as default }