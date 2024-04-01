<template>
  <div v-loading="loading">
    <el-form
      ref="editarPersonaForm"
      :model="persona"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Tipo de documento" prop="documento_tipo">
            <el-select v-model="persona.documento_tipo">
              <el-option label="DNI" value="DNI"></el-option>
              <el-option label="RUC" value="RUC"></el-option>
              <el-option label="CE" value="CE"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Número de documento" prop="documento_numero">
            <el-input v-model="persona.documento_numero" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Nombres" prop="nombres">
            <el-input v-model="persona.nombres" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Apellido Paterno" prop="apellido_paterno">
            <el-input v-model="persona.apellido_paterno" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Apellido Materno" prop="apellido_materno">
            <el-input v-model="persona.apellido_materno" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Fecha de Nacimiento" prop="fecha_nacimiento">
            <el-date-picker v-model="persona.fecha_nacimiento" type="date" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Género" prop="genero">
            <el-select v-model="persona.genero">
              <el-option label="Masculino" value="Masculino"></el-option>
              <el-option label="Femenino" value="Femenino"></el-option>
              <el-option label="Otro" value="Otro"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Celular" prop="celular">
            <el-input v-model="persona.celular" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Correo Electrónico" prop="email">
            <el-input v-model="persona.email" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Dirección" prop="direccion">
            <el-input v-model="persona.direccion" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Tipo" prop="tipo">
            <el-select v-model="persona.tipo">
              <el-option label="Natural" value="Natural"></el-option>
              <el-option label="Jurídica" value="Jurídica"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" type="flex" justify="end">
        <el-button type="primary" plain @click="close">Cancelar</el-button>
        <el-button type="primary" @click="guardarEdicion">Guardar</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import PersonaResource from "@/api/mantenimiento/persona";
const personaResource = new PersonaResource();

export default {
  name: "EditarPersona",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      persona: {
        documento_tipo: "",
        documento_numero: "",
        nombres: "",
        apellido_paterno: "",
        apellido_materno: "",
        fecha_nacimiento: "",
        genero: "",
        celular: "",
        email: "",
        direccion: "",
        tipo: "",
      },
      rules: {
        // Define tus reglas de validación aquí
      },
      loading: false,
    };
  },
  mounted() {
    this.cargarInformacionPersona();
  },
  methods: {
    cargarInformacionPersona() {
      this.loading = true;
      personaResource
        .get(this.id)
        .then((response) => {
          const { data } = response;
          this.persona = data;
          this.loading = false;
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error al cargar la información de la persona",
            type: "error",
          });
          console.error(error);
          this.loading = false;
        });
    },
    guardarEdicion() {
      this.$refs["editarPersonaForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          personaResource
            .update(this.id, this.persona)
            .then((response) => {
              console.log(response);
              this.close();
              ElMessage({
                message: "Persona actualizada correctamente",
                type: "success",
              });
              this.loading = false;
            })
            .catch((error) => {
              ElMessage({
                message: "Ocurrió un error al actualizar la persona",
                type: "error",
              });
              console.error(error);
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
