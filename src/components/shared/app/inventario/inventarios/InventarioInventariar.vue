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
              <el-form-item label="Ubicación" prop="ubicacion_id">
                <el-select
                  v-model="modelForm.ubicacion_id"
                  placeholder="Seleccionar"
                  style="width: 100%"
                  :filterable="true"
                  :clearable="true"
                  @clear="modelForm.ubicacion_id = undefined"
                >
                  <el-option
                    v-for="area in lUbicaciones"
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
                    :disabled="modelForm.ubicacion_id === undefined"
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
            <el-table-column prop="ubicacion.nombre" label="UBICACION" min-width="180" />
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
                <!-- remote
                reserve-keyword
                :remote-method="
                  (query) =>
                    handleBuscarOpciones(query, 'ubicacion', scope.$index)
                " -->
                  <el-option
                    v-for="item in lAreas"
                    :key="item.id"
                    :label="item.nombre"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="RESPONSABLE" min-width="200">
              <template #default="scope">
                <el-select
                  v-model="scope.row.responsable_id"
                  :filterable="true"
                  style="width: 100% !important"
                  placeholder="Seleccionar"
                >
                <!-- remote
                reserve-keyword
                :remote-method="
                  (query) =>
                    handleBuscarOpciones(query, 'persona', scope.$index)
                " -->
                  <el-option
                    v-for="item in lResponsables"
                    :key="item.id"
                    :label="item.documento_numero + ' - ' + item.full_name"
                    :value="item.id"
                  ></el-option>
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
                  v-if="!showPrintBtn"
                  :disabled="!detalleInventario.length > 0"
                  type="primary"
                  @click="submitDetalleInventario"
                >
                  {{ modelForm.id === undefined ? "Guardar" : "Actualizar" }}
                </el-button>
                <el-button
                  v-if="showPrintBtn && detalleInventario.length > 0"
                  type="primary"
                  :icon="Printer"
                  @click="imprimirEtiquetasSeleccionados()"
                />
                <el-button
                  ref="btnAddProduct"
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
                  <el-icon
                    v-if="scope.row.archivo_existe"
                    @click="imprimirItem(scope.row.archivo_url)"
                    color="#333333"
                    size="18px"
                    class="icon-btn pointer"
                    title="Imprimir"
                  >
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
    <p>Los datos no fueron cargados correctamente.</p>
    <p>Por favor, inténtelo nuevamente.</p>
  </div>
  
  <div style="display: none;">
      <!-- <VuePdfEmbed v-if="srcFilePdf" ref="pdf" :source="pdfSource" /> -->
    <VuePdfEmbed v-if="srcFilePdf" ref="pdf" :source="srcFilePdf" @loaded="print"/>
  </div>
</template>

<script>
// import { h } from 'vue'
import { format } from "@formkit/tempo";
import { ElNotification, ElMessageBox } from "element-plus";
import { Plus, Remove, Close, ScaleToOriginal, Printer } from "@element-plus/icons-vue";
import Resource from "@/api/resource";
import OpcionesResource from "@/api/opcionesresource";
const opcionesResource = new OpcionesResource();
const areasResource = new Resource("inventario/all/areas");
const ubicacionesResource = new Resource("inventario/all/ubicaciones");
const responsablesResource = new Resource("inventario/all/responsables");
// const productosResource = new Resource("inventario/all/productos")
const invdetalleResource = new Resource("inventario/inventariodetalle");
const imprimirEtiquetas = new Resource("inventario/imprimiretiquetasmasivo")


// PDF PREVIEW
import VuePdfEmbed from 'vue-pdf-embed'

