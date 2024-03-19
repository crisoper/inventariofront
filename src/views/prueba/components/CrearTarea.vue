<template>
  <div v-loading="loading">
    <el-form ref="nuevaTareaForm" :model="nuevaTarea" :rules="rules">
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="nuevaTarea.nombre" />
      </el-form-item>
    </el-form>
    <el-row :gutter="10" type="flex" justify="end">
      <el-button type="primary" plain @click="close">Cancelar</el-button>
      <el-button type="primary" @click="crearTarea">Guardar</el-button>
    </el-row>
  </div>
</template>

<script>
import TareasResource from "@/api/prueba/tareas";
import { ElMessage } from "element-plus";
const tareasResource = new TareasResource();

export default {
  name: "CrearTarea",
  data() {
    return {
      nuevaTarea: {
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
    crearTarea() {
        this.$refs['nuevaTareaForm'].validate((valid) => {
            if(valid) {
                this.loading = true;
                tareasResource
                  .store(this.nuevaTarea)
                  .then((response) => {
                    this.close();
                    ElMessage({
                      message: "Tarea Creada",
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
        })
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped></style>
