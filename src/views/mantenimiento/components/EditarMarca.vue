<template>
  <div v-loading="loading">
    <el-form
      ref="nuevaMarcaForm"
      :model="nuevaMarca"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Código" prop="codigo">
            <el-input v-model="nuevaMarca.codigo" readonly disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Nombre" prop="nombre">
            <el-input v-model="nuevaMarca.nombre" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Descripción" prop="descripcion">
        <el-input v-model="nuevaMarca.descripcion" />
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

import MarcaResource from "@/api/mantenimiento/marca"; // Assuming you have a file named marca.js in the specified path
const marcaResource = new MarcaResource(); // Adjust this according to your actual file structure
export default {
  name: "EditarMarca",
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
      nuevaMarca: {
        codigo: "",
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
      marcaResource
        .get(this.id)
        .then((response) => {
          const { data } = response;
          console.log(data);
          this.nuevaMarca = data;
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
      marcaResource
        .update(this.id, this.nuevaMarca)
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
