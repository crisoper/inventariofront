<template>
  <div class="mt-3 px-3">
    <el-table :data="listaItem" style="width: 100%">
      <el-table-column prop="nombre" label="Nombre"/>
      <el-table-column prop="Completado" label="Completado"/>
      <el-table-column label="Opciones" >
        <template #default="scope">
            Ver
            Editar
            Eliminar
            {{ scope.id }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import TareasResource from "/src/api/prueba/tareas";
const tareasResource = new TareasResource();
export default {
  name: "TareasView",
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
  },
};
</script>

<style scoped></style>
