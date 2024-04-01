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
          placeholder="Buscar tipo de activo "
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
    <!-- Nuevo tipo de activo -->
    <el-dialog top="7vh" v-model="crearTipoActivoDialog" title="Nuevo Tipo de Activo">
      <CrearTipoActivo ref="refCrearTipoActivo" @close="cerrarDialago" />
    </el-dialog>
    <!-- Editar tipo de activo -->
    <el-dialog top="7vh" v-model="editarTipoActivoDialog" title="Editar Datos">
      <EditarTipoActivo ref="refEditarTipoActivo" :id="idRegistroEditar" @close="cerrarDialagoEditar" />
    </el-dialog>
  </el-card>
</template>

<script>
// Componentes
import EditarTipoActivo from "./components/EditarTipoActivo.vue";
import CrearTipoActivo from "./components/CrearTipoActivo.vue";
// Recurso
import TipoActivoResource from "@/api/mantenimiento/tipoActivo";
import { ElMessage } from "element-plus";
const tipoActivoResource = new TipoActivoResource();

import Resource from "@/api/resource";
const exportResource = new Resource("exportar/tipoactivo");

export default {
  name: "TipoActivoView",
  components: { CrearTipoActivo, EditarTipoActivo },
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
      crearTipoActivoDialog: false,
      editarTipoActivoDialog: false,
      idRegistroEditar: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      tipoActivoResource
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
      this.crearTipoActivoDialog = true
      this.$nextTick(() => {
        this.$refs['refCrearTipoActivo'].resetModel()
      })
    },
    cerrarDialago() {
      this.crearTipoActivoDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.$nextTick(() => {
        this.editarTipoActivoDialog = true;
      });
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      tipoActivoResource
        .destroy(id_registro)
        .then(() => {
          ElMessage({
            message: "Tipo de Activo eliminado",
            type: "success",
          });
          this.fetchData();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error al eliminar el tipo de activo",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },
    cerrarDialagoEditar() {
      this.editarTipoActivoDialog = false;
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
