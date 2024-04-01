<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Productos en el inventario" name="first">
        <InventarioProductos
          ref="InventarioProductosRef"
          :inventarioid="inventario_id"
          @close="inventarioClose($event)"
        />
      </el-tab-pane>
      <el-tab-pane v-if="!inventarioModel?.cerrado" label="Agregar al inventario" name="second">
        <InventarioInventariar
          :inventarioid="inventario_id"
          @close="inventariarClose($event)"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InventarioInventariar from "@/components/shared/app/inventario/inventarios/InventarioInventariar.vue";
import InventarioProductos from "@/components/shared/app/inventario/inventarios/InventarioProductos.vue";
import Resource from "@/api/resource"
const inventarioResource = new Resource("inventario/inventarios")

export default {
  name: "FormUser",
  components: {
    InventarioInventariar,
    InventarioProductos
  },
  props: {
    inventarioid: {
      type: Number,
      required: true,
      default: () => {
        return -10;
      },
    },
  },
  data() {
    return {
      activeName: 'first',
      inventario_id: 0,
      inventarioModel: {}
    };
  },
  watch: {
    inventarioid: function () {
      this.setCrearOUpdate();
    },
  },
  computed: {},
  created() {
    this.activeName = 'first'
  },
  mounted() {
    this.activeName = 'first'
  },
  methods: {
    setCrearOUpdate() {
      console.log("Inventariar inventarioid: " + this.inventarioid)
      this.$nextTick(() => {
        this.inventario_id = this.inventarioid
        if (this.inventario_id > 0) {
          this.getDataInventario()
        } else {
          this.$emit("closeChild", {})
        }
      })
    },
    handleClick(data) {
      if (data?.props?.name === 'first') {
        this.loadDataInventarioProductos()
      }
    },
    getDataInventario() {
      inventarioResource
        .get(this.inventario_id)
        .then((response) => {
          const { data } = response
          this.inventarioModel = { ...data }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    loadDataInventarioProductos() {
      this.$nextTick(() => {
        if (this.$refs.InventarioProductosRef) {
          this.$refs.InventarioProductosRef.loadData();
        } else {
          console.log('No existe InventarioProductosRef')
        }
      });
    },
    inventarioClose(data) {
      console.log(data)
    },
    inventariarClose(data) {
      console.log(data)
    }
  },
};
</script>
