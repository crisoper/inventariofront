import AdminLayout from "@/layouts/adminLayout/adminLayout.vue";

const pruebasRoutes = {
  path: "/inventario",
  component: AdminLayout,
  redirect: "/productos",
  name: "Inventario",
  meta: {
    title: "Inventario",
    icon: "md-inventory-outlined",
    main: true, // para indicar que es la ruta principal del modulo
  },
  children: [
    // {
    //   path: "/productos",
    //   component: () => import("@/views/inventario/productos/ProductosView.vue"),
    //   name: "InventarioProductos",
    //   meta: { title: "Productos", icon: "md-playlistaddcheck-round" },
    // },
    {
      path: "/inventario",
      component: () => import("@/views/inventario/inventarios/InventariosView.vue"),
      name: "InventarioInventario",
      meta: { title: "Inventario", icon: "md-inventory-outlined" },
    },
  ],
};

export default pruebasRoutes;
