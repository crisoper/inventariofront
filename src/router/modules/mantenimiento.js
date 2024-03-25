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
        path: '/tipo_activos',
        component: () => import('@/views/mantenimiento/TipoActivoView.vue'),
        name: 'tipo_activos',
        meta: { title: 'tipo_activos', icon: 'md-category-round' }
      },
      {
        path: '/tipo_bienes',
        component: () => import('@/views/mantenimiento/TipoBienView.vue'),
        name: 'tipo_bienes',
        meta: { title: 'tipo_bienes', icon: 'md-category-round' }
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