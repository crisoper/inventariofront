<template>
  <div v-loading="loading">
    <el-form :model="formData" :rules="formRules" ref="createUserForm" label-position="top">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Tipo documento" prop="tipo_doc_identidad">
            <el-select
              v-model="formData.id_tipo_doc_identidad"
              placeholder="Seleccionar"
            >
              <el-option
                v-for="tipo in tiposDocIdentidad"
                :key="tipo.id"
                :label="tipo.nombre"
                :value="tipo.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Nro documento" prop="nro_doc_identidad">
            <el-input v-model="formData.nro_doc_identidad" placeholder="Nro documento">
              <template #suffix>
                <v-icon name="hi-search" @click="fetchPersonByDNI" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Apellido paterno" prop="apellido_paterno" @input="formData.apellido_paterno = formData.apellido_paterno.toUpperCase()">
            <el-input v-model="formData.apellido_paterno" placeholder="Apellido paterno" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Apellido materno" prop="apellido_materno" @input="formData.apellido_materno = formData.apellido_materno.toUpperCase()">
            <el-input v-model="formData.apellido_materno" placeholder="Apellido materno" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Nombres" prop="nombres" @input="formData.nombres = formData.nombres.toUpperCase()">
            <el-input v-model="formData.nombres" placeholder="Nombres" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Fecha de nacimiento" prop="fecha_nacimiento">
            <el-date-picker
              v-model="formData.fecha_nacimiento"
              type="date"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              placeholder="Fecha de nacimiento"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Género" prop="genero">
            <el-select v-model="formData.genero" placeholder="Seleccionar">
              <el-option label="Masculino" value="MASCULINO"></el-option>
              <el-option label="Femenino" value="FEMENINO"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Celular" prop="celular">
            <el-input v-model="formData.celular" placeholder="Celular" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Email" prop="email">
            <el-input v-model="formData.email" placeholder="Email" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Rol" prop="rol_id">
            <el-select v-model="formData.rol_id" placeholder="Rol" style="width: 100%">
              <el-option
                v-for="rol in roles"
                :key="rol.id"
                :label="rol.name"
                :value="rol.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider />
    <el-row :gutter="10" type="flex" justify="end">
      <el-button @click="close('canceled')">Cancelar</el-button>
      <el-button type="primary" @click="submitForm">Guardar</el-button>
    </el-row>
  </div>
</template>

<script setup>
// imports de api
// import TipoDocIdentidadRequest from '@/api/maestros/tipodocidentidad'
// const tipoDocIdentidadRequest = new TipoDocIdentidadRequest()
import RoleRequest from '@/api/auth/role'
const roleRequest = new RoleRequest()
// import PaisRequest from '@/api/maestros/pais'
// const paisRequest = new PaisRequest()
// import DepartamentoRequest from '@/api/maestros/departamento'
// const departamentoRequest = new DepartamentoRequest()
import UserRequest from '@/api/auth/usuario'
const userRequest = new UserRequest()
import { onMounted, reactive, ref, watch } from 'vue'
import { ElNotification } from 'element-plus'

const props = defineProps({
  idUser: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])
const loading = ref(false)
const createUserForm = ref()

const formData = ref({
  apellido_paterno: '',
  apellido_materno: '',
  nombres: '',
  nro_doc_identidad: '',
  fecha_nacimiento: '',
  genero: '',
  celular: '',
  email: '',
  id_pais: '',
  id_departamento: '',
  id_tipo_doc_identidad: null,
  roles: null
})

const formRules = ref({
  apellido_paterno: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
  apellido_materno: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
  nombres: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
  nro_doc_identidad: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
  fecha_nacimiento: [{ required: true, message: 'Campo requerido', trigger: 'change' }],
  genero: [{ required: true, message: 'Campo requerido', trigger: 'change' }],
  celular: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
  email: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
  id_tipo_doc_identidad: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
  rol_id: [{ required: true, message: 'Campo requerido', trigger: 'blur' }]
})

