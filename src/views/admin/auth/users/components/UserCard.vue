<template>
  <el-card class="mt-3 mb-4" shadow="never">

    <div class="user-profile">
      <div class="box-center">
        <el-avatar :size="size" :src="circleUrl" />
      </div>
      <div class="box-center mt-3">
        <div class="user-role">
          {{ userModel.persona_dni }}
        </div>
        <div class="user-name text-center">
          <h4 class="text-bold">{{ userModel.persona_full_name }}</h4>
        </div>
        <div class="user-role">
          {{ userModel.email }}
        </div>
        <div class="user-role mt-4">
          {{ userModel.rol_name }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
const userResource = new Resource('miperfil')

export default {
  name: 'UserCard',
  components: {},
  data() {
    return {
      size: 120,
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      userModel: {
        id: '',
        email: '',
        persona_dni: '',
        persona_full_name: '',
        rol_name: '',
      }
    }
  },
  computed: {},
  mounted() {},
  created() {
    this.getDatosUsuario()
  },
  methods: {
    async getDatosUsuario() {
      await userResource
        .list({})
        .then((response) => {
          const { data } = response
          this.userModel = {...data }
          this.loadingData = false
        })
        .catch(() => {
          this.loadingData = false
        })
    }
  }
}
</script>
<style>
.text-bold {
  font-weight: 700;
}

.box-center {
  text-align: center;
}
</style>