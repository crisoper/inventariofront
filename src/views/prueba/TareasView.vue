<template>
  <div class="mt-3 px-3">
    <el-row :gutter="10" class="mb-2" type="flex" justify="space-between" align="middle">
      <el-col :span="13">
        <el-input v-model="query.keyword" @keyup.enter="fetchData()"/>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" style="width: 100%!important;" @click="crearTareaDialog = true">
          Nuevo
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="listaItem" style="width: 100%">
      <el-table-column prop="nombre" label="Nombre"/>
      <el-table-column prop="completado" label="Completado"/>
      <el-table-column label="Opciones" >
        <template #default="scope">
            Ver
            Editar
            Eliminar
            {{ scope.id }}
        </template>
      </el-table-column>
    </el-table>
    <!-- Nueva tarea -->
    <el-dialog v-model="crearTareaDialog" title="Crear Tarea" >
      <CrearTarea @close="cerrarDialago"/>
    </el-dialog>
  </div>
</template>

<script>
import CrearTarea from './components/CrearTarea.vue'
import TareasResource from "@/api/prueba/tareas";
const tareasResource = new TareasResource();
export default {
  name: "TareasView",
  components: { CrearTarea },
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
      crearTareaDialog: false
    };
  },
  created() {
    this.fetchData()
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
      this.crearTareaDialog = false
      this.fetchData()
    }
  },
};
</script>

<style scoped></style>
