import request from '@/utils/request'

import Resource from "../resource";
class TareasResource extends Resource {
  constructor() {
    super("inventario/tipobienes");
  }
}

export { TareasResource as default }
