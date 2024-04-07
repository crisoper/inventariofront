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
          placeholder="Buscar producto"
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
      <!-- <el-col :span="5">
        <el-button
          type="primary"
          style="width: 100% !important"
          @click="importarDatos()"
        >
          Import
        </el-button>
      </el-col> -->
    </el-row>
    <el-table v-loading="loading" :data="listaItem" style="width: 100%">
      <el-table-column prop="codigo" label="Codigo" width="150" />
      <el-table-column prop="nombre" label="Nombre" />
      <el-table-column prop="descripcion" label="descripcion" />
      <el-table-column label="Opciones" width="100">
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
    <!-- Nuevo producto -->
    <el-dialog
      v-model="crearProductoDialog"
      title="Nuevo Producto"
      top="5vh"
      width="80%"
    >
      <CrearProducto ref="refCrearProducto" @close="cerrarDialogCrear" />
    </el-dialog>
    <!-- Editar producto -->
    <el-dialog
      v-model="editarProductoDialog"
      title="Editar Producto"
      top="5vh"
      width="80%"
    >
      <EditarProducto
        ref="refEditarProducto"
        :productoId="idRegistroEditar"
        @close="cerrarDialagoEditar"
      />
    </el-dialog>
  </el-card>
</template>

<script>
// Componentes
import EditarProducto from "./components/EditarProducto.vue";
import CrearProducto from "./components/CrearProducto.vue";
import { Edit, Delete } from "@element-plus/icons-vue";

// Recurso
import ProductoResource from "@/api/mantenimiento/producto";
import { ElMessage } from "element-plus";
const productoResource = new ProductoResource();

import Resource from "@/api/resource";
const exportResource = new Resource("exportar/producto");
const importarResource = new Resource("importarproductos");

export default {
  name: "TipoBienView",
  components: { CrearProducto, EditarProducto, Edit, Delete },
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
      crearProductoDialog: false,
      editarProductoDialog: false,
      idRegistroEditar: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      productoResource
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
      this.crearProductoDialog = true;
      this.$nextTick(() => {
        this.$refs["refCrearProducto"].resetModel();
      });
    },
    cerrarDialogCrear() {
      this.crearProductoDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.editarProductoDialog = true;
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      productoResource
        .destroy(id_registro)
        .then(() => {
          ElMessage({
            message: "Producto eliminado",
            type: "success",
          });
          this.fetchData();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error al eliminar el producto",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },
    cerrarDialagoEditar() {
      this.editarProductoDialog = false;
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
    async importarDatos() {
      await importarResource
        .list(this.query)
        .then((response) => {
          console.log(response)
        })
        .catch(() => {
          this.$message("Se ha producido una excepción");
        });
    },
  },
};
</script>

<style scoped></style>
