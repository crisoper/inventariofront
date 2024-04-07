<template>
  <div v-loading="loading">
    <el-form
      ref="nuevoProductoEstadoForm"
      :model="nuevoProductoEstado"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Código" prop="codigo">
            <el-input v-model="nuevoProductoEstado.codigo" readonly disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Nombre" prop="nombre">
            <el-input v-model="nuevoProductoEstado.nombre" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Descripción" prop="descripcion">
        <el-input v-model="nuevoProductoEstado.descripcion" />
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

import ProductoEstadoResource from "@/api/mantenimiento/productoEstado"; // Ajusta según tu estructura de archivos real
const productoEstadoResource = new ProductoEstadoResource(); // Ajusta según tu estructura de archivos real
export default {
  name: "EditarProductoEstado",
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
      nuevoProductoEstado: {
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
      },
      loading: false,
    };
  },
  methods: {
    cargarInformacionRegistro() {
      this.loading = true;
      productoEstadoResource
        .get(this.id)
        .then((response) => {
          const { data } = response;
          console.log(data);
          this.nuevoProductoEstado = data;
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
      productoEstadoResource
        .update(this.id, this.nuevoProductoEstado)
        .then((response) => {
          console.log(response);
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
