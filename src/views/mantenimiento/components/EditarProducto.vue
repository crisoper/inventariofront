<template>
  <div v-loading="loading">
    <el-form
      ref="FormProducto"
      :model="producto"
      :rules="rulesProducto"
      label-position="top"
    >
      <!-- Contenido del producto -->
      <el-card class="mb-3" shadow="never">
        <div>
          <h6>Información del producto</h6>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Almacén" prop="almacen_id">
              <el-select
                v-model="producto.almacen_id"
                placeholder="Seleccionar"
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
            <el-form-item label="Código" prop="codigo">
              <el-input
                v-model="producto.codigo"
                placeholder="El código es autogenerado"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Nombre" prop="nombre">
              <el-input v-model="producto.nombre" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :xs="24">
            <el-form-item label="Descripción" prop="descripcion">
              <el-input
                v-model="producto.descripcion"
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
                v-model="producto.marca_id"
                placeholder="Buscar y seleccionar"
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
              <el-input v-model="producto.modelo" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Serie" prop="serie">
              <el-input v-model="producto.serie" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :lg="8">
            <el-form-item label="Categoría" prop="categoria_id">
              <el-select
                v-model="producto.categoria_id"
                placeholder="Seleccionar"
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
                v-model="producto.tipo_bien_id"
                placeholder="Seleccionar"
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
                v-model="producto.tipo_activo_id"
                placeholder="Seleccionar"
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
                v-model="producto.proveedor_id"
                placeholder="Seleccionar"
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
                      ? `${item.nombres} ${item.apellido_paterno} ${item.apellido_materno}`
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
                v-model="producto.fecha_compra"
                placeholder="Seleccionar"
                value-format="YYYY-MM-DD"
                format="DD-MM-YYYY"
                style="width: 100% !important"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-row class="mt-3" type="flex" justify="end">
        <el-button type="primary" plain class="mr-1" @click="closeForm"
          >Cancelar</el-button
        >
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
  name: "EditarProducto",
  props: {
    // Propiedades recibidas para la edición del producto
    productoId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      rulesProducto: {
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
        nombre: [
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
      },
      producto: {
        id: "",
        almacen_id: "",
        categoria_id: "",
        codigo: "",
        nombre: "",
        descripcion: "",
        marca_id: "",
        modelo: "",
        serie: "",
        tipo_bien_id: "",
        tipo_activo_id: "",
        proveedor_id: "",
        fecha_compra: "",
      },
      opcionesAlmacen: [],
      opcionesCategoria: [],
      opcionesTipoBien: [],
      opcionesTipoActivo: [],
      opcionesMarca: [],
      opcionesProveedor: [],
    };
  },
  mounted() {
    this.cargarProducto();
    this.cargarOpciones();
  },
  methods: {
    cargarProducto() {
      this.loading = true;
      // Llama al recurso para cargar el producto a editar según su ID
      productoResource
        .get(this.productoId)
        .then((respuesta) => {
          this.producto = respuesta.data;
        })
        .catch((error) => {
          console.log(error);
          ElMessage.error("Error al cargar el producto para editar.");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    cargarOpciones() {
      this.loading = true;
      // Carga las opciones necesarias para los campos del formulario
      Promise.all([
        opcionesresource.load("almacen", null),
        opcionesresource.load("categoria", null),
        opcionesresource.load("tipobien", null),
        opcionesresource.load("tipoactivo", null),
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
        })
        .catch((error) => {
          console.log(error);
          ElMessage.error("Error al cargar las opciones del formulario.");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleBuscarOpciones(query, model) {
      // Maneja la búsqueda de opciones para los campos select
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
            }
          })
          .catch((error) => {
            console.log(error);
            ElMessage.error("Error al buscar opciones.");
          });
      }
    },
    submitForm() {
      // Valida y envía el formulario para guardar los cambios del producto editado
      this.$refs["FormProducto"].validate((valid) => {
        if (valid) {
          this.loading = true;
          productoResource
            .update(this.productoId, this.producto)
            .then(() => {
              ElMessage.success("Producto actualizado correctamente.");
              this.closeForm();
            })
            .catch((error) => {
              console.log(error);
              ElMessage.error("Error al actualizar el producto.");
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          ElMessage.error("Revisa los errores en el formulario.");
          return false;
        }
      });
    },

    closeForm() {
      // Cierra el formulario de edición
      this.$emit("close");
    },
  },
};
</script>

<style scoped></style>
