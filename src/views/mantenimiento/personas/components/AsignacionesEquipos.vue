<template>
  <div v-if="persona" v-loading="loading">
    <el-row>
      <el-col :span="18">
        <h2>Equipos asignados a: {{ persona.nombre_completo }}</h2>
      </el-col>
      <el-col :span="6">
        <el-button type="primary"  @click="listarAsignaciones">
          <template #icon>
            <el-icon><RefreshRight /></el-icon>
          </template>
        </el-button>
        <el-button type="primary" @click="openCrearAsignacionDialog">
          <template #icon>
            <el-icon><Plus /></el-icon>
          </template>
          Nueva</el-button>
      </el-col>
    </el-row>
    <el-divider />
    <el-row>
      <el-col :span="24">
        <el-table :data="asignaciones">
          <el-table-column type="index" label="#" />
          <el-table-column prop="producto.nombre" label="Producto" min-width="350px"/>
          <el-table-column prop="productoestado.nombre" label="Estado Producto"  width="150px"/>
          <el-table-column prop="area.nombre" label="Area" min-width="350px"/>
          <el-table-column prop="fecha" label="Fecha asignación" min-width="200px"/>
          <el-table-column prop="descripcion" label="Descripción" min-width="350px"/>
        </el-table>
      </el-col>
    </el-row>
    <!-- Dialog Nueva Asignacion -->
    <el-dialog v-model="crearAsignacionDialog" title="Crear Asignación" append-to-body destroy-on-close>
      <CrearAsignacion :persona="persona" @close="cerrarDialago" />
    </el-dialog>
  </div>
  <div v-else></div>
</template>

<script>
import CrearAsignacion from './CrearAsignacion.vue'
import { RefreshRight, Plus } from "@element-plus/icons-vue";
import Resource from "@/api/resource";
const asignacionesEquipoResource = new Resource(
  "inventario/asingacionesequipos"
);
export default {
  name: "AsignacinesEquipos",
  components: {RefreshRight , Plus,CrearAsignacion},
  props: {
    persona: {},
  },
  data() {
    return {
      loading: false,
      asignaciones: [],
      crearAsignacionDialog: false,
    };
  },
  watch: {
    persona: function (newVal, oldVal) {
      if(newVal != oldVal && newVal != null) {
        this.listarAsignaciones()
      }
    }
  },
  mounted() {
    this.listarAsignaciones()
  },
  methods: {
    listarAsignaciones() {
      this.loading = true
      asignacionesEquipoResource
        .list({ responsable_id: this.persona.id })
        .then((response) => {
          const { data } = response
          this.asignaciones = data
          this.loading = false
        })
        .catch(() => {});
    },
    openCrearAsignacionDialog() {
      this.crearAsignacionDialog = true
    },
    cerrarDialago() {
      this.crearAsignacionDialog = false
      this.$nextTick(() => {
        this.listarAsignaciones()
      })
    }
  },
};
</script>
