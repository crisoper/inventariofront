<template>
  <div v-if="inventario_id > 0" v-loading="loadingData">
    <!-- <h2>{{ inventario_id }}</h2> -->
    <el-form
      ref="formAdditem"
      :model="modelForm"
      :rules="reglasValidacionForm"
      label-width="120px"
      class="demo-form"
      label-position="top"
    >
      <div class="p-3">
        <el-card class="box-card" shadow="never">
          <el-row :gutter="12">
            <el-col :xs="24" :sm="24" :md="11">
              <el-form-item label="Area" prop="area_id">
                <el-select
                  v-model="modelForm.area_id"
                  placeholder="Seleccionar"
                  style="width: 100%"
                  :clearable="true"
                >
                  <el-option
                    v-for="area in lAreas"
                    :key="area.id"
                    :label="area.nombre"
                    :value="area.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="13" class="hidden-icon-valid">
              <el-form-item label="Producto" prop="producto_id">
                <template #label>
                  <div style="display: flex; justify-content: space-between">
                    <span>Producto</span>
                    <el-button @click="nuevoProducto" type="primary" link :icon="Plus" :underline="false">
                      <span class="text-muted">Nuevo</span>
                    </el-button>
                  </div>
                </template>
                <div class="divSelectProducto">
                  <el-select
                    v-model="modelForm.producto_id"
                    placeholder="Buscar código o nombre"
                    popper-class="selectProducto"
                    style="width: 100% !important"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    loading-text="Buscando..."
                    :loading="loadingProducto"
                    :remote-method="getPructoPorNombre"
                    @clear="clearSelectProducto"
                    @change="changeSelectProducto"
                  >
                    <el-option
                      v-for="item in listProductos"
                      :key="item.id"
                      :label="item.codigo + ' - ' + item.nombre"
                      :value="item.id"
                    >
                      <div class="optionProducto">
                        <p>{{ item.codigo }} - {{ item.nombre }}</p>
                        <p>{{ item.descripcion }}</p>
                        <p>
                          <small>Percy Crisólogo Bardales</small>
                        </p>
                        <p>
                          <small>Almacen</small>
                        </p>
                      </div>
                    </el-option>
                  </el-select>
                </div>
                <el-button
                  ref="btnAddProduct"
                  type="primary"
                  plain
                  :icon="Plus"
                  @click="addProductoDetalle"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <div class="box-card mt-3" shadow="never">
          <el-table :border="true" :stripe="true" :data="detalleInventario" style="width: 100% !important">
            <el-table-column prop="area.nombre" label="ÁREA" min-width="180" />
            <el-table-column prop="producto.codigo" label="CÓDIGO" width="110" />
            <el-table-column prop="producto.nombre" label="PRODUCTO" min-width="180" />
            <el-table-column label="Acciones" width="180">
              <template #header>
                <el-button
                :disabled="!detalleInventario.length > 0"
                type="primary"
                @click="submitDetalleInventario"
                >
                  {{ modelForm.id === undefined ? "Guardar" : "Actualizar" }}
                </el-button>
                <el-button
                  ref="btnAddProduct"
                  type="danger"
                  :icon="Close"
                  @click="cancelar()"
                />
              </template>
              <template #default="scope">
                <div class="text-center">
                  <el-icon @click="quitarProducto(scope.row)" color="#e94560" size="18px" class="icon-btn pointer" title="Detalle">
                    <Remove />
                  </el-icon>
                  <el-icon v-if="scope.row.archivo_existe" @click="imprimirItem(scope.row.archivo_url)" color="#333333" size="18px" class="icon-btn pointer" title="Imprimir">
                    <ScaleToOriginal />
                  </el-icon>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-form>
    <el-dialog
      v-model="dialogBuscarProducto"
      title="Buscar producto"
      width="85%"
      top="5vh"
      :close-on-click-modal="false"
      :appeappend-to-body="true"
    >
      <div>
        Modal buscar producto
        <!-- <form-buscar-persona
          ref="modalBuscarPropietario"
          @childEmitPersona="parentProcessEmitPersona($event)"
        /> -->
      </div>
    </el-dialog>
  </div>
  <div v-else>
    <p>
      Los datos no fueron cargados correctamente.
    </p>
    <p>
      Por favor, inténtelo nuevamente.
    </p>
  </div>
</template>

