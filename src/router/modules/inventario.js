import AdminLayout from "@/layouts/adminLayout/adminLayout.vue";

const pruebasRoutes = {
  path: "/inventario",
  component: AdminLayout,
  redirect: "/inventario",
  name: "Inventario",
  meta: {
    title: "Inventario",
    icon: "md-inventory-outlined",
    main: true, // para indicar que es la ruta principal del modulo
  },
  children: [
    {
      path: "/inventario",
      component: () => import("@/views/inventario/inventarios/InventariosView.vue"),
      name: "InventarioInventario",
      meta: { title: "Inventario", icon: "md-inventory-outlined" },
    },
    {
      path: "/asignaciones",
      component: () => import("@/views/inventario/inventarios/AsignacionesView.vue"),
      name: "AsignacionesInventario",
      meta: { title: "Asignaciones", icon: "md-inventory-outlined" },
    },
  ],
};

export default pruebasRoutes;
