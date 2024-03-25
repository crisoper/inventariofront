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
          @click="crearMarcaDialog = true"
        >
          Nuevo
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="listaItem" style="width: 100%">
      <el-table-column prop="codigo" label="Código" />
      <el-table-column prop="nombre" label="Nombre" />
      <el-table-column prop="descripcion" label="Descripción" />
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
    <!-- Nueva marca -->
    <el-dialog v-model="crearMarcaDialog" title="Crear Marca">
      <CrearMarca @close="cerrarDialogo" />
    </el-dialog>
    <!-- Editar marca -->
    <el-dialog v-model="editarMarcaDialog" title="Editar Marca">
      <EditarMarca :id="idRegistroEditar" @close="cerrarDialogoEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Componentes
import EditarMarca from "./components/EditarMarca.vue";
import CrearMarca from "./components/CrearMarca.vue";
// Resource
import MarcaResource from "@/api/mantenimiento/marca";
import { ElMessage } from "element-plus";
const marcaResource = new MarcaResource();

export default {
  name: "MarcaView",
  components: { CrearMarca, EditarMarca },
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
      crearMarcaDialog: false,
      editarMarcaDialog: false,
      idRegistroEditar: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      marcaResource
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
    cerrarDialogo() {
      this.crearMarcaDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.$nextTick(() => {
        this.editarMarcaDialog = true;
      });
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      marcaResource
        .destroy(id_registro)
        .then(() => {
          ElMessage({
            message: "Marca Eliminada",
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
    cerrarDialogoEditar() {
      this.editarMarcaDialog = false;
      this.fetchData();
    },
  },
};
</script>

<style scoped></style>