export default {
  name: "InventarioInventariarView",
  components: {
    Remove,
    ScaleToOriginal,
    VuePdfEmbed,
  },
  props: {
    inventarioid: {
      type: Number,
      required: true,
      default: () => {
        return -11;
      },
    },
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
      inventario_id: -19,
      loadingData: false,
      createUserForm: "",
      tiposDocIdentidad: [],
      lAreas: [],
      lUbicaciones: [],
      lResponsables: [],
      lProductos: [],
      loadingProducto: false,
      listProductos: [],
      dialogBuscarPersona: false,
      modelForm: {
        area_id: undefined,
        producto_id: undefined,
      },
      productoFound: {},
      showPrintBtn: false,
      reglasValidacionForm: {
        area_id: [
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
  watch: {
    inventarioid: function () {
      this.setCrearOUpdate();
    },
  },
  computed: {},
  created() {},
  mounted() {
    this.cargarOpcionesIniciales()
    setTimeout(function () {
      if (this.inventario_id <= 0) {
        console.log("Invetario inválido");
        this.$emit("close", {});
      }
    }, 500);
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
    setCrearOUpdate() {
      console.log("Inventariar inventario_id: " + this.inventarioid);
      this.$nextTick(() => {
        if (
          this.inventario_id !== "action" &&
          this.inventario_id !== "create"
        ) {
          this.inventario_id = this.inventarioid;
          this.resetData();
        } else {
          this.item_id = undefined;
          this.handleCreate();
        }
        // this.resetForm("formAdditem")
        this.resetModel();
      });
    },
    resetData() {
      this.modelForm = {
        area_id: undefined,
        producto_id: undefined,
      };
      this.listProductos = [];
      this.detalleInventario = [];
      this.showPrintBtn = false
    },
    handleCreate() {
      console.log("Open form create, set focus");
      // this.$refs['inputFocusCreate'].focus()
    },
    saveEditForm() {
      this.loadingData = true;
      areasResource
        .update(this.item_id, this.modelForm)
        .then((response) => {
          const { state, message } = response;
          this.$message({
            type: state,
            message,
          });
          this.loadingData = false;
          this.close("success");
        })
        .catch(() => {
          this.loadingData = false;
        });
    },
    close(status) {
      // if (this.createUserForm) {
      //   this.createUserForm.resetFields()
      // }
      this.$emit("closeChild", status);
    },
    searchAsociacion() {
      this.dialogBuscarPersona = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    resetModel() {
      this.modelForm = {
        area_id: undefined,
        producto_id: undefined,
      };
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
        // await productosResource.list({ keybuscar: query }).then((response) => {
        //   const { data } = response
        //   this.listProductos = data
        // })
        opcionesResource
          .load("productosparainventario", queryToSend)
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
      const foundUbicacion = this.lUbicaciones.find(
        (ubicacion) => ubicacion.id === this.modelForm.ubicacion_id
      )

      const foundProducto = this.listProductos.find(
        (producto) => producto.id === this.modelForm.producto_id
      )

      this.detalleInventario.push({
        ubicacion: foundUbicacion,
        ubicacion_id: foundUbicacion.id,
        producto: foundProducto,
        producto_id: foundProducto.id,
        producto_codigo: foundProducto.codigo,
        fecha: format(new Date(), "YYYY-MM-DD"),
        archivo_url: "",
        archivo_existe: false,
        id: undefined,
        area_id: foundProducto.ultimaasignacionresponsable?.area_id,
        responsable_id: foundProducto.ultimaasignacionresponsable?.responsable_id,
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
      // console.log('Nuevo producto')
      // this.$refs['btnAddProduct'].focus()
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
        invdetalleResource
          .store({
            inventario_id: this.inventario_id,
            detalle: this.detalleInventario,
          })
          .then((response) => {
            this.loadingData = false;
            // console.log(response)
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
          // console.log(objeto)
          // console.log(data[objeto.producto_id])
          objeto.id = data[objeto.producto_id].id
          objeto.archivo_url = data[objeto.producto_id].archivo_url
          objeto.archivo_existe = data[objeto.producto_id].archivo_existe
        }
      })
    },
    imprimirItem(url) {
      this.loadingData = true
      this.srcFilePdf = url
      // console.log(url)
      // const link = document.createElement("a");
      // link.href = url;
      // document.body.appendChild(link);
      // link.click();
    },
    mostrarNotificacion(title, message) {
      ElNotification({ title, message });
    },
    // Buscar opciones de los campos con query
    // handleBuscarOpciones(query, model, index) {
    //   if (query) {
    //     const queryToSend = {
    //       keyword: query,
    //       limit: 7,
    //       page: 1,
    //     };
    //     opcionesResource
    //       .load(model, queryToSend)
    //       .then((respuesta) => {
    //         const { data } = respuesta;
    //         switch (model) {
    //           case "ubicacion":
    //             this.detalleInventario[index].opcionesUbicacion = data;
    //             break;
    //           case "persona":
    //             this.detalleInventario[index].opcionesResponsable = data;
    //             break;

    //           default:
    //             break;
    //         }
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   }
    // },
    deseaImprimirEtiquetas() {
      ElMessageBox.confirm(
        'Los productos fueron agregados al inventario. <br /><br /><b>¿Desea imprimir todas las etiquetas?</b>',
        'Atención',
        {
          confirmButtonText: 'Si, imprimir',
          cancelButtonText: 'No',
          dangerouslyUseHTMLString: true,
          type: 'info',
        }
      )
        .then(() => {
          this.imprimirEtiquetasSeleccionados()
        })
    },
    imprimirEtiquetasSeleccionados() {
      let detalleIDs = []
      this.detalleInventario.forEach(objeto => {
        if (objeto.archivo_existe) {
          detalleIDs.push(objeto.id)
        }
      });

      console.log(detalleIDs)

      this.loadingData = true
      imprimirEtiquetas
      .list({
        ids: detalleIDs
      })
      .then((response) => {

        const { state, message, url } = response
        if (state === 'success') {
          this.srcFilePdf = url
          // this.$nextTick(() => {
          //   this.print()
          // })
          // const link = document.createElement('a')
          // link.href = url
          // document.body.appendChild(link)
          // link.click()
        } else {
            ElNotification({title: 'Atención', message})
            this.loadingData = false
        }
      })
      .catch((err) => {
        this.loadingData = false
        console.log('Error', err)
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
