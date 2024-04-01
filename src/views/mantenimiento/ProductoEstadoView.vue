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
          placeholder="Buscar estado de producto"
        />
      </el-col>

      <!-- <el-col :span="5">
        <el-button
          type="primary"
          style="width: 100% !important"
          @click="crearEstadoProductoDialog = true"
        >
          Nuevo
        </el-button>
      </el-col> -->
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
      <el-table-column prop="codigo" label="Código" width="110" />
      <el-table-column prop="nombre" label="Nombre" />
      <el-table-column prop="descripcion" label="Descripción" />
      <!-- <el-table-column label="Opciones" width="210" >
        <template #default="scope">
          <el-button @click="abrirDialogEditar(scope.row.id)">
            Editar
          </el-button>
          <el-button type="danger" @click="eliminarRegistro(scope.row.id)">
            Eliminar
          </el-button>
        </template>
      </el-table-column> -->
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
    <!-- Nuevo estado de producto -->
    <el-dialog
      top="7vh"
      v-model="crearEstadoProductoDialog"
      title="Nuevo Estado de Producto"
    >
      <CrearEstadoProducto @close="cerrarDialago" />
    </el-dialog>
    <!-- Editar estado de producto -->
    <el-dialog top="7vh" v-model="editarEstadoProductoDialog" title="Editar Datos">
      <EditarEstadoProducto
        :id="idRegistroEditar"
        @close="cerrarDialagoEditar"
      />
    </el-dialog>
  </el-card>
</template>

<script>
// Componentes
import { ElMessage } from "element-plus";
import EditarEstadoProducto from "./components/EditarEstadoProducto.vue";
import CrearEstadoProducto from "./components/CrearEstadoProducto.vue";
// Resource
import Resource from "@/api/resource";
const estadoProductoResource = new Resource('inventario/productoestados');
const exportResource = new Resource("exportar/estadoProducto");

export default {
  name: "EstadoProductoView",
  components: {
    CrearEstadoProducto,
    EditarEstadoProducto
  },
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
      crearEstadoProductoDialog: false,
      editarEstadoProductoDialog: false,
      idRegistroEditar: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      estadoProductoResource
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
    cerrarDialago() {
      this.crearEstadoProductoDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.$nextTick(() => {
        this.editarEstadoProductoDialog = true;
      });
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      estadoProductoResource
        .destroy(id_registro) // Corregir nombre de la variable aquí
        .then(() => {
          ElMessage({
            message: "Estado de producto eliminado",
            type: "success",
          });
          this.fetchData();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error al eliminar el estado de producto",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },

    cerrarDialagoEditar() {
      this.editarEstadoProductoDialog = false;
      this.fetchData();
      this.$nextTick(() => {
        this.idRegistroEditar = -1;
      });
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
