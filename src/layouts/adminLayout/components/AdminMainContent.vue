<template>
  <div class="admin-main-container bg-content-admin">
    <div
      style="
        height: 60px;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: end;
        /* background-color: yellow; */
      "
    >
      <SidebarUser />
    </div>
    <el-scrollbar>
      <div class="bg-content-admin p-4 pb-5" style="width: 100%; overflow-x: hidden;">
        <router-view />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
// import { computed } from "vue";
// import { useAppStore } from "../../../stores/app";
// import { useAuthStore } from "../../../stores/auth";
import SidebarUser from "./SidebarUser.vue";

// const authStore = useAuthStore();
// const appStore = useAppStore();
// const PageInfo = computed(() => {
//   return authStore.getCurrentPageInfo;
// });
</script>

<style scoped>
.admin-main-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: var(--el-text-color-primary);
  transition: margin-left 0.3s ease; /* Agrega una transición para el deslizamiento */
}
</style>
