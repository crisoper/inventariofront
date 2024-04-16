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
  </el-form>
</template>

<script>
import Resource from "@/api/resource"
const inventarioRequest = new Resource('inventario/inventarios')
export default {
  name: "FormUser",
  components: {},
  props: {
    itemid: {
      type: String,
      default: () => {
        return "-2000000"
      },
    },
  },
  data() {
    return {
      loadingData: false,
      createUserForm: "",
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
    }
  },
  watch: {
    itemid: function () {
      this.setCrearOUpdate()
    },
  },
  computed: {},
  created() {},
  methods: {
    setCrearOUpdate() {
      console.log("Create User" + this.itemid)
      this.$nextTick(() => {
        if (this.itemid !== "action" && this.itemid !== "create") {
          this.item_id = this.itemid
          this.getDataUpdate()
        } else {
          this.item_id = undefined
          this.handleCreate()
        }
        this.resetForm("formRefUser")
        this.resetModel()
      })
    },
    handleCreate() {
      console.log("Open form create, set focus")
      // this.$refs['inputFocusCreate'].focus()
    },
    getDataUpdate() {
      // this.$refs['inputFocusCreate'].focus()
      this.resetModel()
      this.loadingData = true
      inventarioRequest
        .get(this.item_id)
        .then((response) => {
          const { data } = response
          this.modelForm = { ...data }
          this.loadingData = false
          console.log(this.modelForm)
        })
        .catch(() => {
          this.loadingData = false
        })
    },
    submitForm() {
      this.$refs["formRefUser"].validate((valid) => {
        if (valid) {
          if (this.modelForm.id === undefined) {
            this.saveCreateNewForm()
          } else {
            this.saveEditForm()
          }
        } else {
          return false
        }
      })
    },
    saveCreateNewForm() {
      this.loadingData = true
      inventarioRequest
        .store(this.modelForm)
        .then((response) => {
          const { state, message } = response
          this.$message({
            type: state,
            message,
          })
          this.loadingData = false
          this.close("success")
        })
        .catch(() => {
          this.loadingData = false
        })
    },
    saveEditForm() {
      this.loadingData = true
      inventarioRequest
        .update(this.item_id, this.modelForm)
        .then((response) => {
          const { state, message } = response
          this.$message({
            type: state,
            message,
          })
          this.loadingData = false
          this.close("success")
        })
        .catch(() => {
          this.loadingData = false
        })
    },
    close(status) {
      if (this.createUserForm) {
        this.createUserForm.resetFields()
      }
      this.$emit("closeChild", status)
    },
    searchAsociacion() {
      this.dialogBuscarPersona = true
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
      }
    },
  },
}
</script>
