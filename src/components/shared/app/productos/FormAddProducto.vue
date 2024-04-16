@ -0,0 +1,619 @@
<template>
  <div v-loading="loading">
    <el-form
      ref="FormProducto"
      :model="nuevoProducto"
      :rules="rulesNuevoProducto"
      label-position="top"
    >
      <!-- Contenido del producto -->
      <el-card class="mb-3" shadow="never">
        <div>
          <h6>Informacion del producto</h6>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Almacen" prop="almacen_id">
              <el-select
                v-model="nuevoProducto.almacen_id"
                placeholder="Selecionar"
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesAlmacen"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Codigo" prop="codigo">
              <el-input
                v-model="nuevoProducto.codigo"
                placeholder="El codigo es autogenerado"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Nombre" prop="nombre">
              <el-input v-model="nuevoProducto.nombre" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :xs="24">
            <el-form-item label="Descripcion" prop="descripcion">
              <el-input
                v-model="nuevoProducto.descripcion"
                type="textarea"
                placeholder=""
                rows="2"
                autosize
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Marca" prop="marca_id">
              <el-select
                v-model="nuevoProducto.marca_id"
                placeholder="Buscar y selecionar"
                filterable
                remote
                reserve-keyword
                :remote-method="(query) => handleBuscarOpciones(query, 'marca')"
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesMarca"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Modelo" prop="modelo">
              <el-input v-model="nuevoProducto.modelo" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Serie - Placa vehicular" prop="serie">
              <el-input v-model="nuevoProducto.serie" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Categoria" prop="categoria_id">
              <el-select
                v-model="nuevoProducto.categoria_id"
                placeholder="Selecionar"
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesCategoria"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Tipo de ingreso" prop="tipo_ingreso_id">
              <el-select
                v-model="nuevoProducto.tipo_ingreso_id"
                placeholder="Selecionar"
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesTipoIngresos"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Fuente financiamiento" prop="fte_financiamiento_id">
              <el-select
                v-model="nuevoProducto.fte_financiamiento_id"
                placeholder="Selecionar"
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesFteFinanciamiento"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Tipo de bien" prop="tipo_bien_id">
              <el-select
                v-model="nuevoProducto.tipo_bien_id"
                placeholder="Selecionar"
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesTipoBien"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Tipo de activo" prop="tipo_activo_id">
              <el-select
                v-model="nuevoProducto.tipo_activo_id"
                placeholder="Selecionar"
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesTipoActivo"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Tipo comprobante" prop="tipo_comprobante">
              <el-select
                v-model="nuevoProducto.tipo_comprobante"
                placeholder="Selecionar"
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcTipoComprobante"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Nro comprobante" prop="nro_comprobante">
              <el-input v-model="nuevoProducto.nro_comprobante" style="width: 100%" placeholder="Nro comprobante" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Orden de compra" prop="orden_compra">
              <el-input v-model="nuevoProducto.orden_compra" style="width: 100%" placeholder="Orden de compra" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item prop="proveedor_id">
              <template #label>
                <div style="display: flex; justify-content: space-between">
                  <span>Proveedor</span>
                  <el-button
                    @click="nuevoProveedor"
                    type="primary"
                    link
                    :icon="Plus"
                    :underline="false"
                  >
                    <span class="text-muted">Nuevo</span>
                  </el-button>
                </div>
              </template>
              <el-select
                v-model="nuevoProducto.proveedor_id"
                placeholder="Selecionar"
                filterable
                remote
                reserve-keyword
                :remote-method="
                  (query) => handleBuscarOpciones(query, 'proveedor')
                "
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesProveedor"
                  :key="item.id"
                  :label="item.documento_numero + ' - ' + item.full_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Fecha de compra" prop="fecha_compra">
              <el-date-picker
                v-model="nuevoProducto.fecha_compra"
                placeholder="Seleccionar"
                value-format="YYYY-MM-DD"
                format="DD-MM-YYYY"
                style="width: 100% !important"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Valor de compra" prop="valor_compra">
              <el-input-number v-model="nuevoProducto.valor_compra" :precision="2" :step="0.1" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="24" :lg="34">
            <el-form-item label="Comentarios" prop="comentarios">
              <el-input
                v-model="nuevoProducto.comentarios"
                style="width: 100%"
                :rows="2"
                type="textarea"
                placeholder="Comentarios"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-row class="mt-3" type="flex" justify="end">
      <el-button type="primary" plain class="mr-1">Cancelar</el-button>
      <el-button type="primary" @click="submitForm">Guardar</el-button>
    </el-row>
    <el-dialog
      v-model="dialogAddProveedor"
      title="Registrar proveedor"
      width="78%"
      top="7vh"
      :close-on-click-modal="false"
      :appeappend-to-body="true"
    >
      <div>
        <FormProveedor ref="refCrearProveedor" @close="cerrarDialogCrear($event)" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OpcionesResource from "@/api/opcionesresource";
import Resource from "@/api/Resource";
import { ElMessage } from 'element-plus'
import FormProveedor from '@/views/mantenimiento/personas/components/CrearPersona.vue'
const opcionesresource = new OpcionesResource();
const productoResource = new Resource('inventario/productostore');

