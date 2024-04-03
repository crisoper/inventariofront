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
          placeholder="Buscar productoEstado"
        />
      </el-col>

      <el-col :span="5">
        <el-button
          type="primary"
          style="width: 100% !important"
          @click="crearProductoEstadoDialog = true"
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
      <el-table-column prop="codigo" label="CÓDIGO" width="120" />
      <el-table-column prop="nombre" label="Nombre" />
      <el-table-column prop="descripcion" label="Descripción" />
      <el-table-column label="Opciones" width="210">
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
    <!-- Nuevo productoEstado -->
    <el-dialog
      top="7vh"
      v-model="crearProductoEstadoDialog"
      title="Nuevo Producto Estado"
    >
      <CrearProductoEstado @close="cerrarDialago" />
    </el-dialog>
    <!-- Editar productoEstado -->
    <el-dialog
      top="7vh"
      v-model="editarProductoEstadoDialog"
      title="Editar Datos"
    >
      <EditarProductoEstado
        :id="idRegistroEditar"
        @close="cerrarDialagoEditar"
      />
    </el-dialog>
  </el-card>
</template>

<script>
// Componentes
import { ElMessage } from "element-plus";
import EditarProductoEstado from "./components/EditarProductoEstado.vue";
import CrearProductoEstado from "./components/CrearProductoEstado.vue";
import { Edit, List, Delete } from "@element-plus/icons-vue";

// Resource
import Resource from "@/api/resource";
const productoEstadoResource = new Resource("inventario/productoestados");
const exportResource = new Resource("exportar/productoEstado");

export default {
  name: "ProductoEstadoView",
  components: {
    CrearProductoEstado,
    EditarProductoEstado,
    Edit,
    List,
    Delete,
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
      crearProductoEstadoDialog: false,
      editarProductoEstadoDialog: false,
      idRegistroEditar: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      productoEstadoResource
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
      this.crearProductoEstadoDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.$nextTick(() => {
        this.editarProductoEstadoDialog = true;
      });
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      productoEstadoResource
        .destroy(id_registro)
        .then(() => {
          ElMessage({
            message: "Producto Estado eliminado",
            type: "success",
          });
          this.fetchData();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error al eliminar el Producto Estado",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },

    cerrarDialagoEditar() {
      this.editarProductoEstadoDialog = false;
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
