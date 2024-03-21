import request from '@/utils/request'

import Resource from "../resource";
class TareasResource extends Resource {
  constructor() {
    super("inventario/areas");
  }
}

export { TareasResource as default }
