<template>
  <div v-loading="loading">
    <el-form
      ref="nuevoTipoActivoForm"
      :model="nuevoTipoActivo"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="nuevoTipoActivo.nombre" />
      </el-form-item>
      <el-form-item label="Descripción" prop="descripcion">
        <el-input v-model="nuevoTipoActivo.descripcion" />
      </el-form-item>
    </el-form>
    <el-row :gutter="10" type="flex" justify="end">
      <el-button type="primary" plain @click="close">Cancelar</el-button>
      <el-button type="primary" @click="actualizarRegistro">Guardar</el-button>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";

import TipoActivoResource from "@/api/mantenimiento/tipoActivo"; // Actualizado el recurso a tipoActivo
const tipoActivoResource = new TipoActivoResource(); // Actualizado el recurso a tipoActivo

export default {
  name: "EditarTipoActivo", // Actualizado el nombre del componente
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  watch: {
    id: function (newVal, oldVal) {
      if (newVal != null && newVal != oldVal && newVal > 0) {
        this.cargarInformacionRegistro();
      }
    },
  },
  mounted() {
    this.cargarInformacionRegistro();
  },
  data() {
    return {
      nuevoTipoActivo: {
        nombre: "",
        descripcion: "",
      },
      rules: {
        nombre: [
          {
            required: true,
            message: "Este campo es obligatorio",
            trigger: "blur",
          },
        ],
        codigo: [
          {
            required: true,
            message: "Este campo es obligatorio",
            trigger: "blur",
          },
        ],
      },
      loading: false,
    };
  },
  methods: {
    cargarInformacionRegistro() {
      this.loading = true;
      tipoActivoResource // Actualizado el recurso a tipoActivo
        .get(this.id)
        .then((response) => {
          const { data } = response;
          console.log(data);
          this.nuevoTipoActivo = data; // Actualizado el nombre del objeto
          this.loading = false;
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },
    actualizarRegistro() {
      // Actualizado el nombre del método
      this.loading = true;
      tipoActivoResource // Actualizado el recurso a tipoActivo
        .update(this.id, this.nuevoTipoActivo)
        .then((response) => {
          ElMessage({
            message: "Registro actualizado",
            type: "success",
          });
          this.close();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped></style>
