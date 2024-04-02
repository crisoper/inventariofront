<template>
  <div>
    <el-form
      ref="FormAsignacion"
      :model="asignacion"
      :rules="rulesasignacion"
      label-position="top"
    >
      <el-row>
        <h4>Asignar equipo a: {{ persona.nombre_completo }}</h4>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24">
          <el-form-item label="Producto" prop="producto_id">
            <el-select
              v-model="asignacion.producto_id"
              placeholder="Buscar y selecionar"
              filterable
              remote
              reserve-keyword
              :remote-method="
                (query) =>
                  handleBuscarOpciones(query, 'productosparainventario')
              "
              style="width: 100% !important"
            >
              <el-option
                v-for="item in opcionesProducto"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="Area" prop="area_id">
            <el-select
              v-model="asignacion.area_id"
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
        <el-col :xs="24" :md="12">
          <el-form-item label="Ubicacion" prop="ubicacion_id">
            <el-select
              v-model="asignacion.ubicacion_id"
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
        <!-- <el-col :xs="24" :md="12">
          <el-form-item label="Responsable" prop="responsable_id">
            <el-select
              v-model="asignacion.responsable_id"
              placeholder="Buscar y selecionar"
              filterable
              remote
              reserve-keyword
              :remote-method="(query) => handleBuscarOpciones(query, 'persona')"
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
        </el-col> -->
        <el-col :xs="24" :md="12">
          <el-form-item label="Estado producto" prop="producto_estado_id">
            <el-select
              v-model="asignacion.producto_estado_id"
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
        <el-col :xs="24" :md="12">
          <el-form-item label="Fecha" prop="fecha">
            <el-date-picker
              v-model="asignacion.fecha"
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
              v-model="asignacion.descripcion"
              type="textarea"
              placeholder=""
              rows="2"
              autosize
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="mt-3" type="flex" justify="end">
        <el-button type="primary" plain class="mr-1">Cancelar</el-button>
        <el-button type="primary" @click="submitForm">Guardar</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import OpcionesResource from "@/api/opcionesresource";
const opcionesresource = new OpcionesResource();
import Resource from "@/api/resource";
const asignacionesEquipoResource = new Resource(
  "inventario/asingacionesequipos"
);
export default {
  name: "CrearAsignacion",
  props: {
    persona: {},
  },
  data() {
    return {
      asignacion: {
        codigo: null, // se autogenera en el backend
        area_id: null,
        ubicacion_id: null,
        responsable_id: null,
        fecha: null,
        producto_id: null, // se asignara en el backend poral crear el registro del producto
        descripcion: null,
        producto_estado_id: null,
      },
      rulesasignacion: {
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
        producto_estado_id: [
          {
            required: true,
            message: "El campo es obligatorio.",
            trigger: "blur",
          },
        ],
      },
      opcionesArea: [],
      opcionesUbicacion: [],
      opcionesEstadoProducto: [],
      opcionesProducto: [],
    };
  },
  mounted() {
    this.cargarOpciones();
    this.asignacion.responsable_id = this.persona?.id || -1;
  },
  methods: {
    cargarOpciones() {
      this.loading = true;
      Promise.all([opcionesresource.load("productoestado", null)])
        .then((respuestas) => {
          this.opcionesEstadoProducto =
            respuestas[0].data && Array.isArray(respuestas[0].data)
              ? respuestas[0].data
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
              case "area":
                this.opcionesArea = data && Array.isArray(data) ? data : [];
                break;
              case "ubicacion":
                this.opcionesUbicacion =
                  data && Array.isArray(data) ? data : [];
                break;
              case "productosparainventario":
                this.opcionesProducto = data && Array.isArray(data) ? data : [];
                break;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    submitForm() {
      this.$refs["FormAsignacion"].validate((valid1) => {
        if (!valid1) {
          ElMessage.error("Revisa los errores en el formulario 1.");
          return false;
        }
        this.loading = true;
        asignacionesEquipoResource
          .store(this.asignacion)
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
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
