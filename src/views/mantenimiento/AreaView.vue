<template>
  <div class="mt-3 px-3">
    <el-row
      :gutter="10"
      class="mb-2"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <el-col :span="13">
        <el-input v-model="query.keyword" @keyup.enter="fetchData()" />
      </el-col>
      <el-col :span="5">
        <el-button
          type="primary"
          style="width: 100% !important"
          @click="crearAreaDialog = true"
        >
          Nuevo
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-button
          type="primary"
          style="width: 100% !important"
          @click="exportarDatos()"
        >
          Exportar
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="listaItem" style="width: 100%">
      <el-table-column prop="codigo" label="codigo" />
      <el-table-column prop="nombre" label="Nombre" />
      <el-table-column prop="descripcion" label="descripcion" />
      <el-table-column label="Opciones">
        <template #default="scope">
          <el-button @click="abrirDialogEditar(scope.row.id)">
            Editar
          </el-button>
          <el-button type="danger" @click="eliminarRegistro(scope.row.id)">
            Eliminar
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Nueva área -->
    <el-dialog v-model="crearAreaDialog" title="Crear Área">
      <CrearArea @close="cerrarDialago" />
    </el-dialog>
    <!-- Editar área -->
    <el-dialog v-model="editarAreaDialog" title="Editar Área">
      <EditarArea :id="idRegistroEditar" @close="cerrarDialagoEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Componentes
// import EditarArea from "./components/EditarArea.vue";
import CrearArea from "./components/CrearArea.vue";
// Resource
import AreaResource from "@/api/mantenimiento/area";
import { ElMessage } from "element-plus";
const areaResource = new AreaResource();

import Resource from '@/api/resource'
const exportResource = new Resource('exportar/areas')

export default {
  name: "AreaView",
  components: { CrearArea },
  data() {
    return {
      loading: false,
      query: {
        keyword: "",
        limit: 10,
        total: 0,
        page: 1,
      },
      listaItem: [],
      crearAreaDialog: false,
      editarAreaDialog: false,
      idRegistroEditar: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      areaResource
        .list(this.query)
        .then((response) => {
          const { data } = response;
          this.listaItem = data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    cerrarDialago() {
      this.crearAreaDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.$nextTick(() => {
        this.editarAreaDialog = true;
      });
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      areaResource
        .destroy(id_registro)
        .then(() => {
          ElMessage({
            message: "Área Eliminada",
            type: "success",
          });
          this.fetchData();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },
    cerrarDialagoEditar() {
      this.editarAreaDialog = false;
      this.fetchData();
    },
    async exportarDatos() {
      this.loadingData = true
      await exportResource
        .list(this.query)
        .then((response) => {
          this.loadingData = false
          const link = document.createElement('a')
          link.href = response
          document.body.appendChild(link)
          link.click()
        })
        .catch(() => {
          this.$message('Se ha producido una excepción')
          this.loadingData = false
        })
    },
  },
};
</script>

<style scoped></style>
