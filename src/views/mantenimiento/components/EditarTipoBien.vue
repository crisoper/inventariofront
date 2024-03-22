<template>
  <div v-loading="loading">
    <el-form ref="nuevoTipoBienForm" :model="nuevoTipoBien" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="Código" prop="codigo">
            <el-input v-model="nuevoTipoBien.codigo" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Nombre" prop="nombre">
            <el-input v-model="nuevoTipoBien.nombre" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Descripción" prop="descripcion">
        <el-input v-model="nuevoTipoBien.descripcion" />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" type="flex" justify="end">
      <el-button type="primary" plain @click="close">Cancelar</el-button>
      <el-button type="primary" @click="crearTipoBien">Guardar</el-button>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import TipoBienResource from "@/api/mantenimiento/tipoBien";
const tipoBienResource = new TipoBienResource();

export default {
  name: "CrearTipoBien",
  data() {
    return {
      nuevoTipoBien: {
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
    crearTipoBien() {
      this.$refs["nuevoTipoBienForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          tipoBienResource
            .store(this.nuevoTipoBien)
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
