<template>
  <el-card v-loading="loadingData" shadow="never">
    <el-row
      :gutter="10"
      class="mb-2"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <el-col :span="13">
        <el-input
          v-model="query.keyword"
          @keyup.enter="fetchData()"
          placeholder="Buscar categoría"
        />
      </el-col>

      <el-col :span="5">
        <el-button
          type="primary"
          style="width: 100% !important"
          @click="addItem"
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
      <el-table-column prop="nombre" label="Nombre" />
      <el-table-column prop="descripcion" label="Descripción" />
      <el-table-column label="Opciones" width="200px">
        <template #default="scope">
          <el-icon
            @click="abrirDialogEditar(scope.row.id)"
            color="#409EFC"
            size="18px"
            class="icon-btn pointer"
            title="Editar"
          >
            <Edit />
          </el-icon>
          <el-icon
            @click="eliminarRegistro(scope.row.id)"
            color="#f9616d"
            size="18px"
            class="icon-btn pointer"
            title="Eliminar"
          >
            <Delete />
          </el-icon>
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
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-row>
    <!-- Nueva categoría -->
    <el-dialog top="5vh" v-model="crearCategoriaDialog" title="Crear Categoría">
      <CrearCategoria ref="refCrearCategoria" @close="cerrarDialogo" />
    </el-dialog>
    <!-- Editar categoría -->
    <el-dialog
      top="5vh"
      v-model="editarCategoriaDialog"
      title="Editar Categoría"
    >
      <EditarCategoria
        ref="refEditarCategoria"
        :id="idRegistroEditar"
        @close="cerrarDialogoEditar"
      />
    </el-dialog>
  </el-card>
</template>

<script>
// Componentes
import EditarCategoria from "./components/EditarCategoria.vue";
import CrearCategoria from "./components/CrearCategoria.vue";
import { Edit, List, Delete } from "@element-plus/icons-vue";

// Resource
import CategoriaResource from "@/api/mantenimiento/categoria";
import { ElMessage } from "element-plus";
const categoriaResource = new CategoriaResource();

import Resource from "@/api/resource";
const exportResource = new Resource("exportar/categoria");

export default {
  name: "CategoriaView",
  components: { CrearCategoria, EditarCategoria, Edit, List, Delete },
  data() {
    return {
      loading: false,
      query: {
        keyword: "",
        limit: 7,
        total: 0,
        page: 1,
      },
      total: 0,
      loadingData: false,
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
          const { data, meta } = response;
          this.listaItem = data;
          this.total = meta.total;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    addItem() {
      this.crearCategoriaDialog = true;
      this.$nextTick(() => {
        this.$refs["refCrearCategoria"].resetModel();
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
    async exportarDatos() {
      this.loadingData = true;
      await exportResource
        .list(this.query)
        .then((response) => {
          this.loadingData = false;
          const link = document.createElement("a");
          link.href = response;
          document.body.appendChild(link);
          link.click();
        })
        .catch(() => {
          this.$message("Se ha producido una excepción");
          this.loadingData = false;
        });
    },
  },
};
</script>

<style scoped></style>
