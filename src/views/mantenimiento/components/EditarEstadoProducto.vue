<template>
  <div v-loading="loading">
    <el-form
      ref="nuevaAreaForm"
      :model="nuevaArea"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Código" prop="codigo">
            <el-input v-model="nuevaArea.codigo" readonly disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Nombre" prop="nombre">
            <el-input v-model="nuevaArea.nombre" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Descripción" prop="descripcion">
        <el-input v-model="nuevaArea.descripcion" />
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

import AreaResource from "@/api/mantenimiento/area"; // Assuming you have a file named area.js in the specified path
const areaResource = new AreaResource(); // Adjust this according to your actual file structure
export default {
  name: "EditarArea",
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
      nuevaArea: {
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
      areaResource
        .get(this.id)
        .then((response) => {
          const { data } = response;
          console.log(data);
          this.nuevaArea = data;
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
    actualizarRegistro() {
      this.loading = true;
      areaResource
        .update(this.id, this.nuevaArea)
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
