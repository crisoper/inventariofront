<template>
  <div v-loading="loadingData">
    <!-- <h2>{{ inventario_id }}</h2> -->
    <el-form
      ref="formAdditem"
      :model="modelForm"
      label-width="120px"
      class="demo-form"
      label-position="top"
    >
      <div class="p-3">
        <el-card class="box-card" shadow="never">
          <el-row :gutter="12">
            <el-col :xs="24" :sm="24" :md="13" class="hidden-icon-valid">
              <el-form-item label="Producto" prop="producto_id">
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
                <!-- <el-button
                  ref="btnAddProduct"
                  type="primary"
                  plain
                  :icon="Plus"
                  @click="addProductoDetalle"
                /> -->
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
            <!-- <el-table-column label="ESTADO" width="126">
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
            </el-table-column> -->
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
            <el-table-column label="COMENTARIOS" width="250">
              <template #default="scope">
                <el-input
                  v-model="scope.row.comentario"
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
import OpcionesResource from "@/api/opcionesresource";
import Resource from '@/api/resource.js'
const opcionesResource = new OpcionesResource()
const bajasResource = new Resource("inventario/bajas")

export default {
  name: "BajasMasivoView",
  components: {
    Remove,
  },
  data() {
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
  },
  methods: {
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
      this.$emit("closeChild", status);
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
          .load("productosporabaja", queryToSend)
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
      const foundProducto = this.listProductos.find(
        (producto) => producto.id === this.modelForm.producto_id
      )

      this.detalleInventario. unshift({
        producto: foundProducto,
        producto_id: foundProducto.id,
        producto_codigo: foundProducto.codigo,
        fecha: format(new Date(), "YYYY-MM-DD"),
        id: undefined,
        comentario: null,
      });
      this.modelForm.producto_id = undefined;
      this.$nextTick(() => {
        this.listProductos = []
      })
    },
    cancelar() {
      this.resetData()
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
      this.loadingData = true;
      bajasResource
        .store({
          data: this.detalleInventario
        })
        .then((response) => {
          this.loadingData = false;
          const { state, message } = response;
          if (state === "success") {
            this.notificarRegistrosGuardados()
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
    mostrarNotificacion(title, message) {
      ElNotification({ title, message });
    },
    notificarRegistrosGuardados() {
      ElMessageBox("Los datos han sido guardados")
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
