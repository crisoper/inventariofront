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
            <el-form-item label="Serie" prop="serie">
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
            <el-form-item label="Proveedor" prop="proveedor_id">
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
                  :label="
                    item.tipo == 'Natural'
                      ? item.nombres +
                        ' ' +
                        item.apellido_paterno +
                        ' ' +
                        item.apellido_materno
                      : item.nombres
                  "
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
        </el-row>
      </el-card>
      <!-- Contenido de la primera asignacion del producto -->
    </el-form>
    <el-form
      ref="FormAsignacion"
      :model="asignacionProducto"
      :rules="rulesAsignacionProducto"
      label-position="top"
    >
      <el-card shadow="never">
        <div>
          <h6>Primera asignacion del producto</h6>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Area" prop="area_id">
              <el-select
                v-model="asignacionProducto.area_id"
                placeholder="Buscar y selecionar"
                filterable
                remote
                reserve-keyword
                :remote-method="(query) => handleBuscarOpciones(query, 'area')"
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesArea"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Ubicacion" prop="ubicacion_id">
              <el-select
                v-model="asignacionProducto.ubicacion_id"
                placeholder="Buscar y selecionar"
                filterable
                remote
                reserve-keyword
                :remote-method="
                  (query) => handleBuscarOpciones(query, 'ubicacion')
                "
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesUbicacion"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Responsable" prop="responsable_id">
              <el-select
                v-model="asignacionProducto.responsable_id"
                placeholder="Buscar y selecionar"
                filterable
                remote
                reserve-keyword
                :remote-method="
                  (query) => handleBuscarOpciones(query, 'persona')
                "
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesResponsable"
                  :key="item.id"
                  :label="
                    item.tipo == 'Natural'
                      ? item.nombres +
                        ' ' +
                        item.apellido_paterno +
                        ' ' +
                        item.apellido_materno
                      : item.nombres
                  "
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="EstadoProducto" prop="producto_estado_id">
              <el-select
                v-model="asignacionProducto.producto_estado_id"
                placeholder="Selecionar"
                style="width: 100% !important"
              >
                <el-option
                  v-for="item in opcionesEstadoProducto"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Fecha" prop="fecha">
              <el-date-picker
                v-model="asignacionProducto.fecha"
                placeholder="Seleccionar"
                value-format="YYYY-MM-DD"
                format="DD-MM-YYYY"
                style="width: 100% !important"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24">
            <el-form-item label="Descripcion" prop="descripcion">
              <el-input
                v-model="asignacionProducto.descripcion"
                type="textarea"
                placeholder=""
                rows="2"
                autosize
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-row class="mt-3" type="flex" justify="end">
        <el-button type="primary" plain class="mr-1">Cancelar</el-button>
        <el-button type="primary" @click="submitForm">Guardar</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// Componentes
import { ElMessage } from "element-plus";
// Resource
import OpcionesResource from "@/api/opcionesresource";
const opcionesresource = new OpcionesResource();
import ProductoResource from "@/api/mantenimiento/producto";
const productoResource = new ProductoResource();

export default {
  name: "CrearProducto",
  data() {
    return {
      loading: false,
      rulesNuevoProducto: {
        almacen_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        categoria_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        // codigo: [
        //   {
        //     required: true,
        //     message: "El campo es obligatorio.",
        //     trigger: "blur",
        //   }
        // ],
        nombre: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        // descripcion: [
        //   {
        //     required: true,
        //     message: "El campo es obligatorio.",
        //     trigger: "blur",
        //   }
        // ],
        marca_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        modelo: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        serie: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        tipo_bien_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        tipo_activo_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        proveedor_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        fecha_compra: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
      },
      rulesAsignacionProducto: {
        // codigo: [
        //   {
        //     required: true,
        //     message: "El campo es obligatorio.",
        //     trigger: "blur",
        //   }
        // ],
        area_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        ubicacion_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        responsable_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        fecha: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
        // producto_id: [
        //   {
        //     required: true,
        //     message: "El campo es obligatorio.",
        //     trigger: "blur",
        //   }
        // ],
        // descripcion: [
        //   {
        //     required: true,
        //     message: "El campo es obligatorio.",
        //     trigger: "blur",
        //   }
        // ],
        producto_estado_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
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
        tipo_activo_id: null,
        proveedor_id: null,
        fecha_compra: null,
      },
      asignacionProducto: {
        codigo: null, // se autogenera en el backend
        area_id: null,
        ubicacion_id: null,
        responsable_id: null,
        fecha: null,
        producto_id: null, // se asignara en el backend poral crear el registro del producto
        descripcion: null,
        producto_estado_id: null,
      },
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
    };
  },
  mounted() {
    this.cargarOpciones();
  },
  methods: {
    cargarOpciones() {
      this.loading = true;
      Promise.all([
        opcionesresource.load("almacen", null),
        opcionesresource.load("categoria", null),
        opcionesresource.load("tipobien", null),
        opcionesresource.load("tipoactivo", null),
        opcionesresource.load("productoestado", null),
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
          limit: 10,
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
        if (!valid1) {
          ElMessage.error("Revisa los errores en el formulario 1.");
          return false;
        }
        this.$refs["FormAsignacion"].validate((valid2) => {
          if (!valid2) {
            ElMessage.error("Revisa los errores en el formulario 2.");
            return false;
          }
          // Aquí manejas el caso de éxito cuando ambos formularios son válidos
          this.loading = true;
          productoResource
            .store({
              nuevoProducto: this.nuevoProducto,
              asignacionProducto: this.asignacionProducto,
            })
            // eslint-disable-next-line no-unused-vars
            .then((respuesta) => {
              this.close();
              this.loading = false;
            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
            });
        });
      });
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped></style>
