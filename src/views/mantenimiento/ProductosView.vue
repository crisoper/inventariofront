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
          @click="crearProductoDialog = true"
        >
          Nuevo
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="listaItem" style="width: 100%">
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
    <!-- Nuevo tipo de bien -->
    <el-dialog v-model="crearProductoDialog" title="Nuevo Producto" top="10px">
      <CrearProducto @close="cerrarDialogCrear" />
    </el-dialog>
    <!-- Editar tipo de bien -->
    <el-dialog v-model="editarTipoBienDialog" title="Editar Datos">
      <EditarTipoBien :id="idRegistroEditar" @close="cerrarDialagoEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Componentes
import EditarTipoBien from "./components/EditarTipoBien.vue";
import CrearProducto from "./components/CrearProducto.vue";
// Recurso
import ProductoResource from "@/api/mantenimiento/producto";
import { ElMessage } from "element-plus";
const productoResource = new ProductoResource();
export default {
  name: "TipoBienView",
  components: { CrearProducto, EditarTipoBien },
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
      crearProductoDialog: false,
      editarTipoBienDialog: false,
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
          const { data } = response;
          this.listaItem = data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    cerrarDialogCrear() {
      this.crearProductoDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.$nextTick(() => {
        this.editarTipoBienDialog = true;
      });
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      productoResource
        .destroy(id_registro)
        .then(() => {
          ElMessage({
            message: "Tipo de Bien eliminado",
            type: "success",
          });
          this.fetchData();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error al eliminar el tipo de bien",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },
    cerrarDialagoEditar() {
      this.editarTipoBienDialog = false;
      this.fetchData();
    },
  },
};
</script>

<style scoped></style>
