<template>
  <div v-if="query.inventario_id > 0" v-loading="loadingData" class="box-card mt-3" shadow="never">
    <el-row :gutter="12" class="mb-3">
      <el-col :xs="24" :sm="24">
        <el-input
          v-model="query.keyBuscar"
          style="max-width: 600px"
          placeholder="Buscar"
          class="input-with-select"
        >
          <template #prepend>
            <el-select
              v-model="query.area_id"
              placeholder="Área"
              style="width: 140px"
              :clearable="true"
            >
              <el-option
                v-for="area in lAreas"
                :key="area.id"
                :label="area.nombre"
                :value="area.id"
              />
            </el-select>
          </template>
          <template #append>
            <el-button type="primary" :icon="Search" @click="loadData" />
          </template>
        </el-input>
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
                  <td>{{ props.row.producto_codigo }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Nombre producto</td>
                  <td>{{ props.row.producto_nombre }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Área</td>
                  <td>{{ props.row.area_nombre }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Ubicación</td>
                  <td>{{ props.row.ubicacion_nombre }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Estado</td>
                  <td>{{ props.row.producto_estado_nombre }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Fecha</td>
                  <td>{{ props.row.fecha_es }}</td>
                </tr>
                <tr>
                  <td class="font-weight-600">Inventariador</td>
                  <td>{{ props.row.inventariador_nombre }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="47" />
      <el-table-column prop="area_nombre" label="ÁREA" min-width="180" />
      <el-table-column prop="producto_codigo" label="CÓDIGO" width="110" />
      <el-table-column prop="producto_nombre" label="PRODUCTO" min-width="180" />
      <el-table-column label="Acciones" width="90">
        <template #header>
          <el-button
            :disabled="!multipleSelection.length > 0"
            type="primary"
            :icon="Printer"
            @click="imprimirEtiquetasSeleccionados()"
          />
        </template>
        <template #default="scope">
          <div class="text-center">
            <el-icon
              v-if="scope.row.eliminable"
              @click="editarItem(scope.row)"
              color="#e94560"
              size="18px"
              class="icon-btn pointer"
              title="Detalle
            ">
              <Delete />
            </el-icon>
            <el-icon
              v-if="scope.row.archivo_existe"
              @click="imprimirItem(scope.row.archivo_link)"
              color="#333333"
              size="18px"
              class="icon-btn pointer"
              title="Imprimir"
            >
              <ScaleToOriginal />
            </el-icon>
          </div>
        </template>
      </el-table-column>
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
  </div>
  <div v-else>
    <p>
      Los datos no fueron cargados correctamente.
    </p>
    <p>
      Por favor, inténtelo nuevamente.
    </p>
  </div>
  <div>This</div>
  <div style="display: none;">
      <VuePdfEmbed v-if="srcFilePdf" ref="pdf" :source="srcFilePdf" @loaded="print"/>
    </div>
</template>

<script>
import { ElNotification } from 'element-plus'
import { Delete, Close, Refresh, Search, ScaleToOriginal, Printer } from "@element-plus/icons-vue"
import Resource from "@/api/resource"
const areasResource = new Resource("inventario/all/areas")
const invdetalleResource = new Resource("inventario/inventariodetalle")
const imprimirEtiquetas = new Resource("inventario/imprimiretiquetasmasivo")
// PDF PREVIEW
import VuePdfEmbed from 'vue-pdf-embed'

export default {
  name: "FormUser",
  components: {
    Delete,
    ScaleToOriginal,
    VuePdfEmbed,
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
      total: 0,
      detalleInventario: [],
      multipleSelection: [],
      srcFilePdf: null,
    };
  },
  watch: {
    inventarioid: function () {
      this.setCrearOUpdate();
    },
  },
  computed: {},
  created() {
    this.getAllAreas()
  },
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
    async getAllAreas() {
      await areasResource
        .list({})
        .then((response) => {
          this.lAreas = response.data
        })
        .catch((error) => {
          console.log(error)
          close("canceled")
        })
    },
    loadData() {
      const { limit, page } = this.query
      this.loadingData = true
      invdetalleResource
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
      this.loadingData = true
      this.srcFilePdf = url
      // const link = document.createElement('a')
      // link.href = url
      // document.body.appendChild(link)
      // link.click()
    },
    exportarDatos() {
      console.log('Exportar datos')
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    imprimirEtiquetasSeleccionados() {

      let detalleIDs = []
      this.multipleSelection.forEach(objeto => {
        detalleIDs.push(objeto.id)
      });

      this.loadingData = true
      imprimirEtiquetas
      .list({
        ids: detalleIDs
      })
      .then((response) => {

        const { state, message, url } = response
        if (state === 'success') {
          this.srcFilePdf = url
          // const link = document.createElement('a')
          // link.href = url
          // document.body.appendChild(link)
          // link.click()
        } else {
            ElNotification({title: 'Atención', message})
            this.loadingData = false
        }
      })
      .catch((err) => {
        this.loadingData = false
        console.log('Error', err)
      })
    },
    print() {
      this.$refs['pdf'].print()
      this.loadingData = false
    },
    
  }
};
</script>
