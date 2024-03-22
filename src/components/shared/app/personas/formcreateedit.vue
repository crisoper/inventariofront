<template>
    <el-form
      ref="formRefPersona"
      :model="modelPersona"
      :rules="reglasValidacion"
      label-width="120px"
      class="demo-form"
      label-position="top"
    >
      <div v-loading="loadingData" class="p-3">
        <!-- :size="formSize" -->
        <el-row :gutter="12">
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="Tipo documentos" prop="id_tipo_doc_identidad">
              <el-select ref="inputFocusCreate" v-model="modelPersona.id_tipo_doc_identidad" clearable filterable placeholder="Seleccionar" style="width: 180%">
                <el-option
                v-for="item in lProvincias"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="Nro documento" prop="nro_doc_identidad">
              <el-input v-model="modelPersona.nro_doc_identidad" placeholder="Nro documento" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="Apellido paterno" prop="apellido_paterno">
              <el-input v-model="modelPersona.apellido_paterno" placeholder="Apellido paterno" @input="modelPersona.apellido_paterno = modelPersona.apellido_paterno.toUpperCase()" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="Apellido materno" prop="apellido_materno">
              <el-input v-model="modelPersona.apellido_materno" placeholder="Apellido materno" @input="modelPersona.apellido_materno = modelPersona.apellido_materno.toUpperCase()" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="Nombres" prop="nombres">
              <el-input v-model="modelPersona.nombres" placeholder="Nombres" @input="modelPersona.nombres = modelPersona.nombres.toUpperCase()" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="Fecha nacimiento" prop="fecha_nacimiento">
              <el-date-picker
                v-model="modelPersona.fecha_nacimiento"
                type="date"
                placeholder="Seleccionar"
                format="DD-MM-YYYY"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="Género" prop="genero">
              <el-select v-model="modelPersona.genero" clearable filterable placeholder="Seleccionar" style="width: 180%">
                <el-option
                v-for="item in lGeneros"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="Celular" prop="celular">
              <el-input v-model="modelPersona.celular" placeholder="Celular" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-row type="flex" class="row-bg mt-3" justify="end">
          <el-button v-if="modelPersona.id === undefined" @click="resetForm('formRefPersona')">Cancelar</el-button>
          <el-button type="primary" @click="submitForm('formRefPersona')">
            {{ modelPersona.id === undefined ? 'Guardar' : 'Actualizar' }}
          </el-button>
        </el-row>
      </div>
    </el-form>
  </template>
  
  <script>
  import Resource from '@/api/resource'
  const PERSONASResource = new Resource('maestros/personas')
  const lTipoDocIdentidadResource = new Resource('tipodocidentidadall')
  
  export default {
    name: 'FormDepartamento',
    components: {},
    props: {
      itemid: {
        type: String,
        default: () => {
          return '-2000000'
        }
      }
    },
    data() {
      return {
        lProvincias: [],
        lGeneros: [
          { value: 'MASCULINO', label: 'MASCULINO' },
          { value: 'FEMENINO', label: 'FEMENINO' },
        ],
        item_id: 0,
        selectSearch: '',
        editedItem: { id: 0, name: '' },
        dialogVisible: false,
        loadingData: false,
        modelPersona: {
          id: undefined,
          apellido_paterno: '',
          apellido_materno: '',
          nombres: '',
          nro_doc_identidad: '',
          fecha_nacimiento: '',
          genero: '',
          celular: '',
          id_tipo_doc_identidad: '',
        },
        reglasValidacion: {
          apellido_paterno: [ { required: true, trigger: 'blur', message: 'Campo requerido' }],
          apellido_materno: [ { required: true, trigger: 'blur', message: 'Campo requerido' }],
          nombres: [ { required: true, trigger: 'blur', message: 'Campo requerido' }],
          nro_doc_identidad: [ { required: true, trigger: 'blur', message: 'Campo requerido' }],
          fecha_nacimiento: [ { required: true, trigger: 'blur', message: 'Campo requerido' }],
          genero: [ { required: true, trigger: 'blur', message: 'Campo requerido' }],
          celular: [ { required: true, trigger: 'blur', message: 'Campo requerido' }],
          id_tipo_doc_identidad: [ { required: true, trigger: 'blur', message: 'Campo requerido' }],
        }
      }
    },
    watch: {
      itemid: function() {
        this.setCrearOUpdate()
      }
    },
    computed: {},
    created() {
      this.getProvincias()
    },
    methods: {
      async getProvincias() {
        this.loadingData = true
        await lTipoDocIdentidadResource.list(this.listQuery)
        .then((response) => {
          const { data } = response
          this.lProvincias = data
          this.loadingData = false
        })
        .catch(() => {
          this.loadingData = false
        })
      },
      setCrearOUpdate() {
        this.$nextTick(() => {
          if (this.itemid !== 'create' && this.itemid !== 'action') {
            this.item_id = this.itemid
            this.getDataUpdate()
          } else {
            if (this.itemid === 'create') {
              this.item_id = undefined
              this.handleCreate()
            }
          }
          console.log(this.item_id)
          this.resetForm('formRefPersona')
          this.resetModel()
        })
      },
      handleCreate() {
        console.log('Open form create, set focus')
        this.$refs['inputFocusCreate'].focus()
      },
      getDataUpdate() {
        this.$refs['inputFocusCreate'].focus()
        this.resetModel()
        this.loadingData = true
        PERSONASResource
        .get(this.item_id)
        .then((response) => {
          const { data } = response
          this.modelPersona = {...data}
          this.loadingData = false
        })
        .catch(() => {
          this.loadingData = false
        })
      },
      submitForm(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.modelPersona.id === undefined) {
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
        PERSONASResource
          .store(this.modelPersona)
          .then((response) => {
            const {state, message} = response
            this.$message({
              type: state,
              message
            })
            this.loadingData = false
            this.handleEmitDataToParent(state)
          })
          .catch(() => {
            this.loadingData = false
          })
      },
      saveEditForm() {
        this.loadingData = true
        PERSONASResource
          .update(this.item_id, this.modelPersona)
          .then((response) => {
            const {state, message} = response
            this.$message({
              type: state,
              message
            })
            this.loadingData = false
            this.handleEmitDataToParent('success')
          })
          .catch(() => {
            this.loadingData = false
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      resetModel() {
        this.modelPersona = {
          id: this.itemid === 'create' ? undefined : this.itemid,
          apellido_paterno: '',
          apellido_materno: '',
          nombres: '',
          nro_doc_identidad: '',
          fecha_nacimiento: '',
          genero: '',
          celular: '',
          id_tipo_doc_identidad: '',
        }
      },
      handleEmitDataToParent(state) {
        this.$emit('emitFromChild', state)
      }
    }
  }
  </script>
  