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
          @click="crearCategoriaDialog = true"
        >
          Nuevo
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="listaItem" style="width: 100%">
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
    <!-- Nueva categoría -->
    <el-dialog v-model="crearCategoriaDialog" title="Crear Categoría">
      <CrearCategoria @close="cerrarDialogo" />
    </el-dialog>
    <!-- Editar categoría -->
    <el-dialog v-model="editarCategoriaDialog" title="Editar Categoría">
      <EditarCategoria :id="idRegistroEditar" @close="cerrarDialogoEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Componentes
// import EditarCategoria from "./components/EditarCategoria.vue";
import CrearCategoria from "./components/CrearCategoria.vue";
// Resource
import CategoriaResource from "@/api/mantenimiento/categoria";
import { ElMessage } from "element-plus";
const categoriaResource = new CategoriaResource();

export default {
  name: "CategoriaView",
  components: { CrearCategoria },
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
      crearCategoriaDialog: false,
      editarCategoriaDialog: false,
      idRegistroEditar: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      categoriaResource
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
      this.crearCategoriaDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.$nextTick(() => {
        this.editarCategoriaDialog = true;
      });
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      categoriaResource
        .destroy(id_registro)
        .then(() => {
          ElMessage({
            message: "Categoría Eliminada",
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
      this.editarCategoriaDialog = false;
      this.fetchData();
    },
  },
};
</script>

<style scoped></style>
