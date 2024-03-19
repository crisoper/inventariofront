<template>
  <el-row :gutter="10" type="flex" justify="start" style="margin: 15px 0">
    <el-col :xs="24" :sm="24" :md="24" class="actions-component">
      <el-input
        v-model="query.keyword"
        placeholder="Buscar por nombre"
        @change="getList"
      >
        <template #append>
          <el-button @click="getList">
            <template #icon>
              <v-icon :name="'bi-search'" />
            </template>
          </el-button>
        </template>
      </el-input>
    </el-col>
  </el-row>
  <el-table v-loading="loading" border :data="tableData" style="width: 100%">
    <el-table-column type="index" label="#" width="80" />
    <el-table-column prop="name" label="NOMBRE" min-width="120" />
    <el-table-column prop="count_user" label="NRO. USUARIOS" min-width="120" />
    <el-table-column fixed="right" align="center" width="150">
      <template #header>
        <el-button type="primary" plain @click="addItem()" v-permission="['autenticacion.roles.crear']">
          <template #icon>
            <v-icon name="ri-add-fill" />
          </template>
        </el-button>
        <el-button type="primary" plain @click="exportarDatos()" v-permission="['autenticacion.roles.exportar']">
          <template #icon>
            <v-icon name="la-database-solid" />
          </template>
        </el-button>
      </template>
      <template #default="scope">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            Opciones
            <v-icon name="fa-caret-down" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="{ item: scope.row.id, action: 'PERMISSIONS' }">
                <span>
                  <v-icon name="md-playlistaddcheck-round" style="margin-right: 10px" />
                  Permisos del rol
                </span>
              </el-dropdown-item>
              <el-dropdown-item :command="{ item: scope.row.id, action: 'EDIT' }">
                <span>
                  <v-icon name="md-edit-round" style="margin-right: 10px" />
                  Editar
                </span>
              </el-dropdown-item>
              <el-dropdown-item :command="{ item: scope.row.id, action: 'DELETE' }">
                <span>
                  <v-icon name="md-delete" style="margin-right: 10px" />
                  Eliminar
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
  <el-divider />
  <el-row type="flex" justify="center">
    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.limit"
      :total="total"
      :page-sizes="[7, 15, 25, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      background
      @size-change="getList"
      @current-change="getList"
    />
  </el-row>
  <el-dialog v-model="openDialogCreate" :width="calcularAnchoDialog('75%','90%')" top="7vh">
    <template #header>
      <h2>Nuevo rol</h2>
    </template>
    <create-role @close="handleCloseCreate" />
  </el-dialog>
  <el-dialog v-model="openDialogEdit" :width="calcularAnchoDialog('75%','90%')" top="7vh">
    <template #header>
      <h2>Editar rol</h2>
    </template>
    <edit-role :id-role="idItemToEdit" @close="handleCloseEdit" :before-close="handleCloseEdit" />
  </el-dialog>
  <el-dialog v-model="openDialogPermissions"  :width="calcularAnchoDialog('75%','90%')" top="7vh">
    <template #header>
      <h2>Permisos del rol</h2>
    </template>
    <role-permissions
      :id-role="idItemToEditPermissions"
      @close="handleClosePermissions"
      :before-close="handleClosePermissions"
    />
  </el-dialog>
</template>

<script setup>
import CreateRole from './components/CreateRole.vue'
import EditRole from './components/EditRole.vue'
import RolePermissions from './components/RolePermissions.vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import RoleRequest from '@/api/auth/role';
import { nextTick, onMounted, reactive, ref } from 'vue';
import { calcularAnchoDialog } from '@/utils/responsive';
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore()
const validPermision = authStore.validPermision

const roleRequest = new RoleRequest();

const loading = ref(false);
const openDialogCreate = ref(false);
const openDialogEdit = ref(false);
const openDialogPermissions = ref(false);
const tableData = ref([]);
const total = ref(0);
const query = reactive({
  keyword: '',
  limit: 7,
  page: 1,
});
const idItemToEdit = ref('');
const idItemToEditPermissions = ref('');

onMounted(() => {
  getList()
})

const getList = () => {
  loading.value = true;
  roleRequest
    .list(query)
    .then((response) => {
      const { data, meta } = response;
      tableData.value = data;
      total.value = meta.total;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
      loading.value = false;
    });
};

const handleCloseCreate = (status) => {
  if (status == 'success') getList();
  openDialogCreate.value = false;
};

const handleCloseEdit = (status) => {
  if (status == 'success') getList();
  idItemToEdit.value = '';
  openDialogEdit.value = false;
};

const handleClosePermissions = () => {
  idItemToEditPermissions.value = '';
  openDialogPermissions.value = false;
};

const handleCommand = ({ item, action }) => {
  console.log(item, action)
  if (action == 'PERMISSIONS' && validPermision('autenticacion.roles.asignarpermisos')) {
    idItemToEditPermissions.value = item;
    nextTick(() => {
      openDialogPermissions.value = true;
    });
  } else if (action == 'EDIT' && validPermision('autenticacion.roles.actualizar')) {
    idItemToEdit.value = item;
    nextTick(() => {
      openDialogEdit.value = true;
    });
  } else if (action == 'DELETE' && validPermision('autenticacion.roles.eliminar')) {
    ElMessageBox.confirm('¿Está seguro que desea eliminar el rol?', 'Eliminar rol', {
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      type: 'warning',
    })
      .then(() => {
        roleRequest
          .destroy(item)
          .then((response) => {
            ElNotification({
              title: 'Rol eliminado',
              type: 'success',
              duration: 2000,
            });
            console.log(response)
            getList();
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    ElNotification({
      // title: 'Atención',
      message: 'Usted no tiene permiso para realizar esta acción',
      type: 'info',
      // duration: 2000,
    });
  }
};

const addItem = () => {
  openDialogCreate.value = true
};

const exportarDatos = () => {
  loading.value = true
  roleRequest
    .exportar()
    .then((response) => {
      loading.value = false
      const link = document.createElement('a')
      link.href = response
      document.body.appendChild(link)
      link.click()
    })
    .catch(() => {
      loading.value = false
    })
};
</script>
