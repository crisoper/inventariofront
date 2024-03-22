<template>
  <el-tabs v-model="activeTab" type="border-card">
    <el-tab-pane label="Lista general" name="lista">
      <!-- Tabla buscar personas -->
      <div class="mt-4" v-loading="loadingData">
        <el-input v-model="listQuery.keyBuscar" placeholder="Buscar por nombre" class="input-with-select" @keyup.enter="handleSearch" clearable @clear="handleSearch">
          <template #append>
            <el-button @click="handleSearch">
              <template #icon>
                <v-icon :name="'bi-search'" />
              </template>
            </el-button>
          </template>
        </el-input>
        <el-table
          :data="items"
          style="width: 100%"
          :border="true"
          class="mt-3"
          empty-text="Sind datos"
        >
          <el-table-column label="Nro" width="70" prop="index" />
          <el-table-column label="Doc. identidad" width="120" prop="nro_doc_identidad" />
          <el-table-column label="Nombre completo" prop="nombre_completo" min-width="140" />
          <el-table-column align="center" label="Acciones" width="100">
            <template #default="scope">
              <v-icon name="pr-arrow-down-right" style="margin-right: 16px; cursor: pointer; color: #409EFF;" @click="handleEmitPropietario(scope.row)" title="Seleccionar" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row type="flex" justify="start" class="mt-3">
        <el-pagination
          v-model:current-page="listQuery.page"
          v-model:page-size="listQuery.limit"
          :total="total"
          :page-sizes="[7, 15, 25, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="getLista"
          @current-change="getLista"
        />
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="Agregar" name="agregar">
      <!-- Formulario agregar persona -->
      <form-create-edit
        ref="formCreateEdit"
        :itemid="item_id"
        @emitFromChild="parentProcessEmitForm($event)"
      />
    </el-tab-pane>
  </el-tabs>
  </template>
  
  <script>
  import Resource from '@/api/resource'
  const personasResource = new Resource('maestros/personas')
  import { ElMessageBox, ElMessage } from 'element-plus'
  import formCreateEdit from './formcreateedit.vue'
  
  export default {
    name: 'SideBar',
    components: {
      formCreateEdit
    },
    data() {
      return {
        listaProvincias: [],
        items: [],
        item_id: -1000000,
        listQuery: {
          page: 1,
          limit: 7,
          provincia_id: undefined,
          keyBuscar: ''
        },
        total: 0,
        activeTab: 'lista',
        action_text: 'create',
        editedItem: { id: 0, name: '' },
        dialogVisible: false,
        loadingData: false,
        titleForm: 'Agregar registro'
      }
    },
    computed: {},
    mounted() {},
    created() {
      this.getLista()
    },
    methods: {
      async getLista() {
        const { limit, page } = this.listQuery
        this.loadingData = true
        await personasResource.list(this.listQuery)
        .then((response) => {
          const { data, meta } = response
          this.items = data
          this.items.forEach((element, index) => {
            element['index'] = (page - 1) * limit + index + 1
          })
          this.total = meta.total
          this.loadingData = false
        })
        .catch(() => {
          this.loadingData = false
        })
      },
      handleSearch() {
        this.listQuery.page = 1
        this.getLista()
      },
      addItem() {
        this.titleForm = 'Agregar registro'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.item_id = -1 * Math.floor(Math.random() * 10000 + 1)
        })
      },
      editItem(item) {
        this.titleForm = 'Modificar registro'
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.item_id = item.id
        })
      },
      deleteItem(row) {
        const msg = `
        ¿Seguro que desea eliminar el registro?<br /><br />
        ${row.nro_doc_identidad + ' - ' + row.nombre_completo}
        `
        ElMessageBox.confirm(
          msg,
          'Atención',
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            type: 'warning',
          }
        )
          .then(() => {
            this.handleDelteItem(row.id)      
          })
          .catch(() => {
            ElMessage('Operación cancelada!')
          })
      },
      handleDelteItem(id) {
        this.loadingData = true
        personasResource
        .destroy(id)
        .then((response) => {
          const {state, message} = response
          this.$message({
            type: state,
            message
          })
          this.loadingData = false
          this.handleSearch()
        })
        .catch(() => {
          this.loadingData = false
        })
      },
      handleClose(done) {
        ElMessageBox.confirm('¡Seguro que desea cerrar esta ventana?')
          .then(() => {
            done()
          })
          .catch(() => {
            // catch error
          })
      },
      handleEmitPropietario(objPersona) {
        // console.log(objPersona)
        this.$emit('childEmitPersona', objPersona)
      }
    }
  }
</script>
  