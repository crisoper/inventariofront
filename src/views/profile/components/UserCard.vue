<template>
  <el-card class="mt-3 mb-4" shadow="never">
    <div class="user-profile">
      <div class="box-center">
        <el-avatar :size="100" style="margin-right: 10px">
          <img src="@/assets/avatar/avatar0.svg" alt="User Avatar" />
        </el-avatar>
      </div>
      <div class="box-center">
        <!-- <div class="user-role text-center text-muted">{{ user.dni }}</div> -->
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.email }}</div>
        <!-- <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div> -->
      </div>
    </div>
  </el-card>
</template>

<script>
// import PanThumb from '@/components/PanThumb'

export default {
  // components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          email: "",
          avatar: "",
          role: "",
        };
      },
    },
  },
};
</script>

<style scoped>
.box-center {
  margin: 0 auto;
  display: table;
}
.text-muted {
  color: #777;
}
.user-profile .user-name {
  font-weight: bold;
}
.user-profile .box-center {
  padding-top: 10px;
}
.user-profile .user-role {
  padding-top: 10px;
  font-weight: 400;
  font-size: 14px;
}
.user-profile .box-social {
  padding-top: 30px;
}
.user-profile .box-social .el-table {
  border-top: 1px solid #dfe6ec;
}
.user-profile .user-follow {
  padding-top: 20px;
}
.user-bio {
  margin-top: 20px;
  color: #606266;
}
.user-bio span {
  padding-left: 4px;
}
.user-bio .user-bio-section {
  font-size: 14px;
  padding: 15px 0;
}
.user-bio .user-bio-section .user-bio-section-header {
  border-bottom: 1px solid #dfe6ec;
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
