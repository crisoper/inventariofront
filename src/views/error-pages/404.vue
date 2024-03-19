<template>
    <div class="not-found authenticate-bg">
      <div class="mb-3">
        <img src="@/assets/img/404.svg" alt="Error 404" style="max-width: 280px;">
      </div>
      <p class="mb-4">¡Página no encontrada!</p>
      <div class="mb-1">
        <el-button type="primary" plain @click="volverAtras">Volver</el-button>
      </div>
      <div class="mb-3">
        <el-button type="primary" @click="goToDashboard">Ir al panel de control</el-button>
        <!-- <router-link to="/dashboard">Ir al panel de control</router-link> -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Error404Page',
    methods: {
      volverAtras() {
        this.$router.go(-1); // Vuelve a la ruta anterior
      },
      goToDashboard() {
        this.$router.push('/dashboard'); // Vuelve a la ruta anterior
      },
    }
  }
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  </style>
  