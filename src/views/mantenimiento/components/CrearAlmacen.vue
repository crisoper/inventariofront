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
          <el-form-item label="Codigo" prop="codigo">
            <el-input
              v-model="nuevoAlmacen.codigo"
              placeholder="El codigo es autogenerado"
              readonly
              disabled
            />
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
      <el-button type="primary" @click="crearAlmacen">Guardar</el-button>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import AlmacenResource from "@/api/mantenimiento/almacen";
const almacenResource = new AlmacenResource();

export default {
  name: "CrearAlmacen",
  data() {
    return {
      nuevoAlmacen: {
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
  created() {
    this.resetModel();
  },
  methods: {
    resetModel() {
      this.nuevoAlmacen = {
        nombre: "",
      };
    },
    crearAlmacen() {
      this.$refs["nuevoAlmacenForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          almacenResource
            .store(this.nuevoAlmacen)
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
