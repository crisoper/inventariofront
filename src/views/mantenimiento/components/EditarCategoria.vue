<template>
  <div v-loading="loading">
    <el-form
      ref="nuevaCategoriaForm"
      :model="nuevaCategoria"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="nuevaCategoria.nombre" />
      </el-form-item>
      <el-form-item label="Descripción" prop="descripcion">
        <el-input v-model="nuevaCategoria.descripcion" />
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

import CategoriaResource from "@/api/mantenimiento/categoria"; // Assuming you have a file named categoria.js in the specified path
const categoriaResource = new CategoriaResource(); // Adjust this according to your actual file structure
export default {
  name: "EditarCategoria",
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
      nuevaCategoria: {
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
      categoriaResource
        .get(this.id)
        .then((response) => {
          const { data } = response;
          console.log(data);
          this.nuevaCategoria = data;
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
      this.loading = true;
      categoriaResource
        .update(this.id, this.nuevaCategoria)
        .then((response) => {
          console.log(response)
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
