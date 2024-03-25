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
          @click="crearAlmacenDialog = true"
        >
          Nuevo
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
    <!-- Nueva tarea -->
    <el-dialog v-model="crearAlmacenDialog" title="Nuevo Almacen">
      <CrearAlmacen @close="cerrarDialago" />
    </el-dialog>
    <!-- Nueva tarea -->
    <el-dialog v-model="editarAlmacenDialog" title="Editar Datos">
      <EditarAlmacen :id="idRegistroEditar" @close="cerrarDialagoEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Componentes
import EditarAlmacen from "./components/EditarAlmacen.vue";
import CrearAlmacen from "./components/CrearAlmacen.vue";
// Resource
import AlmacenResource from "@/api/mantenimiento/almacen";
import { ElMessage } from "element-plus";
const almacenResource = new AlmacenResource();
export default {
  name: "AlmacenView",
  components: { CrearAlmacen, EditarAlmacen },
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
      crearAlmacenDialog: false,
      editarAlmacenDialog: false,
      idRegistroEditar: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      almacenResource
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
      this.crearAlmacenDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.$nextTick(() => {
        this.editarAlmacenDialog = true;
      });
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      almacenResource
        .destroy(id_registro) // Corregir nombre de la variable aquí
        .then(() => {
          ElMessage({
            message: "Almacén eliminado",
            type: "success",
          });
          this.fetchData();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error al eliminar el almacén",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },

    cerrarDialagoEditar() {
      this.editarAlmacenDialog = false;
      this.fetchData();
      this.$nextTick(() => {
        this.idRegistroEditar = -1;
      })
    },
  },
};
</script>

<style scoped></style>
