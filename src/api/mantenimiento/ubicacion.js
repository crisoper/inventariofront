import request from '@/utils/request'

import Resource from "../resource";
class UbicacionesResource extends Resource {
  constructor() {
    super("inventario/ubicaciones");
  }
}

export { UbicacionesResource as default }
