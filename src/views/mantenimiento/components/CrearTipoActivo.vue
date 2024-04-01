<template>
  <div v-loading="loading">
    <el-form
      ref="nuevoTipoActivoForm"
      :model="nuevoTipoActivo"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="nuevoTipoActivo.nombre" />
      </el-form-item>
      <el-form-item label="Descripción" prop="descripcion">
        <el-input v-model="nuevoTipoActivo.descripcion" />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" type="flex" justify="end">
      <el-button type="primary" plain @click="close">Cancelar</el-button>
      <el-button type="primary" @click="crearTipoActivo">Guardar</el-button>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import TipoActivoResource from "@/api/mantenimiento/tipoActivo";
const tipoActivoResource = new TipoActivoResource();

export default {
  name: "CrearTipoActivo",
  data() {
    return {
      nuevoTipoActivo: {
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
      this.nuevoTipoActivo = {
        nombre: "",
      }
    },
    crearTipoActivo() {
      this.$refs["nuevoTipoActivoForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          tipoActivoResource
            .store(this.nuevoTipoActivo)
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
