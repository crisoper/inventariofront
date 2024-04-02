<template>
  <el-card shadow="never">
    <el-row :gutter="10" type="flex" justify="end" class="my-3">
      <el-col :xs="24" :sm="24" :md="24" class="actions-component">
        <el-input
          v-model="query.keyBuscar"
          placeholder="Buscar por nombre"
          @change="getList"
          :clearable="true"
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
    <el-table v-loading="loading" border :data="tableData" style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="80"
        align="center"
        header-align="center"
      />
      <el-table-column label="CÓDIGO" prop="codigo" width="100" />
      <el-table-column label="NOMBRE" min-width="140">
        <template #default="scope">
          {{ scope.row.nombre }}
          <br />
          <span class="small text-muted">{{ scope.row.descripcion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="INICIO" prop="fecha_inicio_es" width="110" />
      <el-table-column label="FIN" prop="fecha_fin_es" width="110" />
      <el-table-column label="ESTADO" prop="estado" width="100" />
      <el-table-column fixed="right" align="center" width="140">
        <template #header>
          <el-button
            type="primary"
            plain
            @click="addItem()"
            v-permission="['inventario.inventarios.crear']"
          >
            <template #icon>
              <v-icon name="ri-add-fill" />
            </template>
          </el-button>
          <el-button
            type="primary"
            plain
            @click="exportarDatos()"
            v-permission="['inventario.inventarios.exportar']"
          >
            <template #icon>
              <v-icon name="la-database-solid" />
            </template>
          </el-button>
        </template>
        <template #default="scope">
          <div>
            <el-icon
              @click="verDetalle(scope.row)"
              color="#409EFC"
              size="18px"
              class="icon-btn pointer"
              title="Detalle"
            >
              <List />
            </el-icon>
            <el-icon
              @click="editItem(scope.row)"
              color="#409EFC"
              size="18px"
              class="icon-btn pointer"
              title="Editar"
            >
              <Edit />
            </el-icon>
            <el-icon
              v-if="scope.row.eliminable"
              @click="deleteItem(scope.row)"
              color="#f9616d"
              size="18px"
              class="icon-btn pointer"
              title="Eliminar"
            >
              <Delete />
            </el-icon>
            <el-icon
              @click="exportarInventario(scope.row.id)"
              color="#67C23A"
              size="18px"
              class="icon-btn pointer"
              title="Exportar a Excel"
            >
              <List />
            </el-icon>
          </div>
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
      :width="calcularAnchoDialog('80%', '90%')"
      top="5vh"
      :before-close="handleClose"
    >
      <template #header>
        <h2>{{ titleForm }}</h2>
      </template>
      <FormInventario
        ref="formFormInventario"
        :itemid="item_id"
        @closeChild="handleCloseCreate($event)"
      />
    </el-dialog>
    <el-dialog
      v-model="dialogoDetalleInventario"
      :fullscreen="true"
      :before-close="handleCloseDetalle"
    >
      <template #header>
        <h2>{{ titleDialogoDetalleInventario }}</h2>
      </template>
      <InventarioLayoutDetalle
        ref="refInventarioLayoutDetalle"
        :inventarioid="inventario_id"
        @closeChild="closeInventarioLayoutDetalle($event)"
      />
    </el-dialog>
  </el-card>
</template>

<script>
// import axios from "axios";
import { Edit, List, Delete } from "@element-plus/icons-vue";
import Resource from "@/api/resource";
import { ElMessageBox, ElNotification } from "element-plus";
import { calcularAnchoDialog } from "@/utils/responsive";
import FormInventario from "@/components/shared/app/inventario/inventarios/InventarioForm.vue";
import InventarioLayoutDetalle from "@/components/shared/app/inventario/inventarios/InventarioLayoutDetalle.vue";
const userRequest = new Resource("inventario/inventarios");

const exportResource = new Resource("exportar/inventario");

// export default exportResource;
export default {
  name: "UsersView",
  components: {
    FormInventario,
    InventarioLayoutDetalle,
    Edit,
    List,
    Delete,
  },
  data() {
    return {
      openDialog: false,
      openDialogEdit: false,
      loading: false,
      tableData: [],
      total: 0,
      item_id: "action",
      inventario_id: -17,
      query: {
        keyBuscar: "",
        limit: 7,
        page: 1,
      },
      dialogoDetalleInventario: false,
      idItemToEdit: "",
      calcularAnchoDialog,
      titleForm: "Agregar registro",
      titleDialogoDetalleInventario: "",
    };
  },
  computed: {},
  mounted() {
    this.getList();
  },
  created() {},
  methods: {
    getList() {
      this.loading = true;
      this.query.page = 1;
      userRequest
        .list(this.query)
        .then((response) => {
          const { data, meta } = response;
          this.tableData = data;
          this.total = meta.total;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    handleCloseCreate(status) {
      console.log(status);
      this.openDialog = false;
      if (status == "success") {
        this.getList();
      }
      this.$nextTick(() => {
        this.item_id = "action";
      });
    },
    addItem() {
      this.titleForm = "Agregar registro";
      this.openDialog = true;
      this.$nextTick(() => {
        this.item_id = "create";
      });
    },
    editItem(item) {
      this.titleForm = "Modificar registro";
      this.openDialog = true;
      this.$nextTick(() => {
        this.item_id = item.id;
      });
    },
    deleteItem(item) {
      console.log(item);
      ElMessageBox.confirm(
        "¿Está seguro que desea eliminar el usuario?",
        "Eliminar usuario",
        {
          confirmButtonText: "Sí",
          cancelButtonText: "Cancelar",
          type: "warning",
        }
      )
        .then(() => {
          userRequest
            .destroy(item)
            .then((response) => {
              ElNotification({
                title: "Usuario eliminado",
                type: "success",
                duration: 2000,
              });
              console.log(response);
              this.getList();
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleClose(done) {
      this.$nextTick(() => {
        this.item_id = "action";
      });
      done();
    },
    handleCloseDetalle(done) {
      this.$nextTick(() => {
        this.inventario_id = "action";
      });
      done();
    },
    exportarDatos() {
      this.loading = true;
      userRequest
        .exportar()
        .then((response) => {
          this.loading = false;
          const link = document.createElement("a");
          link.href = response;
          document.body.appendChild(link);
          link.click();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    verDetalle(model) {
      // console.log(model)
      this.titleDialogoDetalleInventario = model.nombre;
      this.dialogoDetalleInventario = true;
      this.$nextTick(() => {
        this.inventario_id = model.id;
        this.$refs["refInventarioLayoutDetalle"].activeName = "first";
      });
    },
    closeInventarioLayoutDetalle() {
      this.dialogoDetalleInventario = false;
      this.$nextTick(() => {
        this.inventario_id = "action";
      });
    },
    async exportarInventario(id) {
      console.log(id);
      this.loadingData = true;
      await exportResource
        .list({ id })
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
