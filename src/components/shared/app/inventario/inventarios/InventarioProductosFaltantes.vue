<template>
  <div v-if="query.inventario_id > 0" v-loading="loadingData" class="box-card mt-3" shadow="never">
    <el-row :gutter="12" class="mb-3">
      <el-col :xs="24" :sm="18" :md="16" class="mb-2">
        <el-input
          v-model="query.keyBuscar"
          style="max-width: 600px"
          placeholder="Buscar"
          class="input-with-select"
          @keyup.enter="loadData"
          :clearable="true"
          @clear="loadData"
        >
          <template #append>
            <el-button type="primary" :icon="Search" @click="loadData" />
          </template>
        </el-input>
      </el-col>
      <el-col :xs="12" :sm="6" :md="4">
        <el-button
          type="primary"
          style="width: 100% !important"
          @click="nuevoProducto()"
        >
          Nuevo producto
        </el-button>
      </el-col>
      <el-col :xs="12" :sm="6" :md="4">
        <el-button
          type="primary"
          style="width: 100% !important"
          @click="exportarDatos()"
        >
          Exportar
        </el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTableRef"
      :border="true"
      :stripe="true"
      :data="detalleInventario"
      style="width: 100% !important"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template #default="props">
          <div class="p-1">
            <table class="table-custom-striped">
              <tbody>
                <tr>
                  <td class="font-weight-600">Código producto</td>
                  <td>{{ props.row.codigo }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Nombre producto</td>
                  <td>{{ props.row.nombre }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Área</td>
                  <td>{{ props.row.ultimaasignacionresponsable?.area?.nombre }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Ubicación</td>
                  <td>{{ props.row.ultimaasignacionresponsable?.ubicacion?.nombre }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Estado</td>
                  <td>{{ props.row.ultimaasignacionresponsable?.productoestado?.nombre }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Fecha</td>
                  <td>{{ props.row.ultimaasignacionresponsable?.fecha_es }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="codigo" label="CÓDIGO" width="120" />
      <el-table-column prop="nombre" label="PRODUCTO" min-width="180" />
      <el-table-column prop="fecha_compra_es" label="FECHA COMPRA" width="150" />
    </el-table>
    <el-row type="flex" class="mt-4" justify="end">
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.limit"
        :total="total"
        :page-sizes="[7, 15, 25, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="loadData"
        @current-change="loadData"
      />
    </el-row>
    <el-dialog
      v-model="dialogBuscarProducto"
      title="Registrar producto"
      width="85%"
      top="5vh"
      :close-on-click-modal="false"
      :appeappend-to-body="true"
    >
      <div>
        <CrearProducto ref="refCrearProducto" @close="cerrarDialogCrear($event)" />
      </div>
    </el-dialog>
  </div>
  <div v-else>
    <p>
      Los datos no fueron cargados correctamente.
    </p>
    <p>
      Por favor, inténtelo nuevamente.
    </p>
  </div>
</template>

<script>
// import { ElNotification } from 'element-plus'
import {
  // Delete, 
  Close,
  Refresh,
  Search,
  // ScaleToOriginal,
  Printer } from "@element-plus/icons-vue"
import Resource from "@/api/resource"
import CrearProducto from "@/components/shared/app/productos/FormAddProducto.vue";
const faltantesResource = new Resource("inventario/productosfaltantes")
const exportResource = new Resource("exportar/productosfaltantes/inventario");

export default {
  name: "FormUser",
  components: {
    CrearProducto
    // Delete,
    // ScaleToOriginal
    // formBuscarPersona,
  },
  props: {
    inventarioid: {
      type: Number,
      required: true,
      default: () => {
        return -13
      },
    },
  },
  data() {
    return {
      Close,
      Refresh,
      Search,
      Printer,
      loadingData: false,
      lAreas: [],
      query: {
        area_id: undefined,
        keyBuscar: '',
        page: 1,
        limit: 7,
        inventario_id: -99
      },
      dialogBuscarProducto: false,
      total: 0,
      detalleInventario: [],
      multipleSelection: []
    };
  },
  watch: {
    inventarioid: function () {
      this.setCrearOUpdate();
    },
  },
  computed: {},
  created() {},
  methods: {
    setCrearOUpdate() {
      console.log("Inventario productos: " + this.inventarioid);
      this.$nextTick(() => {
        if (this.inventarioid > 0) {
          this.query.inventario_id = this.inventarioid;
          this.loadData();
        } else {
          this.query.inventario_id = undefined;
        }
      });
    },
    loadData() {
      const { limit, page } = this.query
      this.loadingData = true
      faltantesResource
        .list(this.query)
        .then((response) => {
          const { data, meta } = response
          this.detalleInventario = data
          this.detalleInventario.forEach((element, index) => {
            element['index'] = (page - 1) * limit + index + 1
          })
          this.total = meta.total
          this.loadingData = false
        })
        .catch((error) => {
          console.log(error)
          this.loadingData = false
          console.log('No se ha obtenido el detalle')
        })
        .finally(() => {
          this.loadingData = false
        })
    },
    close(status) {
      if (this.createUserForm) {
        this.createUserForm.resetFields();
      }
      this.$emit("closeChild", status);
    },
    editarItem(detalle) {
      console.log(detalle)
    },
    imprimirItem(url) {
      const link = document.createElement('a')
      link.href = url
      document.body.appendChild(link)
      link.click()
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
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    nuevoProducto() {
      this.dialogBuscarProducto = true;
      this.$nextTick(() => {
        this.$refs['refCrearProducto'].resetModel()
      })
    },
    cerrarDialogCrear(data) {
      this.dialogBuscarProducto = false
    }
  },
};
</script>
