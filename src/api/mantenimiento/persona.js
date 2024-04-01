// import request from '@/utils/request'

import Resource from "../resource";
class PersonasResource extends Resource {
  constructor() {
    super("inventario/personas");
  }
}

export { PersonasResource as default }
