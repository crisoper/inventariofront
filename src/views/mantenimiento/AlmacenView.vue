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
          placeholder="Buscar almacén"
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
      <el-table-column prop="codigo" label="codigo" width="90px" />
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
    <!-- Nueva tarea -->
    <el-dialog v-model="crearAlmacenDialog" title="Nuevo Almacen" top="7vh">
      <CrearAlmacen ref="refCrearAlmacen" @close="cerrarDialago" />
    </el-dialog>
    <!-- Nueva tarea -->
    <el-dialog v-model="editarAlmacenDialog" title="Editar Datos">
      <EditarAlmacen :id="idRegistroEditar" @close="cerrarDialagoEditar" />
    </el-dialog>
  </el-card>
</template>

<script>
// Componentes
import EditarAlmacen from "./components/EditarAlmacen.vue";
import CrearAlmacen from "./components/CrearAlmacen.vue";
// Resource
import AlmacenResource from "@/api/mantenimiento/almacen";
import { ElMessage } from "element-plus";
const almacenResource = new AlmacenResource();

import Resource from "@/api/resource";
const exportResource = new Resource("exportar/almacen");

export default {
  name: "AlmacenView",
  components: { CrearAlmacen, EditarAlmacen },
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
          const { data, meta } = response;
          this.listaItem = data;
          this.total = meta.total
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    addItem() {
      this.crearAlmacenDialog = true
      this.$nextTick(() => {
        this.$refs['refCrearAlmacen'].resetModel()
      })
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
