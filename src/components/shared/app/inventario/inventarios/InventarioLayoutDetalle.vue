<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Productos en el inventario" name="first">
        <InventarioProductos />
      </el-tab-pane>
      <el-tab-pane label="Agregar al inventario" name="second">
        <InventarioInventariar />
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
    inventario_id: {
      type: String,
      default: () => {
        return "-2000000";
      },
    },
  },
  data() {
    return {
      activeName: 'first'
    };
  },
  watch: {
    itemid: function () {
      this.setCrearOUpdate();
    },
  },
  computed: {},
  created() {},
  methods: {
    handleClick(data) {
      console.log(data)
    }
  },
};
</script>
