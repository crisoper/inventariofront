<template>
  <div v-loading="loadingData">
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
              <el-form-item label="Responsable" prop="responsable_id">
                <el-select
                  v-model="modelForm.responsable_id"
                  placeholder="Seleccionar"
                  style="width: 100%"
                  :filterable="true"
                  :clearable="true"
                  @clear="modelForm.responsable_id = undefined"
                >
                  <el-option
                    v-for="responsable in lResponsables"
                    :key="responsable.id"
                    :label="responsable.documento_numero + ' - ' + responsable.full_name"
                    :value="responsable.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="13" class="hidden-icon-valid">
              <el-form-item label="Producto" prop="producto_id">
                <template #label>
                  <div style="display: flex; justify-content: space-between">
                    <span>Producto</span>
                    <el-button
                      @click="nuevoProducto"
                      type="primary"
                      link
                      :icon="Plus"
                      :underline="false"
                    >
                      <span class="text-muted">Nuevo</span>
                    </el-button>
                  </div>
                </template>
                <div class="divSelectProducto">
                  <el-select
                    :disabled="modelForm.responsable_id === undefined"
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
                      :disabled="
                        item.inventarios && item.inventarios.length > 0
                      "
                    >
                      <div class="optionProducto">
                        <p>{{ item.codigo }} - {{ item.nombre }}</p>
                        <!-- <p>{{ item.descripcion }}</p> -->
                        <p>
                          <strong>Responsable: </strong
                          ><small>{{
                            item.ultimaasignacionresponsable != null &&
                            item.ultimaasignacionresponsable.responsable != null
                              ? item.ultimaasignacionresponsable.responsable
                                  .full_name
                              : "No se reconoce responsable"
                          }}</small>
                        </p>
                        <p>
                          <strong>Área: </strong
                          ><small>{{ item?.ultimaasignacionresponsable?.area?.nombre }}</small>
                        </p>
                        <p>
                          <strong>Ubicación: </strong
                          ><small>{{ item?.ultimaasignacionresponsable?.ubicacion?.nombre }}</small>
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
          <el-table
            :border="true"
            :stripe="true"
            :data="detalleInventario"
            style="width: 100% !important; font-size: 95%;"
          >
            <el-table-column
              prop="producto.codigo"
              label="CÓDIGO"
              width="110"
            />
            <el-table-column
              prop="producto.nombre"
              label="PRODUCTO"
              min-width="180"
            />
            <!-- Campos de formulario -->
            <el-table-column label="ÁREA" min-width="210">
              <template #default="scope">
                <el-select
                  v-model="scope.row.area_id"
                  placeholder="Seleccionar"
                  style="width: 100%"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in lAreas"
                    :key="item.id"
                    :label="item.nombre"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="UBICACION" min-width="200">
              <template #default="scope">
                <el-select
                  v-model="scope.row.ubicacion_id"
                  :filterable="true"
                  style="width: 100% !important"
                  placeholder="Seleccionar"
                >
                  <el-option
                    v-for="ubicacion in lUbicaciones"
                    :key="ubicacion.id"
                    :label="ubicacion.nombre"
                    :value="ubicacion.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="CONDICIÓN" width="160">
              <template #default="scope">
                <el-select
                  v-model="scope.row.condicion"
                  style="width: 100%"
                  :filterable="true"
                  placeholder="Seleccionar"
                >
                  <el-option
                    v-for="item in lCondiciones"
                    :key="item.id"
                    :label="item.nombre"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="ESTADO" width="126">
              <template #default="scope">
                <el-select
                  v-model="scope.row.producto_estado_id"
                  style="width: 100%"
                  :filterable="true"
                  placeholder="Seleccionar"
                >
                  <el-option
                    v-for="item in opcionesProductosEstados"
                    :key="item.id"
                    :label="item.nombre"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="FECHA" width="150">
              <template #default="scope">
                <el-date-picker
                  v-model="scope.row.fecha"
                  placeholder="Seleccionar"
                  :clearable="false"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </template>
            </el-table-column>
            <el-table-column label="DESCRIPCIÓN" width="250">
              <template #default="scope">
                <el-input
                  v-model="scope.row.descripcion"
                  type="textarea"
                  autosize
                />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="ACCIONES" width="180">
              <template #header>
                <el-button  
                  :disabled="!detalleInventario.length > 0"
                  type="primary"
                  @click="submitDetalleInventario"
                >
                  {{ modelForm.id === undefined ? "Guardar" : "Actualizar" }}
                </el-button>
                <el-button
                  ref="btnCancelar"
                  type="danger"
                  :icon="Close"
                  @click="cancelar()"
                />
              </template>
              <template #default="scope">
                <div class="text-center">
                  <el-icon
                    @click="quitarProducto(scope.row)"
                    color="#e94560"
                    size="18px"
                    class="icon-btn pointer"
                    title="Detalle"
                  >
                    <Remove />
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { format } from "@formkit/tempo";
import { ElNotification, ElMessageBox } from "element-plus";
import { Plus, Remove, Close, Printer } from "@element-plus/icons-vue";
import Resource from "@/api/resource";
import OpcionesResource from "@/api/opcionesresource";
const opcionesResource = new OpcionesResource();
const areasResource = new Resource("inventario/all/areas");
const ubicacionesResource = new Resource("inventario/all/ubicaciones");
const responsablesResource = new Resource("inventario/all/responsables");
const asignacionesResource = new Resource("inventario/asignacionesmasivo");