<script>
// import { h } from 'vue'
import { ElNotification } from 'element-plus'
import { Plus, Remove, Close, ScaleToOriginal } from "@element-plus/icons-vue"
import Resource from "@/api/resource"
const areasResource = new Resource("inventario/all/areas")
const productosResource = new Resource("inventario/all/productos")
const invdetalleResource = new Resource("inventario/inventariodetalle")
export default {
  name: "InventarioInventariarView",
  components: {
    Remove,
    ScaleToOriginal,
  },
  props: {
    inventarioid: {
      type: Number,
      required: true,
      default: () => {
        return -11
      },
    },
  },
  data() {
    const validateProducto = (rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error("El campo es requerido"))
      } else {
        callback()
      }
    }
    return {
      Plus,
      Remove,
      Close,
      inventario_id: -19,
      loadingData: false,
      createUserForm: "",
      tiposDocIdentidad: [],
      lAreas: [],
      lProductos: [],
      loadingProducto: false,
      listProductos: [],
      dialogBuscarPersona: false,
      modelForm: {
        area_id: undefined,
        producto_id: undefined,
      },
      reglasValidacionForm: {
        area_id: [
          { required: true, message: "Campo requerido", trigger: "blur" },
        ],
        producto_id: [
          { validator: validateProducto, trigger: "blur" },
        ],
      },
      detalleInventario: [],
      dialogBuscarProducto: false,
    }
  },
  watch: {
    inventarioid: function () {
      this.setCrearOUpdate()
    },
  },
  computed: {},
  created() {},
  mounted() {
    this.getAllAreas()
    setTimeout(function() {
      if(this.inventario_id <= 0) {
        console.log("Invetario inválido")
        this.$emit("close", {})
      }
    }, 500);
  },
  methods: {
    async getAllAreas() {
      await areasResource
        .list({})
        .then((response) => {
          this.lAreas = response.data
        })
        .catch((error) => {
          console.log(error)
          close("canceled")
        })
    },
    setCrearOUpdate() {
      console.log("Inventariar inventario_id: " + this.inventarioid)
      this.$nextTick(() => {
        if (this.inventario_id !== "action" && this.inventario_id !== "create") {
          this.inventario_id = this.inventarioid
          this.resetData()
        } else {
          this.item_id = undefined
          this.handleCreate()
        }
        // this.resetForm("formAdditem")
        this.resetModel()
      })
    },
    resetData() {
      this.modelForm = {
        area_id: undefined,
        producto_id: undefined,
      }
      this.listProductos = []
      this.detalleInventario = []
    },
    handleCreate() {
      console.log("Open form create, set focus")
      // this.$refs['inputFocusCreate'].focus()
    },
    saveEditForm() {
      this.loadingData = true
      areasResource
        .update(this.item_id, this.modelForm)
        .then((response) => {
          const { state, message } = response
          this.$message({
            type: state,
            message,
          })
          this.loadingData = false
          this.close("success")
        })
        .catch(() => {
          this.loadingData = false
        })
    },
    close(status) {
      // if (this.createUserForm) {
      //   this.createUserForm.resetFields()
      // }
      this.$emit("closeChild", status)
    },
    searchAsociacion() {
      this.dialogBuscarPersona = true
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    resetModel() {
      this.modelForm = {
        area_id: undefined,
        producto_id: undefined,
      }
    },
    parentProcessEmitPersona(data) {
      console.log(data)
      this.modelForm.id_persona = data.id
      this.$refs["emailField"].focus()
    },
    async getPructoPorNombre(query) {
      this.listProductos = []
      await productosResource.list({ keybuscar: query }).then((response) => {
        const { data } = response
        this.listProductos = data
      })
    },
    clearSelectProducto() {
      this.modelForm.producto_id = undefined
    },
    changeSelectProducto() {
      // this.addProductoDetalle()
    },
    addProductoDetalle() {
      this.$refs['formAdditem'].validate((valid) => {
        if (valid) {

          const productoExistente = this.detalleInventario.some(
            (objeto) => {
              // console.log('Producto: ' + objeto.producto_id)
              return objeto.producto_id === this.modelForm.producto_id
          })
          if (productoExistente) {
            this.mostrarNotificacion('Atención', 'El producto se encuentra en la lista')
          } else {
            this.processAddItem()
          }

        } else {
          return false
        }
      })
    },
    processAddItem() {
      const foundArea = this.lAreas.find(area => area.id === this.modelForm.area_id)
      const foundProducto = this.listProductos.find(producto => producto.id === this.modelForm.producto_id)
      this.detalleInventario.push({
        area: foundArea,
        area_id: foundArea.id,
        producto: foundProducto,
        producto_id: foundProducto.id,
        producto_codigo: foundProducto.codigo,
        archivo_url: '',
        archivo_existe: false,  
        id: undefined,  
      })
      this.modelForm.producto_id = undefined
    },
    nuevoProducto() {
      // console.log('Nuevo producto')
      // this.$refs['btnAddProduct'].focus()
      this.dialogBuscarProducto = true
    },
    cancelar() {
      this.$emit('close', {
        action: 'cancelar',
      })
    },
    quitarProducto(producto) {
      const indice = this.detalleInventario.findIndex(objeto => objeto.producto_id === producto.producto_id)
      if (indice !== -1) {
        this.detalleInventario.splice(indice, 1)
        this.mostrarNotificacion('Atención', 'Producto quitado de la lista')
      } else {
        this.mostrarNotificacion('Atención', 'El producto no ha sido encontrado')
      }
    },
    submitDetalleInventario() {
      this.loadingData = true
      invdetalleResource
      .store({
        inventario_id: this.inventario_id,
        detalle: this.detalleInventario
      })
      .then((response) => {
          this.loadingData = false
          // console.log(response)
          const { data, state, message } = response
          if (state === 'success') {
            this.setAccionesPostGuardar(data)
          }
          this.mostrarNotificacion('Atención', message)
        })
        .catch((error) => {
          this.loadingData = false
          console.log(error)
        })
        .finally(() => {
          this.loadingData = false
        })
    },
    setAccionesPostGuardar(data) {
      this.detalleInventario.forEach((objeto) => {
        // console.log(objeto)
        objeto.id = data[objeto.producto_id]?.id
        objeto.archivo_url = data[objeto.producto_id]?.archivo_url
        objeto.archivo_existe = data[objeto.producto_id]?.archivo_existe
      })
    },
    imprimirItem(url) {
      const link = document.createElement('a')
      link.href = url
      document.body.appendChild(link)
      link.click()
    },
    mostrarNotificacion(title, message) {
      ElNotification({title, message})
    }
  },
}
</script>
<style scoped>
.divSelectProducto {
  width: calc(100% - 50px);
}

.selectProducto .el-select-dropdown__item {
  padding-top: 6px !important;
  padding-bottom: 3px !important;
  height: 110px !important;
  line-height: 20px !important;
  border-bottom: 1px solid #dfe4ed !important;
}

.selectProducto p {
  padding-top: 1px !important;
  padding-bottom: 1px !important;
  margin-block-start: 2px !important;
  margin-block-end: 2px !important;
}
</style>
