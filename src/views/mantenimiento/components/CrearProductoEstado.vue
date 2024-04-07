<template>
  <div v-loading="loading">
    <el-form
      ref="nuevoProductoEstado"
      :model="nuevoProductoEstado"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Código" prop="codigo">
            <el-input
              v-model="nuevoProductoEstado.codigo"
              placeholder="El código es autogenerado"
              readonly
              disabled
            />
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
      <el-button type="primary" @click="crearProductoEstado">Guardar</el-button>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import ProductoEstadoResource from "@/api/mantenimiento/productoEstado";
const productoEstadoResource = new ProductoEstadoResource();

export default {
  name: "CrearProductoEstado",
  data() {
    return {
      nuevoProductoEstado: {
        nombre: "",
        productoEstado: "",
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
  created() {
    this.resetModel();
  },
  methods: {
    resetModel() {
      this.nuevoProductoEstado = {
        nombre: "",
        productoEstado: "",
      };
    },
    crearProductoEstado() {
      this.$refs["nuevoProductoEstado"].validate((valid) => {
        if (valid) {
          this.loading = true;
          productoEstadoResource
            .store(this.nuevoProductoEstado)
            .then((response) => {
              console.log(response);
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
