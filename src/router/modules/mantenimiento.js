import AdminLayout from '@/layouts/adminLayout/adminLayout.vue'


const mantenimientoRoutes = {
    path: '/mantenimiento',
    component: AdminLayout,
    redirect: '/mantenimiento',
    name: 'Mantenimiento',
    meta: {
      title: 'Mantenimiento',
      icon: 'io-settings-sharp',
      main: true, // para indicar que es la ruta principal del modulo
    },
    children: [
      {
        path: '/almacen',
        component: () => import('@/views/mantenimiento/AlmacenView.vue'),
        name: 'Almacen',
        meta: { title: 'Almacenes', icon: 'fa-warehouse' }
      },
      {
        path: '/areas',
        component: () => import('@/views/mantenimiento/AreaView.vue'),
        name: 'Áreas',
        meta: { title: 'Áreas', icon: 'bi-person-workspace' }
      },
      {
        path: '/Ubicaciones',
        component: () => import('@/views/mantenimiento/UbicacionView.vue'),
        name: 'Ubicaciones',
        meta: { title: 'Ubicaciones', icon: 'md-category-round' }
      },
      {
        path: '/categorias',
        component: () => import('@/views/mantenimiento/CategoriaView.vue'),
        name: 'Categorias',
        meta: { title: 'Categorías', icon: 'md-category-round' }
      },
      {
        path: '/marcas',
        component: () => import('@/views/mantenimiento/MarcaView.vue'),
        name: 'Marcas',
        meta: { title: 'Marcas', icon: 'md-category-round' }
      },
      {
        path: '/productoestados',
        component: () => import('@/views/mantenimiento/ProductoEstadoView.vue'),
        name: 'ProductoEstado',
        meta: { title: 'Estados', icon: 'md-category-round' }
      },
      {
        path: '/tipo_activos',
        component: () => import('@/views/mantenimiento/TipoActivoView.vue'),
        name: 'tipo_activos',
        meta: { title: 'Tipo activos', icon: 'md-category-round' }
      },
      {
        path: '/tipo_bienes',
        component: () => import('@/views/mantenimiento/TipoBienView.vue'),
        name: 'tipo_bienes',
        meta: { title: 'Tipo bienes', icon: 'md-category-round' }
      },
      {
        path: '/tipo_ingresos',
        component: () => import('@/views/mantenimiento/TipoDeIngresosView.vue'),
        name: 'tipo_ingresos',
        meta: { title: 'Tipo de Ingresos', icon: 'md-category-round' }
      },
      {
        path: '/fuente_financiamiento',
        component: () => import('@/views/mantenimiento/FuenteFinanciamientoView.vue'),
        name: 'fuente_financiamiento',
        meta: { title: 'Fuente financiamiento', icon: 'md-category-round' }
      },
      {
        path: '/personas',
        component: () => import('@/views/mantenimiento/personas/PersonasView.vue'),
        name: 'Personas',
        meta: { title: 'Personas', icon: 'bi-people-fill' }
      },
      {
        path: '/productos',
        component: () => import('@/views/mantenimiento/ProductosView.vue'),
        name: 'MantenimientoProductos',
        meta: { title: 'Productos', icon: 'co-product-hunt' }
      },
      
    ]
    
  }
  
  export default mantenimientoRoutes