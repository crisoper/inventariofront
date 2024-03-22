<template>
  <el-form
    ref="formRefUser"
    :model="modelForm"
    :rules="reglasValidacion"
    label-width="120px"
    class="demo-form"
    label-position="top"
  >
    <div v-loading="loadingData" class="p-3">
      <el-card class="box-card" shadow="never">
        <el-row :gutter="12">
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item
              label="Nombre"
              prop="Nombre"
            >
              <el-input
                v-model="modelForm.nombre"
                style="width: 100%"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item
              label="Descripción"
              prop="descripcion"
            >
              <el-input
                v-model="modelForm.descripcion"
                style="width: 100%"
                :rows="2"
                type="textarea"
                placeholder="Descripción"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="Fecha inicio" prop="fecha_inicio">
              <el-date-picker
                v-model="modelForm.fecha_inicio"
                type="date"
                placeholder="Fecha inicio"
                value-format="YYYY-MM-DD"
                format="DD-MM-YYYY"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="Fecha fin" prop="fecha_fin">
              <el-date-picker
                v-model="modelForm.fecha_fin"
                type="date"
                placeholder="Fecha fin"
                value-format="YYYY-MM-DD"
                format="DD-MM-YYYY"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item
              label="Estado"
              prop="cerrado"
            >
              <el-switch
                v-model="modelForm.cerrado"
                active-text="Cerrado"
                inactive-text="Abierto"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
    <el-dialog
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
    </el-dialog>
  </el-form>
</template>

<script>
import { ElNotification } from "element-plus";
import RoleRequest from "@/api/auth/role";
import formBuscarPersona from "@/components/shared/app/personas/listabuscarnatural.vue";
import Resource from "@/api/resource";
const roleRequest = new RoleRequest();
const userRequest = new Resource('inventario/inventarios');
export default {
  name: "FormUser",
  components: {
    formBuscarPersona,
  },
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
      loadingData: false,
      createUserForm: "",
      tiposDocIdentidad: [],
      roles: [],
      dialogBuscarPersona: false,
      modelForm: {
        id: undefined,
        codigo: undefined,
        nombre: 'Nombre autogenerado',
        descripcion: undefined,
        periodo: undefined,
        fecha_inicio: undefined,
        fecha_fin: undefined,
        cerrado: false,
      },
      reglasValidacion: {
        descripcion: [
          { required: true, message: "Campo requerido", trigger: "blur" },
        ],
        fecha_inicio: [
          { required: true, message: "Campo requerido", trigger: "blur" },
        ],
        cerrado: [
          { required: true, message: "Campo requerido", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    itemid: function () {
      this.setCrearOUpdate();
    },
  },
  computed: {},
  created() {
    this.fetchRoles();
  },
  methods: {
    async fetchRoles() {
      await roleRequest
        .all()
        .then((response) => {
          console.log(response);
          this.roles = response.data;
        })
        .catch((error) => {
          console.log(error);
          ElNotification({
            type: "error",
            title: "Error al precargar data del formulario",
            duration: 2000,
          });
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
    getDataUpdate() {
      // this.$refs['inputFocusCreate'].focus()
      this.resetModel();
      this.loadingData = true;
      userRequest
        .get(this.item_id)
        .then((response) => {
          const { data } = response;
          this.modelForm = { ...data };
          this.loadingData = false;
        })
        .catch(() => {
          this.loadingData = false;
        });
    },
    submitForm() {
      this.$refs["formRefUser"].validate((valid) => {
        if (valid) {
          if (this.modelForm.id === undefined) {
            this.saveCreateNewForm();
          } else {
            this.saveEditForm();
          }
        } else {
          return false;
        }
      });
    },
    saveCreateNewForm() {
      this.loadingData = true;
      userRequest
        .store(this.modelForm)
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
    saveEditForm() {
      this.loadingData = true;
      userRequest
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
        nombre: 'Nombre autogenerado',
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
  },
};
</script>
