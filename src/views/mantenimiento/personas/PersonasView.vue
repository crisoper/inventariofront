<template>
  <el-card shadow="never">
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
          placeholder="Buscar área"
        />
      </el-col>

      <el-col :span="5">
        <el-button
          type="primary"
          style="width: 100% !important"
          @click="crearAreaDialog = true"
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
      <el-table-column type="index" label="#" width="50px" />
      <el-table-column
        prop="nro_doc_identidad"
        label="Nro. Doc. Identidad"
        width="200px"
      />
      <el-table-column
        prop="nombre_completo"
        label="Nombre"
        min-width="350px"
      />
      <el-table-column label="Opciones" width="200px">
        <template #default="scope">
          <el-icon
            @click="verAsignacionesEquipos(scope.row)"
            color="#409EFC"
            size="18px"
            class="icon-btn pointer"
            title="Asignaciones"
          >
            <List />
          </el-icon>
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
    <el-row type="flex">
      <el-col :span="24">
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
        <!-- <el-pagination
          :total="query.total"
          :current-page="query.page"
          :page-size="query.limit"
          @current-change="fetchData"
        ></el-pagination> -->
      </el-col>
    </el-row>
    <!-- Nueva área -->
    <el-dialog v-model="editarAreaDialog" title="Editar Persona">
      <CrearPersona :id="idRegistroEditar" @close="cerrarDialagoEditar" />
    </el-dialog>
    <!-- Editar área -->
    <el-dialog v-model="crearAreaDialog" title="Crear Persona">
      <EditarPersona @close="cerrarDialago" />
    </el-dialog>
    <!-- Dialog Asignaciones Persona -->
    <el-dialog
      v-model="asignacionesDialog"
      title="Equipos Asignadsos"
      fullscreen
    >
      <AsignacionesEquipos
        :persona="registroAsignaciones"
        @close="cerrarDialagoAsignaciones"
      />
    </el-dialog>
  </el-card>
</template>

<script>
// Componentes
import EditarPersona from "./components/EditarPersona.vue";
import CrearPersona from "./components/CrearPersona.vue";
import AsignacionesEquipos from "./components/AsignacionesEquipos.vue";
import { Edit, List, Delete } from "@element-plus/icons-vue";
// Resource
import PersonasResource from "@/api/mantenimiento/persona";
import { ElMessage } from "element-plus";
const personasResource = new PersonasResource();

import Resource from "@/api/resource";
const exportResource = new Resource("exportar/personas");

export default {
  name: "AreaView",
  components: {
    EditarPersona,
    CrearPersona,
    AsignacionesEquipos,
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
      listaItem: [],
      crearAreaDialog: false,
      editarAreaDialog: false,
      idRegistroEditar: null,
      asignacionesDialog: false,
      registroAsignaciones: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      personasResource
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
      this.crearAreaDialog = false;
      this.fetchData();
    },
    abrirDialogEditar(id_registro) {
      this.idRegistroEditar = id_registro;
      this.$nextTick(() => {
        this.editarAreaDialog = true;
      });
    },
    eliminarRegistro(id_registro) {
      this.loading = true;
      personasResource
        .destroy(id_registro)
        .then(() => {
          ElMessage({
            message: "Persona Eliminada",
            type: "success",
          });
          this.fetchData();
        })
        .catch((error) => {
          ElMessage({
            message: "Ocurrió un error",
            type: "error",
          });
          console.log(error);
          this.loading = false;
        });
    },
    cerrarDialagoEditar() {
      this.editarAreaDialog = false;
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
    verAsignacionesEquipos(persona) {
      this.registroAsignaciones = persona;
      this.$nextTick(() => {
        this.asignacionesDialog = true;
      });
    },
    cerrarDialagoAsignaciones() {
      this.asignacionesDialog = false;
      this.$nextTick(() => {
        this.registroAsignaciones = null;
      });
    },
  },
};
</script>

<style scoped></style>
