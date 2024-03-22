<template>
    <el-card shadow="never">
      <el-row :gutter="10" type="flex" justify="end" class="my-3">
        <el-col :xs="24" :sm="24" :md="24" class="actions-component">
          <el-input
            v-model="query.keyword"
            placeholder="Buscar por nombre"
            @change="getList"
          >
            <template #append>
              <el-button @click="getList">
                <template #icon>
                  <v-icon :name="'bi-search'" />
                </template>
              </el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-table v-loading="loading" border :data="tableData" style="width: 100%" >
        <el-table-column type="index" label="#" width="100" align="center" header-align="center" />
        <el-table-column label="DOC. IDENTIDAD" width="140">
          <template #default="scope">
            {{ scope.row.persona?.nro_doc_identidad }}
          </template>
        </el-table-column>
        <el-table-column label="NOMBRE" min-width="160">
          <template #default="scope">
            {{ scope.row.persona?.nombre_completo }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="CORREO" min-width="160" />
        <el-table-column fixed="right" align="center" width="140" >
          <template #header>
            <el-button type="primary" plain @click="addItem()" v-permission="['auth.usuarios.crear']">
              <template #icon>
                <v-icon name="ri-add-fill" />
              </template>
            </el-button>
            <el-button type="primary" plain @click="exportarDatos()" v-permission="['auth.usuarios.exportar']">
              <template #icon>
                <v-icon name="la-database-solid" />
              </template>
            </el-button>
          </template>
          <template #default="scope">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                Opciones
                <v-icon name="fa-caret-down" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="{ item: scope.row, action: 'EDIT' }">
                    <span>
                      <v-icon name="md-edit-round" style="margin-right: 10px" />
                      Editar
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="{ item: scope.row, action: 'DELETE' }">
                    <span>
                      <v-icon name="md-delete" style="margin-right: 10px" />
                      Eliminar
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
          @size-change="getList"
          @current-change="getList"
        />
      </el-row>
      <el-dialog
        v-model="openDialog"
        :width="calcularAnchoDialog('80%','90%')"
        top="5vh"
        :before-close="handleClose"
      >
        <template #header>
          <h2>{{ titleForm }}</h2>
        </template>
        <FormProducto
          ref="formFormProducto"
          :itemid="item_id"
          @closeChild="handleCloseCreate($event)"
        />
      </el-dialog>
    </el-card>
  </template>
  
  <script>
  import UserRequest from '@/api/auth/usuario'
  import { ElMessageBox, ElNotification } from 'element-plus'
  import { calcularAnchoDialog } from '@/utils/responsive'
  import FormProducto from '@/components/shared/app/inventario/productos/ProductoForm.vue'
  import { useAuthStore } from "@/stores/auth";
  
  const userRequest = new UserRequest()
  const authStore = useAuthStore()
  const validPermision = authStore.validPermision
  
  export default {
    name: 'UsersView',
    components: {
      FormProducto
    },
    data() {
      return {
        openDialog: false,
        openDialogEdit: false,
        loading: false,
        tableData: [],
        total: 0,
        item_id: 'action',
        query: {
          keyword: '',
          limit: 7,
          page: 1
        },
        idItemToEdit: '',
        calcularAnchoDialog,
        titleForm: 'Agregar registro'
      }
    },
    computed: {},
    mounted() {
      this.getList()
    },
    created() {},
    methods: {
      getList() {
        this.loading = true
        this.query.page = 1
        userRequest
          .list(this.query)
          .then((response) => {
            const { data, meta } = response
            this.tableData = data
            this.total = meta.total
            this.loading = false
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
          })
      },
      handleCloseCreate(status) {
        console.log(status)
        this.openDialog = false
        if (status == 'success') {
          this.getList()
        }
        this.$nextTick(() => {
          this.item_id = 'action'
        })
      },
      handleCloseEdit(status) {
        if (status == 'success') this.getList()
        this.openDialogEdit = false
        this.idItemToEdit = ''
      },
      handleCommand(commandData) {
        const { item, action } = commandData
        console.log(item, action)
        if (action == 'EDIT' && validPermision('auth.usuarios.actualizar')) {
          this.editItem(item)
        } else if (action == 'DELETE' && validPermision('auth.usuarios.eliminar')) {
          ElMessageBox.confirm('¿Está seguro que desea eliminar el usuario?', 'Eliminar usuario', {
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
            type: 'warning'
          })
            .then(() => {
              userRequest
                .destroy(item)
                .then((response) => {
                  ElNotification({
                    title: 'Usuario eliminado',
                    type: 'success',
                    duration: 2000
                  })
                  console.log(response)
                  this.getList()
                })
                .catch((error) => console.log(error))
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          ElNotification({
            message: 'Usted no tiene permiso para realizar esta acción',
            type: 'info'
          })
        }
      },
      addItem() {
        this.titleForm = 'Agregar registro'
        this.openDialog = true
        this.$nextTick(() => {
          this.item_id = 'create'
        })
      },
      editItem(item) {
        this.titleForm = 'Modificar registro'
        this.openDialog = true;
        this.$nextTick(() => {
          this.item_id = item.id
        })
      },
      handleClose(done) {
        this.$nextTick(() => {
          this.item_id = 'action'
        })
        done()
      },
      exportarDatos() {
        this.loading = true
        userRequest
          .exportar()
          .then((response) => {
            this.loading = false
            const link = document.createElement('a')
            link.href = response
            document.body.appendChild(link)
            link.click()
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
  </script>
  