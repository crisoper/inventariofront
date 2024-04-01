<template>
  <el-card shadow="never">
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
      <el-table-column prop="index" label="#" width="100" header-align="center" align="center" />
      <el-table-column prop="name" label="NOMBRE" />
      <el-table-column fixed="right" label="Acciones" width="140" align="center">
        <template #header>
          <el-button type="primary" plain @click="addItem()" v-permission="['autenticacion.roles.crear']">
            <template #icon>
              <v-icon name="ri-add-fill" />
            </template>
          </el-button>
          <el-button type="primary" plain @click="exportarDatos()" v-permission="['autenticacion.roles.crear']">
            <template #icon>
              <v-icon name="la-database-solid" />
            </template>
          </el-button>
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
        <h2>Nuevo permiso</h2>
      </template>
      <create-permision @close="handleCloseCreate" />
    </el-dialog>
    <el-dialog v-model="openDialogEdit" :width="calcularAnchoDialog('75%','90%')" top="7vh">
      <template #header> Editar permiso</template>
      <edit-permission :id-permission="idItemToEdit" @close="handleCloseEdit" />
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import CreatePermision from './components/CreatePermission.vue';
import EditPermission from './components/EditPermission.vue';
import PermissionRequest from '@/api/auth/permision';
import { calcularAnchoDialog } from '@/utils/responsive';

const permissionRequest = new PermissionRequest();

const loading = ref(false);
const openDialogCreate = ref(false);
const openDialogEdit = ref(false);
const tableData = ref([]);
const total = ref(0);
const query = reactive({
  keyword: '',
  limit: 7,
  page: 1,
});
const idItemToEdit = ref('');

onMounted(() => {
  getList()
})

const getList = () => {
  console.log('Ejecutando Get List');
  loading.value = true;
  openDialogCreate.value = false;
  openDialogEdit.value = false;
  permissionRequest
    .list(query)
    .then((response) => {
      const { data, meta } = response;
      data.forEach((elemento, index) => {
        elemento.index = (query.page - 1) * query.limit + index + 1;
      });
      total.value = meta.total;
      tableData.value = data;
      loading.value = false;
    })
    .catch((error) => {
      loading.value = false;
      console.log(error);
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

const addItem = () => {
  openDialogCreate.value = true
};

const exportarDatos = () => {
  loading.value = true
  permissionRequest
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
