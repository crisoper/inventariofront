<template>
  <el-form
    ref="formRefUser"
    :model="modelForm"
    :rules="reglasValidacionForm"
    label-width="120px"
    class="demo-form"
    label-position="top"
  >
    <div v-loading="loadingData" class="p-3">
      <el-card class="box-card" shadow="never">
        <el-row :gutter="12">
          <el-col :xs="24" :sm="24" :md="11">
            <el-form-item label="Area" prop="area_id">
              <el-select
                v-model="modelForm.area_id"
                placeholder="Seleccionar"
                style="width: 100%"
              >
                <el-option
                  v-for="area in lAreas"
                  :key="area.id"
                  :label="area.nombre"
                  :value="area.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="13">
            <el-form-item label="Producto" prop="descripcion">
              <template #label>
                <div style="display: flex; justify-content: space-between;">
                  <span>Producto</span>
                  <el-link @click="addProducto()" :icon="Plus" :underline="false">
                    <span class="text-muted">Nuevo</span>
                  </el-link>
                </div>
              </template>
              <div class="divSelectProducto">
                <el-select
                  v-model="modelForm.producto_id"
                  placeholder="Buscar código o nombre"
                  popper-class="selectProducto"
                  style="width: 100% !important"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  loading-text="Buscando..."
                  :loading="loadingIIEE"
                  :remote-method="getPructoPorNombre"
                  @clear="clearSelectProducto"
                  @change="changeSelectProducto"
                >
                  <el-option
                    v-for="item in listaInstitucionesEdu"
                    :key="item.id"
                    :label="item.codigo + ' - ' + item.nombre"
                    :value="item.id"
                  >
                    <div class="optionIIEE">
                      <p>{{ item.codigo }} - {{ item.nombre }}</p>
                      <p>{{ item.descripcion }}</p>
                      <p>
                        <small>Percy Crisólogo Bardales</small>
                      </p>
                      <p>
                        <small>Almacen</small>
                      </p>
                    </div>
                  </el-option>
                </el-select>
              </div>
              <el-button
                type="primary"
                plain
                :icon="Plus"
                @click="addProductoDetalle"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card mt-3" shadow="never">
        <el-table :data="detalleInventario" style="width: 100% !important">
          <el-table-column prop="area_id" label="Area" min-width="180">
          </el-table-column>
          <el-table-column prop="producto_id" label="Producto" min-width="180">
          </el-table-column>
        </el-table>
        <el-row type="flex" class="row-bg mt-4" justify="end">
          <el-button
            v-if="modelForm.id === undefined"
            @click="resetForm('formRefUser')"
            >Cancelar</el-button
          >
          <el-button type="primary" @click="submitForm('formRefUser')">
            {{ modelForm.id === undefined ? "Guardar" : "Actualizar" }}
          </el-button>
        </el-row>
      </el-card>
    </div>
    <!-- <el-dialog
      v-model="dialogBuscarPersona"
      title="Buscar persona"
      width="85%"
      top="7vh"
    >
      <div>
        <form-buscar-persona
          ref="modalBuscarPropietario"
          @childEmitPersona="parentProcessEmitPersona($event)"
        />
      </div>
    </el-dialog> -->
  </el-form>
</template>

