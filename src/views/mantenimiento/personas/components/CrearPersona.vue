<template>
  <div v-loading="loading">
    <el-form
      ref="nuevaPersonaForm1"
      :model="nuevaPersona"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Tipo" prop="tipo">
            <el-select v-model="nuevaPersona.tipo" style="width: 100%;" @change="changeTipoPersona">
              <el-option label="Natural" value="Natural"></el-option>
              <el-option label="Jurídica" value="Jurídica"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Tipo de documento" prop="documento_tipo">
            <el-select v-model="nuevaPersona.documento_tipo" :disabled="readonlyField" style="width: 100%;" >
              <el-option label="DNI" value="DNI"></el-option>
              <el-option label="RUC" value="RUC"></el-option>
              <el-option label="CE" value="CE"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Número de documento" prop="documento_numero">
            <el-input v-model="nuevaPersona.documento_numero" :disabled="nuevaPersona.documento_tipo === undefined">
              <template #append v-if="nuevaPersona.documento_tipo === 'DNI' || nuevaPersona.documento_tipo === 'RUC'">
                <el-button :icon="Search" @click="consultaDatos()"/>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Nombres" prop="nombres">
            <el-input v-model="nuevaPersona.nombres" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" v-if="nuevaPersona.documento_tipo !== 'RUC'">
          <el-form-item label="Apellido Paterno" prop="apellido_paterno">
            <el-input v-model="nuevaPersona.apellido_paterno" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" v-if="nuevaPersona.documento_tipo !== 'RUC'">
          <el-form-item label="Apellido Materno" prop="apellido_materno">
            <el-input v-model="nuevaPersona.apellido_materno" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" v-if="nuevaPersona.documento_tipo !== 'RUC'">
          <el-form-item label="Fecha de Nacimiento" prop="fecha_nacimiento">
            <el-date-picker
              v-model="nuevaPersona.fecha_nacimiento"
              type="date"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" v-if="nuevaPersona.documento_tipo !== 'RUC'">
          <el-form-item label="Género" prop="genero">
            <el-select v-model="nuevaPersona.genero" placeholder="Seleccionar" style="width: 100%;">
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
      </el-row>
      <el-row :gutter="10" type="flex" justify="end" class="mt-3">
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
  components: {},
  data() {
    const validTipoPersona = (rule, value, callback) => {
      if (this.nuevaPersona.documento_tipo !== 'RUC') {
        if (!value) {
          return callback(new Error('El campo es obligatorio'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const rucdniValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('El campo es obligatorio'))
      } else {
        if (this.nuevaPersona.documento_tipo === 'RUC') {
          if (this.nuevaPersona.documento_numero.length !== 11) {
            return callback(new Error('El campo de tener 11 digitos'))
          } else {
            callback()
          }
        } else if(this.nuevaPersona.documento_tipo === 'DNI') {
          if (this.nuevaPersona.documento_numero.length !== 8) {
            return callback(new Error('El campo de tener 8 digitos'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    return {
      Search,
      readonlyField: false,
      nuevaPersona: {
        id: undefined,
        documento_tipo: 'DNI',
        documento_numero: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        genero: 'Masculino',
        celular: '',
        email: '',
        direccion: '',
        tipo: 'Natural',
      },
      rules: {
        documento_tipo: [ { required: true, message: "El campo es obligatorio", trigger: "change", }, ],
        documento_numero: [ { validator: rucdniValidator, trigger: "blur", }, ],
        nombres: [ { required: true, message: "El campo es obligatorio", trigger: "blur", }, ],
        apellido_paterno: [ { validator: validTipoPersona, trigger: "blur", }, ],
        apellido_materno: [ { validator: validTipoPersona, trigger: "blur", }, ],
        genero: [ { validator: validTipoPersona, trigger: "change", }, ],
        email: [ { type: "email", message: "El campo es obligatorio", trigger: "blur", }, ],
        tipo: [ { required: true, message: "El campo es obligatorio", trigger: "change", }, ],
      },
      loading: false,
    };
  },
  methods: {
    resetModel() {
      this.nuevaPersona = {
        id: undefined,
        documento_tipo: 'DNI',
        documento_numero: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        genero: 'Masculino',
        celular: '',
        email: '',
        direccion: '',
        tipo: 'Natural',
      }
      this.$refs["nuevaPersonaForm1"].resetFields()
    },
    crearPersona() {
      this.$refs.nuevaPersonaForm1.validate((valid) => {
        if (valid) {
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
        } else {
          console.log('El formulario no es válido')
        }
      });
    },

    close() {
      this.$emit("close");
    },
    consultaDatos() {
      // Validar que el campo a buscar sea correcto
      if (this.nuevaPersona.documento_tipo === 'RUC') {
        if (this.nuevaPersona.documento_numero.length !== 11) {
          ElMessage.error('El número de documento debe contener 11 dígitos')
          return
        }
      } else if(this.nuevaPersona.documento_tipo === 'DNI') {
        if (this.nuevaPersona.documento_numero.length !== 8) {
          ElMessage.error('El número de documento debe contener 8 dígitos')
          return
        }
      }
      this.resetFiedBuscar()
      this.loading = true
      consultaResource
        .get(this.nuevaPersona.documento_numero)
        .then((response) => {
          const { state, data, message } = response
          console.log(data)
          if (state === 'success') {
            const { data } = response.data
            this.procesarRespuesta(data)
          } else {
            ElMessage({ message });
          }
          this.loading = false
        })
        .catch((erro) => {
          this.loading = false
          console.log(erro)
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetFiedBuscar() {
      this.nuevaPersona.apellido_paterno = ''
      this.nuevaPersona.apellido_materno = ''
      this.nuevaPersona.nombres = ''
    },
    procesarRespuesta(data) {
      if (this.nuevaPersona.documento_tipo === 'DNI') {
        this.nuevaPersona.apellido_materno = data.apellido_materno
        this.nuevaPersona.apellido_paterno = data.apellido_paterno
        this.nuevaPersona.nombres = data.nombres
      } else {
        this.nuevaPersona.nombres = data.nombre_o_razon_social
      }
    },
    changeTipoPersona(data) {
      if (data === 'Jurídica') {
        this.nuevaPersona.documento_tipo = 'RUC'
        this.readonlyField = true
      } else {
        this.readonlyField = false
      }
    }
  },
};
</script>

<style scoped></style>
