<template>
  <div v-loading="loading">
    <el-form ref="editPermissionForm" :model="permission" :rules="rules" label-position="top">
      <el-form-item prop="name" label="Nombre">
        <el-input v-model="permission.name" placeholder="Ejem: listar-usuarios" />
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button @click="close('canceled')"> Cancelar </el-button>
      <span style="width: 15px" />
      <el-button @click="submitForm(editPermissionForm)"> Guardar </el-button>
    </el-row>
  </div>
</template>

<script setup>
import PermissionRequest from '@/api/auth/permision'
import { ElNotification } from 'element-plus'
const permissionRequest = new PermissionRequest()
import { reactive, ref, onMounted, watch } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  idPermission: {
    type: String,
    required: true
  }
})

watch(() => {
  return props.idPermission;
}, (newValue, oldValue) => {
  if(newValue != oldValue) {
    cargarRegistro()
  }
});
const emit = defineEmits(['close'])

const loading = ref(false)
const editPermissionForm = ref()
const permission = reactive({
  id: '',
  name: ''
})

const cargarRegistro = () => {
  loading.value = true
  permissionRequest
    .get(props.idPermission)
    .then((response) => {
      const { data } = response
      Object.assign(permission, data)
      // permission.value = data
      loading.value = false
    })
    .catch((error) => {
      console.log(error)
      loading.value = true
      ElNotification({
        type: 'error',
        title: 'Error al recuperar el registro',
        duration: 2000
      })
      close('canceled')
    })
}

onMounted(() => {
  cargarRegistro()
})

const rules = reactive({
  name: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }]
})

const submitForm = async (formEl) => {
  if (!formEl) return
  loading.value = true
  await formEl.validate((valid) => {
    if (valid) {
      permissionRequest
        .update(permission.id,permission)
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
          ElNotification({
            type: 'success',
            title: 'Permiso actualizado',
            duration: 2000
          })
          close('success')
          loading.value = false
        })
        .catch((error) => {
          console.log(error)
          loading.value = false
        })
    } else {
      loading.value = false
    }
  })
}

const resetForm = () => {
  Object.assign(
    permission,
    reactive({
      id: '',
      name: ''
    })
  )
}

const close = (status) => {
  emit('close', status)
  resetForm()
}
</script>
