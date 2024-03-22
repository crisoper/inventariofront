<template>
  <div v-loading="loading">
    <el-form ref="nuevaTareaForm" :model="tarea" :rules="rules">
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="tarea.nombre" />
      </el-form-item>
      <el-form-item label="Completado" prop="completado">
        <el-switch v-model="tarea.completado" />
      </el-form-item>
    </el-form>
    <el-row :gutter="10" type="flex" justify="end">
      <el-button type="primary" plain @click="close">Cancelar</el-button>
      <el-button type="primary" @click="actulizarRegistro">Guardar</el-button>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";

import TareasResource from "@/api/prueba/tareas";
const tareasResource = new TareasResource();
export default {
  name: "EditarTarea",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  watch: {
    id: function (newVal, oldVal) {
      if (newVal != null && newVal != oldVal) {
        this.cargarInformacionRegistro();
      }
    },
  },
  mounted() {
    this.cargarInformacionRegistro();
  },
  data() {
    return {
      tarea: {
        nombre: "",
        completado: false,
      },
      rules: {
        nombre: [
          {
            required: true,
            message: "Este campo es obligatorio",
            trigger: "blur",
          },
        ],
        completado: [
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
      tareasResource
        .get(this.id)
        .then((response) => {
          const { data } = response;
          this.tarea = data;
          this.loading = false;
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrio un error",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },
    actulizarRegistro() {
      this.loading = true;
      tareasResource
        .update(this.id, this.tarea)
        .then((response) => {
            ElMessage({
            message: "Registro actualizado",
            type: "success",
          });
          this.close();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrio un error",
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