<script>
import { Plus } from "@element-plus/icons-vue";
import Resource from "@/api/resource";
const areasResource = new Resource("inventario/all/areas");
const productosResource = new Resource("inventario/all/productos");
export default {
  name: "InventarioInventariarView",
  components: {},
  props: {
    itemid: {
      type: String,
      default: () => {
        return "-2000000";
      },
    },
  },
  data() {
    // const validatePasswordUpdate = (rule, value, callback) => {
    //   if (this.modelForm.id == undefined) {
    //     callback(new Error("El campo es requerido"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      Plus,
      loadingData: false,
      createUserForm: "",
      tiposDocIdentidad: [],
      lAreas: [],
      lProductos: [],
      loadingIIEE: false,
      listaInstitucionesEdu: [],
      dialogBuscarPersona: false,
      modelForm: {
        area_id: undefined,
        producto_id: undefined,
      },
      reglasValidacionForm: {
        area_id: [
          { required: true, message: "Campo requerido", trigger: "blur" },
        ],
        producto_id: [
          { required: true, message: "Campo requerido", trigger: "blur" },
        ],
      },
      detalleInventario: [],
    };
  },
  watch: {
    itemid: function () {
      this.setCrearOUpdate();
    },
  },
  computed: {},
  created() {},
  mounted() {
    this.getAllAreas();
  },
  methods: {
    async getAllAreas() {
      await areasResource
        .list({})
        .then((response) => {
          this.lAreas = response.data;
        })
        .catch((error) => {
          console.log(error);
          close("canceled");
        });
    },
    setCrearOUpdate() {
      console.log("Create User" + this.itemid);
      this.$nextTick(() => {
        if (this.itemid !== "action" && this.itemid !== "create") {
          this.item_id = this.itemid;
          this.getDataUpdate();
        } else {
          this.item_id = undefined;
          this.handleCreate();
        }
        this.resetForm("formRefUser");
        this.resetModel();
      });
    },
    handleCreate() {
      console.log("Open form create, set focus");
      // this.$refs['inputFocusCreate'].focus()
    },
    saveEditForm() {
      this.loadingData = true;
      areasResource
        .update(this.item_id, this.modelForm)
        .then((response) => {
          const { state, message } = response;
          this.$message({
            type: state,
            message,
          });
          this.loadingData = false;
          this.close("success");
        })
        .catch(() => {
          this.loadingData = false;
        });
    },
    close(status) {
      if (this.createUserForm) {
        this.createUserForm.resetFields();
      }
      this.$emit("closeChild", status);
    },
    searchAsociacion() {
      this.dialogBuscarPersona = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    resetModel() {
      this.modelForm = {
        id: this.itemid === "create" ? undefined : this.itemid,
        codigo: undefined,
        nombre: "Nombre autogenerado",
        descripcion: undefined,
        periodo: undefined,
        fecha_inicio: undefined,
        fecha_fin: undefined,
        cerrado: false,
      };
    },
    parentProcessEmitPersona(data) {
      console.log(data);
      this.modelForm.id_persona = data.id;
      this.modelForm.persona_nro_doc_identidad = data.nro_doc_identidad;
      this.modelForm.persona_nombre_completo = data.nombre_completo;
      this.modelForm.persona_email = data.email;
      this.modelForm.email = data.email;
      this.modelForm.password = data.nro_doc_identidad;
      this.dialogBuscarPersona = false;
      this.$refs["emailField"].focus();
    },
    async getPructoPorNombre(query) {
      this.listaInstitucionesEdu = [];
      await productosResource.list({ keybuscar: query }).then((response) => {
        const { data } = response;
        this.listaInstitucionesEdu = data;
      });
    },
    clearSelectProducto() {
      this.modelForm.producto_id = undefined;
    },
    changeSelectProducto() {
      this.addProductoDetalle();
    },
    addProductoDetalle() {
      this.detalleInventario.push({
        area_id: this.modelForm.area_id,
        producto_id: this.modelForm.producto_id
      })
      // console.log(this.detalleInventario)
    },
    addProducto() {
      console.log('Nuevo producto')
    }
  },
};
</script>
<style scoped>
.divSelectProducto {
  width: calc(100% - 50px);
}

.selectProducto .el-select-dropdown__item {
  padding-top: 6px !important;
  padding-bottom: 3px !important;
  height: 110px !important;
  line-height: 20px !important;
  border-bottom: 1px solid #dfe4ed !important;
}

.selectProducto p {
  padding-top: 1px !important;
  padding-bottom: 1px !important;
  margin-block-start: 2px !important;
  margin-block-end: 2px !important;
}
</style>
