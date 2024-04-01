<template>
  <div v-loading="loading">
    <el-form
      ref="nuevaAreaForm"
      :model="nuevaArea"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :xs="24">
          <el-form-item label="Código" prop="codigo">
            <el-input
              v-model="nuevaArea.codigo"
              placeholder="El codigo es autogenerado"
              readonly
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24">
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
      <el-button type="primary" @click="crearArea">Guardar</el-button>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import AreaResource from "@/api/mantenimiento/area";
const areaResource = new AreaResource();

export default {
  name: "CrearArea",
  data() {
    return {
      nuevaArea: {
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
      this.nuevaArea = {}
    },
    crearArea() {
      this.$refs["nuevaAreaForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          areaResource
            .store(this.nuevaArea)
            .then((response) => {
              console.log(response)
              this.close();
              ElMessage({
                message: "Agregado correctamente",
                type: "success",
              });
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