export default {
  name: "CrearProducto",
  components: {
    FormProveedor
  },
  data() {
    return {
      loading: false,
      dialogAddProveedor: false,
      rulesNuevoProducto: {
        almacen_id: [ { required: true, message: "El campo es obligatorio.", trigger: "blur", }, ],
        categoria_id: [ { required: true, message: "El campo es obligatorio.", trigger: "blur", }, ],
        nombre: [ { required: true, message: "El campo es obligatorio.", trigger: "blur", }, ],
        marca_id: [ { required: true, message: "El campo es obligatorio.", trigger: "blur", }, ],
        modelo: [ { required: true, message: "El campo es obligatorio.", trigger: "blur", }, ],
        serie: [ { required: true, message: "El campo es obligatorio.", trigger: "blur", }, ],
        tipo_bien_id: [ { required: true, message: "El campo es obligatorio.", trigger: "blur", }, ],
        tipo_activo_id: [ { required: true, message: "El campo es obligatorio.", trigger: "blur", }, ],
        proveedor_id: [ { required: true, message: "El campo es obligatorio.", trigger: "blur", }, ],
        fecha_compra: [ { required: true, message: "El campo es obligatorio.", trigger: "blur", }, ],
      },
      nuevoProducto: {
        almacen_id: null,
        categoria_id: null,
        codigo: null,
        nombre: null,
        descripcion: null,
        marca_id: null,
        modelo: null,
        serie: null,
        tipo_bien_id: null,
        fte_financiamiento_id: null,
        tipo_activo_id: null,
        tipo_ingreso_id: null,
        proveedor_id: null,
        fecha_compra: null,
        comentarios: null
      },
      opcTipoComprobante: [
        { id: 'Recibo', value: 'Recibo' },
        { id: 'Boleta', value: 'Boleta' },
        { id: 'Factura', value: 'Factura' },
      ],
      opcionesAlmacen: [],
      opcionesCategoria: [],
      opcionesTipoBien: [],
      opcionesTipoActivo: [],
      opcionesMarca: [],
      opcionesProveedor: [],
      opcionesArea: [],
      opcionesUbicacion: [],
      opcionesResponsable: [],
      opcionesEstadoProducto: [],
      opcionesTipoIngresos: [],
      opcionesFteFinanciamiento: [],
    };
  },
  mounted() {
    this.cargarOpciones();
  },
  methods: {
    resetModel() {
      this.nuevoProducto = {
        almacen_id: null,
        categoria_id: null,
        codigo: null,
        nombre: null,
        descripcion: null,
        marca_id: null,
        modelo: null,
        serie: null,
        tipo_bien_id: null,
        fte_financiamiento_id: null,
        tipo_activo_id: null,
        tipo_ingreso_id: null,
        proveedor_id: null,
        fecha_compra: null,
        comentarios: null
      }
      this.$refs['FormProducto'].resetFields()
    },
    cargarOpciones() {
      this.loading = true;
      Promise.all([
        opcionesresource.load("almacen", null),
        opcionesresource.load("categoria", null),
        opcionesresource.load("tipobien", null),
        opcionesresource.load("tipoactivo", null),
        opcionesresource.load("productoestado", null),
        opcionesresource.load("tipoingresos", null),
        opcionesresource.load("ftefinanciamiento", null),
      ])
        .then((respuestas) => {
          this.opcionesAlmacen =
            respuestas[0].data && Array.isArray(respuestas[0].data)
              ? respuestas[0].data
              : [];
          this.opcionesCategoria =
            respuestas[1].data && Array.isArray(respuestas[1].data)
              ? respuestas[1].data
              : [];
          this.opcionesTipoBien =
            respuestas[2].data && Array.isArray(respuestas[2].data)
              ? respuestas[2].data
              : [];
          this.opcionesTipoActivo =
            respuestas[3].data && Array.isArray(respuestas[3].data)
              ? respuestas[3].data
              : [];
          this.opcionesEstadoProducto =
            respuestas[4].data && Array.isArray(respuestas[4].data)
              ? respuestas[4].data
              : [];
          this.opcionesTipoIngresos =
            respuestas[5].data && Array.isArray(respuestas[5].data)
              ? respuestas[5].data
              : [];
          this.opcionesFteFinanciamiento =
            respuestas[6].data && Array.isArray(respuestas[6].data)
              ? respuestas[6].data
              : [];
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleBuscarOpciones(query, model) {
      if (query) {
        const queryToSend = {
          keyword: query,
          limit: 7,
          page: 1,
        };
        opcionesresource
          .load(model, queryToSend)
          .then((respuesta) => {
            const { data } = respuesta;
            switch (model) {
              case "marca":
                this.opcionesMarca = data && Array.isArray(data) ? data : [];
                break;
              case "proveedor":
                this.opcionesProveedor =
                  data && Array.isArray(data) ? data : [];
                break;
              case "area":
                this.opcionesArea = data && Array.isArray(data) ? data : [];
                break;
              case "ubicacion":
                this.opcionesUbicacion =
                  data && Array.isArray(data) ? data : [];
                break;
              case "persona":
                this.opcionesResponsable =
                  data && Array.isArray(data) ? data : [];
                break;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    submitForm() {
      this.$refs["FormProducto"].validate((valid1) => {
        if (valid1) {
          // Aquí manejas el caso de éxito cuando ambos formularios son válidos
          this.loading = true;
          productoResource
            .store({
              nuevoProducto: this.nuevoProducto
            })
            // eslint-disable-next-line no-unused-vars
            .then((respuesta) => {
              this.close();
              this.loading = false;
              ElMessage.success("El producto fue registaado");
              this.close()
            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
            });
        } else {
          // ElMessage.error("Revisa los errores en el formulario 1.");
          return false;
        }
      });
    },
    close() {
      this.$emit("close");
    },
    nuevoProveedor() {
      this.dialogAddProveedor = true;
      this.$nextTick(() => {
        this.$refs['refCrearProveedor'].resetModel()
      })
    },
    cerrarDialogCrear() {
      this.dialogAddProveedor = false;
    }
  },
};
</script>

<style scoped></style>
