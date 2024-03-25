<template>
  <div v-loading="loading">
    <el-form
      ref="nuevoAlmacenForm"
      :model="nuevoAlmacen"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Código" prop="codigo">
            <el-input v-model="nuevoAlmacen.codigo" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Nombre" prop="nombre">
            <el-input v-model="nuevoAlmacen.nombre" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Descripción" prop="descripcion">
        <el-input v-model="nuevoAlmacen.descripcion" />
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

import AlmacenResource from "@/api/mantenimiento/almacen";
const almacenResource = new AlmacenResource();
export default {
  name: "EditarAlmacen",
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
      nuevoAlmacen: {
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
      almacenResource
        .get(this.id)
        .then((response) => {
          const { data } = response;
          console.log(data);
          this.nuevoAlmacen = data;
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
      almacenResource
        .update(this.id, this.nuevoAlmacen)
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
