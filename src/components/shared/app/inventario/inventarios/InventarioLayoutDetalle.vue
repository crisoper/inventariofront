<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Productos en el inventario" name="first">
        <InventarioProductos
          :inventarioid="inventario_id"
          @close="inventarioClose($event)"
        />
      </el-tab-pane>
      <el-tab-pane label="Agregar al inventario" name="second">
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
        // if (this.inventarioid !== "action" && this.inventarioid !== "create") {
        //   this.getDataUpdate()
        // } else {
        //   this.item_id = undefined
        //   this.handleCreate()
        // }
        // this.resetForm("formAdditem")
        // this.resetModel()
      })
    },
    handleClick(data) {
      console.log(data.props.name)
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
