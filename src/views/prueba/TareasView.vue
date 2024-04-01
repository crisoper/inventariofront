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
          @click="crearTareaDialog = true"
        >
          Nuevo
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="listaItem" style="width: 100%">
      <el-table-column prop="nombre" label="Nombre" />
      <el-table-column prop="completado" label="Completado" />
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
    <el-dialog v-model="crearTareaDialog" title="Crear Tarea">
      <CrearTarea @close="cerrarDialago" />
    </el-dialog>
    <!-- Nueva tarea -->
    <el-dialog v-model="editarTareaDialog" title="Crear Tarea">
      <EditarTarea :id="idRegistroEditar" @close="cerrarDialagoEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Componentes
import EditarTarea from "./components/EditarTarea.vue";
import CrearTarea from "./components/CrearTarea.vue";
// Resource
import TareasResource from "@/api/prueba/tareas";
import { ElMessage } from "element-plus";
const tareasResource = new TareasResource();
export default {
  name: "TareasView",
  components: { CrearTarea, EditarTarea },
  data() {
    return {
      loading: false,
      query: {
        keyword: "",
        limit: 7,
        total: 0,
        page: 1,
      },
      listaItem: [],
      crearTareaDialog: false,
      editarTareaDialog: false,
      idRegistroEditar: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      tareasResource
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
      this.crearTareaDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.$nextTick(() => {
        this.editarTareaDialog = true;
      });
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      tareasResource
        .destroy(id_registro)
        .then(() => {
          ElMessage({
            message: "Tarea Elimanda",
            type: "success",
          });
          this.fetchData();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrio un error",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },
    cerrarDialagoEditar() {
      this.editarTareaDialog = false;
      this.fetchData();
    },
  },
};
</script>

<style scoped></style>
