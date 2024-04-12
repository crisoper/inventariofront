<template>
  <div v-loading="loading">
    <el-form
      ref="nuevaPersonaForm"
      :model="nuevaPersona"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Tipo de documento" prop="documento_tipo">
            <el-select v-model="nuevaPersona.documento_tipo">
              <el-option label="DNI" value="DNI"></el-option>
              <el-option label="RUC" value="RUC"></el-option>
              <el-option label="CE" value="CE"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Número de documento" prop="documento_numero">
            <el-input v-model="nuevaPersona.documento_numero" :disabled="nuevaPersona.documento_tipo === undefined">
              <template #append>
                <el-button :icon="Search" @click="consultaDatos()"/>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Nombres" prop="nombres">
            <el-input v-model="nuevaPersona.nombres" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Apellido Paterno" prop="apellido_paterno">
            <el-input v-model="nuevaPersona.apellido_paterno" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Apellido Materno" prop="apellido_materno">
            <el-input v-model="nuevaPersona.apellido_materno" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Fecha de Nacimiento" prop="fecha_nacimiento">
            <el-date-picker
              v-model="nuevaPersona.fecha_nacimiento"
              type="date"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Género" prop="genero">
            <el-select v-model="nuevaPersona.genero">
              <el-option label="Masculino" value="Masculino"></el-option>
              <el-option label="Femenino" value="Femenino"></el-option>
              <el-option label="Otro" value="Otro"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Celular" prop="celular">
            <el-input v-model="nuevaPersona.celular" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Correo Electrónico" prop="email">
            <el-input v-model="nuevaPersona.email" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Dirección" prop="direccion">
            <el-input v-model="nuevaPersona.direccion" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Tipo" prop="tipo">
            <el-select v-model="nuevaPersona.tipo">
              <el-option label="Natural" value="Natural"></el-option>
              <el-option label="Jurídica" value="Jurídica"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" type="flex" justify="end">
        <el-button type="primary" plain @click="close">Cancelar</el-button>
        <el-button type="primary" @click="crearPersona">Guardar</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from "element-plus";
import PersonaResource from "@/api/mantenimiento/persona";
import Resource from "@/api/resource"
const personaResource = new PersonaResource();
const consultaResource = new Resource("inventario/personadni");

export default {
  name: "CrearPersona",
  components: {
    Search
  },
  data() {
    var ValidDocumentoIdentidad = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Please input the age'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('Please input digits'));
        } else {
          if (value < 18) {
            callback(new Error('Age must be greater than 18'));
          } else {
            callback();
          }
        }
      }, 1000);   
    }
    return {
      Search,
      nuevaPersona: {},
      rules: {
        documento_tipo: [
          {
            required: true,
            message: "Seleccione el tipo de documento",
            trigger: "change",
          },
        ],
        documento_numero: [
          {
            required: true,
            message: "Ingrese el número de documento",
            trigger: "blur",
          },
        ],
        nombres: [
          {
            required: true,
            message: "Ingrese el nombre",
            trigger: "blur",
          },
        ],
        apellido_paterno: [
          {
            required: true,
            message: "Ingrese el apellido paterno",
            trigger: "blur",
          },
        ],
        apellido_materno: [
          {
            required: true,
            message: "Ingrese el apellido materno",
            trigger: "blur",
          },
        ],
        // fecha_nacimiento: [
        //   {
        //     required: true,
        //     message: "Seleccione la fecha de nacimiento",
        //     trigger: "change",
        //   },
        // ],
        genero: [
          {
            required: true,
            message: "Seleccione el género",
            trigger: "change",
          },
        ],
        celular: [
          {
            required: true,
            message: "Ingrese el número de celular",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "Ingrese un correo electrónico válido",
            trigger: "blur",
          },
        ],
        direccion: [
          {
            required: true,
            message: "Ingrese la dirección",
            trigger: "blur",
          },
        ],
        tipo: [
          {
            required: true,
            message: "Seleccione el tipo",
            trigger: "change",
          },
        ],
      },
      loading: false,
    };
  },
  methods: {
    crearPersona() {
      this.$refs["nuevaPersonaForm"].validate((valid) => {
        if (valid) {
          const fechaNacimiento = this.nuevaPersona.fecha_nacimiento;
          const fechaFormateada = `${fechaNacimiento.getFullYear()}-${(
            "0" +
            (fechaNacimiento.getMonth() + 1)
          ).slice(-2)}-${("0" + fechaNacimiento.getDate()).slice(-2)}`;

          this.nuevaPersona.fecha_nacimiento = fechaFormateada;
          this.loading = true;
          personaResource
            .store(this.nuevaPersona)
            .then((response) => {
              console.log(response);
              this.close();
              ElMessage({
                message: "Persona agregada correctamente",
                type: "success",
              });
            })
            .catch((error) => {
              ElMessage({
                message: "Ocurrió un error al agregar la persona",
                type: "error",
              });
              console.error(error);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },

    close() {
      this.$emit("close");
    },
    consultaDatos() {

      consultaResource
        .get(this.nuevaPersona.documento_numero)
        .then((response) => {
          const { state, data, message } = response
          console.log(data)
          if (state === 'success') {
            const { data } = response.data
            this.nuevaPersona.documento_numero = data.numero
            this.nuevaPersona.apellido_materno = data.apellido_materno
            this.nuevaPersona.apellido_paterno = data.apellido_paterno
            this.nuevaPersona.nombres = data.nombres
            console.log(data)
          } else {
            ElMessage({ message });
          }
        })
        .catch((erro) => {
          console.log(erro)
        })
    }
  },
};
</script>

<style scoped></style>