export default {
  name: "InventarioInventariarView",
  components: {
    Remove,
  },
  data() {
    const validateProducto = (rule, value, callback) => {
      if (!value || value === "") {
        callback(new Error("El campo es requerido"));
      } else {
        callback();
      }
    };
    return {
      Plus,
      Remove,
      Close,
      Printer,
      loadingData: false,
      createUserForm: "",
      tiposDocIdentidad: [],
      lAreas: [],
      lUbicaciones: [],
      lResponsables: [],
      lProductos: [],
      lCondiciones: [
        { id: 'NO ASIGNADO', nombre: 'NO ASIGNADO' },
        { id: 'ASIGNADO', nombre: 'ASIGNADO' },
        { id: 'PRESTADO', nombre: 'PRESTADO' },
      ],
      loadingProducto: false,
      listProductos: [],
      dialogBuscarPersona: false,
      modelForm: {
        responsable_id: undefined,
        producto_id: undefined,
      },
      productoFound: {},
      showPrintBtn: false,
      reglasValidacionForm: {
        responsable_id: [
          { required: true, message: "Campo requerido", trigger: "blur" },
        ],
        producto_id: [{ validator: validateProducto, trigger: "blur" }],
      },
      detalleInventario: [],
      dialogBuscarProducto: false,
      opcionesProductosEstados: [],
      srcFilePdf: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.resetData()
    this.cargarOpcionesIniciales()
  },
  methods: {
    cargarOpcionesIniciales() {
      this.loadingData = true
      Promise.all([
        areasResource.list({}),
        ubicacionesResource.list({}),
        responsablesResource.list({}),
        opcionesResource.load("productoestado", null)
      ])
        .then((respuestas) => {
          this.lAreas = respuestas[0].data && Array.isArray(respuestas[0].data) ? respuestas[0].data : []
          this.lUbicaciones = respuestas[1].data && Array.isArray(respuestas[1].data) ? respuestas[1].data : []
          this.lResponsables = respuestas[2].data && Array.isArray(respuestas[2].data) ? respuestas[2].data : []
          this.opcionesProductosEstados = respuestas[3].data && Array.isArray(respuestas[3].data) ? respuestas[3].data : []
        })
        .catch((error) => {
          console.log(error)
          this.loadingData = false
        })
        .finally(() => {
          this.loadingData = false
        });
    },
    resetData() {
      this.modelForm = {
        responsable_id: undefined,
        producto_id: undefined,
      };
      this.listProductos = [];
      this.detalleInventario = [];
      this.showPrintBtn = false
    },
    close(status) {
      // if (this.createUserForm) {
      //   this.createUserForm.resetFields()
      // }
      this.$emit("closeChild", status);
    },
    parentProcessEmitPersona(data) {
      console.log(data);
      this.modelForm.id_persona = data.id;
      this.$refs["emailField"].focus();
    },
    getPructoPorNombre(query) {
      if (query) {
        const queryToSend = {
          keyword: query,
          inventario_id: this.inventario_id,
          limit: 7,
          page: 1,
        };
        this.listProductos = [];
        opcionesResource
          .load("productosporaasignar", queryToSend)
          .then((response) => {
            const { data } = response;
            this.listProductos = data;
            setTimeout(() => {
              console.log('Agregando producto')
              if (this.listProductos.length === 1) {
                this.productoFound = {... this.listProductos[0]}
                this.modelForm.producto_id = this.productoFound.id
                this.addProductoDetalle()
              }
            }, 250)
          })
          .catch((error) => {
            console.log(error);
            this.listProductos = [];
          });
      }
    },
    clearSelectProducto() {
      this.modelForm.producto_id = undefined;
    },
    changeSelectProducto() {
      this.addProductoDetalle();
    },
    addProductoDetalle() {
      this.$refs["formAdditem"].validate((valid) => {
        if (valid) {
          const productoExistente = this.detalleInventario.some((objeto) => {
            return objeto.producto_id === this.modelForm.producto_id;
          });
          if (productoExistente) {
            this.mostrarNotificacion(
              "Atención",
              "El producto se encuentra en la lista"
            );
          } else {
            this.processAddItem();
          }
        } else {
          return false;
        }
      });
    },
    processAddItem() {
      const foundResponsable = this.lResponsables.find(
        (responsable) => responsable.id === this.modelForm.responsable_id 
      )

      const foundProducto = this.listProductos.find(
        (producto) => producto.id === this.modelForm.producto_id
      )

      this.detalleInventario. unshift({
        responsable: foundResponsable,
        responsable_id: foundResponsable?.id,
        producto: foundProducto,
        producto_id: foundProducto.id,
        producto_codigo: foundProducto.codigo,
        fecha: format(new Date(), "YYYY-MM-DD"),
        condicion: undefined,
        archivo_url: "",
        archivo_existe: false,
        id: undefined,
        area_id: foundProducto.ultimaasignacionresponsable?.area_id,
        ubicacion_id: foundProducto.ultimaasignacionresponsable?.ubicacion_id,
        producto_estado_id: foundProducto.ultimaasignacionresponsable?.producto_estado_id,
        descripcion: null,
        opcionesArea: foundProducto.ultimaasignacionresponsable != null ? [foundProducto.ultimaasignacionresponsable?.area] : [],
        opcionesResponsable: foundProducto.ultimaasignacionresponsable != null ? [foundProducto.ultimaasignacionresponsable?.responsable] : [],
      });
      this.modelForm.producto_id = undefined;
      this.$nextTick(() => {
        this.listProductos = []
      })
    },
    nuevoProducto() {
      this.dialogBuscarProducto = true;
    },
    cancelar() {
      this.resetData()
      // this.$emit("close", {
      //   action: "cancelar",
      // });
    },
    quitarProducto(producto) {
      const indice = this.detalleInventario.findIndex(
        (objeto) => objeto.producto_id === producto.producto_id
      );
      if (indice !== -1) {
        this.detalleInventario.splice(indice, 1);
        this.mostrarNotificacion("Atención", "Producto quitado de la lista");
      } else {
        this.mostrarNotificacion(
          "Atención",
          "El producto no ha sido encontrado"
        );
      }
    },
    submitDetalleInventario() {
      if (this.formDataValida()) {
        this.loadingData = true;
        asignacionesResource
          .store({
            responsable_id: this.modelForm.responsable_id,
            detalle: this.detalleInventario,
          })
          .then((response) => {
            this.loadingData = false;
            const { data, state, message } = response;
            if (state === "success") {
              this.showPrintBtn = true
              this.setAccionesPostGuardar(data);
              this.deseaImprimirEtiquetas()
            } else {
              this.mostrarNotificacion("Atención", message);
            }
          })
          .catch((error) => {
            this.loadingData = false;
            console.log(error);
          })
          .finally(() => {
            this.loadingData = false;
          });
      } else {
        this.mostrarNotificacion("Atención", 'Existen campos que son obligatorios');
      }
    },
    setAccionesPostGuardar(data) {
      // console.log(this.detalleInventario)
      this.detalleInventario.forEach((objeto) => {
        if (objeto.producto_id === data[objeto.producto_id]?.producto_id) {
          objeto.id = data[objeto.producto_id].id
          objeto.archivo_url = data[objeto.producto_id].archivo_url
          objeto.archivo_existe = data[objeto.producto_id].archivo_existe
        }
      })
    },
    imprimirItem(url) {
      this.loadingData = true
      this.srcFilePdf = url
    },
    mostrarNotificacion(title, message) {
      ElNotification({ title, message });
    },
    deseaImprimirEtiquetas() {
      ElMessageBox.confirm(
        'Los productos fueron asignados. <br /><br /><b>¿Desea realizar otra asignación?</b>',
        'Atención',
        {
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          dangerouslyUseHTMLString: true,
          type: 'info',
        }
      )
        .then(() => {
          this.resetData()
        })
        .catch(() => {
          this.resetData()
          this.close()
        })
    },
    formDataValida() {
      const filasNoValidads = []
      this.detalleInventario.forEach((objeto) => {
        if (objeto.ubicacion_id === undefined || objeto.responsable_id === undefined || objeto.producto_estado_id === undefined) {
          filasNoValidads.push(objeto)
        }
      })
      return !(filasNoValidads.length > 0)
    },
    print() {
      this.$refs['pdf'].print()
      this.loadingData = false
    }
  },
};
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
