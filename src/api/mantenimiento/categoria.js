import request from '@/utils/request'

import Resource from "../resource";
class TareasResource extends Resource {
  constructor() {
    super("inventario/categorias");
  }
}

export { TareasResource as default }
