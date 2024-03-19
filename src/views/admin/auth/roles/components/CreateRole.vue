<template>
  <div v-loading="loading">
    <el-form ref="createRoleForm" :model="permission" :rules="rules" label-position="top">
      <el-form-item prop="name" label="Nombre">
        <el-input v-model="permission.name" placeholder="Ejem: admin"  @input="permission.name = permission.name.toUpperCase()" />
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="end">
      <el-button @click="close('canceled')"> Cancelar </el-button>
      <span style="width: 15px" />
      <el-button type="primary" @click="submitForm(createRoleForm)"> Guardar </el-button>
    </el-row>
  </div>
</template>

<script setup>
import RoleRequest from '@/api/auth/role'
import { ElNotification } from 'element-plus'
const roleRequest = new RoleRequest()
import { reactive, ref } from 'vue'

const emit = defineEmits(['close'])
const loading = ref(false)
const createRoleForm = ref()
const permission = reactive({
  name: ''
})

const rules = reactive({
  name: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }]
})

const submitForm = async (formEl) => {
  if (!formEl) return
  loading.value = true
  await formEl.validate((valid) => {
    if (valid) {
      roleRequest
        .store(permission)
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
          ElNotification({
            type: 'success',
            title: 'Rol creado',
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
  Object.assign(permission, reactive({
    name: ''
  }));
}

const close = (status) => {
  emit('close', status)
  resetForm()
}
</script>
