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
            <el-input
              v-model="nuevaMarca.codigo"
              :disabled="true"
              placeholder="Autogenerado"
            />
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
      <el-button type="primary" @click="crearMarca">Guardar</el-button>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import MarcaResource from "@/api/mantenimiento/marca";
const marcaResource = new MarcaResource();

export default {
  name: "CrearMarca",
  data() {
    return {
      nuevaMarca: {
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
    resetModel() {
      this.nuevaMarca = {
        nombre: "",
      };
    },
    crearMarca() {
      this.$refs["nuevaMarcaForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          marcaResource
            .store(this.nuevaMarca)
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