const tiposDocIdentidad = ref([])
const roles = ref([])
const departamentos = ref([])

// Recuperando Informacion necesaria para registrar:
onMounted(() => {
  fecthTiposDocIdentidad()
  fetchRoles()
  cargarRegistro()
})

const fecthTiposDocIdentidad = () => {
  tipoDocIdentidadRequest
    .all()
    .then((response) => {
      console.log(response)
      tiposDocIdentidad.value = response.data
    })
    .catch((error) => {
      console.log(error)
      ElNotification({
        type: 'error',
        title: 'Error al precargar data del formulario',
        duration: 2000
      })
      close('canceled')
    })
}

const fetchDepartamentos = () => {
  if (formData.value.id_pais != null && formData.value.id_pais != '') {
    departamentoRequest
      .fetchByPaisId({ id_pais: formData.value.id_pais })
      .then((response) => {
        console.log(response)
        departamentos.value = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

const fetchRoles = () => {
  roleRequest
    .all()
    .then((response) => {
      console.log(response)
      roles.value = response.data
    })
    .catch((error) => {
      console.log(error)
      ElNotification({
        type: 'error',
        title: 'Error al precargar data del formulario',
        duration: 2000
      })
      close('canceled')
    })
}

watch(
  () => {
    return props.idUser
  },
  (newValue, oldValue) => {
    if (newValue != oldValue && newValue != '') {
      loading.value = true
      cargarRegistro()
    }
  }
)

const rolesUsuario = ref([])

const cargarRegistro = () => {
  loading.value = true
  userRequest
    .get(props.idUser)
    .then((response) => {
      console.log(response)
      const { data } = response
      // const date = new Date(data.persona.fecha_nacimiento);
      formData.value.apellido_paterno = data.persona.apellido_paterno
      formData.value.apellido_materno = data.persona.apellido_materno
      formData.value.nombres = data.persona.nombres
      formData.value.nro_doc_identidad = data.persona.nro_doc_identidad
      formData.value.fecha_nacimiento = data.persona.fecha_nacimiento
      // formData.value.fecha_nacimiento = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
      formData.value.genero = data.persona.genero
      formData.value.celular = data.persona.celular
      formData.value.email = data.persona.email
      formData.value.id_tipo_doc_identidad = data.persona.id_tipo_doc_identidad
      formData.value.rol_id = data.rol_id
      rolesUsuario.value = data.roles
      fetchDepartamentos()
      loading.value = false
    })
    .catch((error) => {
      console.log(error)
      loading.value = false
      ElNotification({
        type: 'error',
        title: 'Error al cargar el registro',
        duration: 2000
      })
      close('canceled')
    })
}

// Método para enviar el formulario
const submitForm = () => {
  // Validar el formulario usando VeeValidate u otra biblioteca de validación
  createUserForm.value.validate((valid) => {
    if (valid) {
      // El formulario es válido, puedes realizar acciones adicionales aquí
      console.log('Formulario válido, enviando datos:', formData.value)
      loading.value = true
      userRequest
        .update(props.idUser, formData.value)
        .then((response) => {
          console.log(response)
          ElNotification({
            type: 'success',
            title: 'Usuario actualizado'
          })
          loading.value = false
          close('success')
        })
        .catch((error) => {
          console.log(error)
          loading.value = false
          ElNotification({
            type: 'error',
            title: 'Ocurrio un error al actualizar al usuario'
          })
        })
    } else {
      console.error('Formulario no válido')
    }
  })
}

const resetForm = () => {
  // eslint-disable-next-line no-const-assign
  Object.assign(
    formData,
    reactive({
      apellido_paterno: '',
      apellido_materno: '',
      nombres: '',
      nro_doc_identidad: '',
      fecha_nacimiento: '',
      genero: '',
      celular: '',
      email: '',
      id_pais: '',
      id_departamento: '',
      id_tipo_doc_identidad: null,
      rol_id: null,
      roles: null
    })
  )
}
const close = (status) => {
  emit('close', status)
  resetForm()
}
</script>
