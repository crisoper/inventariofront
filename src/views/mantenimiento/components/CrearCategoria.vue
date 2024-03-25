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
      <el-button type="primary" @click="crearCategoria">Guardar</el-button>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import CategoriaResource from "@/api/mantenimiento/categoria";
const categoriaResource = new CategoriaResource();

export default {
  name: "CrearCategoria",
  data() {
    return {
      nuevaCategoria: {
        nombre: "",
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
    crearCategoria() {
      this.$refs["nuevaCategoriaForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          categoriaResource
            .store(this.nuevaCategoria)
            .then((response) => {
              this.close();
              ElMessage({
                message: "Agregado correctamente",
                type: "success",
              });
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
        }
      });
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped></style>
