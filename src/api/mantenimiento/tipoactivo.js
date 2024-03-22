import request from '@/utils/request'

import Resource from "../resource";
class TareasResource extends Resource {
  constructor() {
    super("inventario/tipoactivos");
  }
}

export { TareasResource as default }
