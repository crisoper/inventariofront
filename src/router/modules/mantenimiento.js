import AdminLayout from '@/layouts/adminLayout/adminLayout.vue'


const mantenimientoRoutes = {
    path: '/mantenimiento',
    component: AdminLayout,
    redirect: '/mantenimiento',
    name: 'Mantenimiento',
    meta: {
      title: 'Mantenimiento',
      icon: 'hi-identification',
      main: true, // para indicar que es la ruta principal del modulo
    },
    children: [
      {
        path: '/almacen',
        component: () => import('@/views/mantenimiento/AlmacenView.vue'),
        name: 'Almacen',
        meta: { title: 'Almacenes', icon: 'md-playlistaddcheck-round' }
      },
      {
        path: '/areas',
        component: () => import('@/views/mantenimiento/AreaView.vue'),
        name: 'Areas',
        meta: { title: 'Areas', icon: 'md-playlistaddcheck-round' }
      },
      {
        path: '/categorias',
        component: () => import('@/views/mantenimiento/CategoriaView.vue'),
        name: 'Categorias',
        meta: { title: 'Categorías', icon: 'md-playlistaddcheck-round' }
      },
      {
        path: '/marcas',
        component: () => import('@/views/mantenimiento/MarcaView.vue'),
        name: 'Marcas',
        meta: { title: 'Marcas', icon: 'md-playlistaddcheck-round' }
      },
      {
        path: '/tipo_activos',
        component: () => import('@/views/mantenimiento/TipoActivoView.vue'),
        name: 'tipo_activos',
        meta: { title: 'tipo_activos', icon: 'md-playlistaddcheck-round' }
      },
      {
        path: '/tipo_bienes',
        component: () => import('@/views/mantenimiento/TipoBienView.vue'),
        name: 'tipo_bienes',
        meta: { title: 'tipo_bienes', icon: 'md-playlistaddcheck-round' }
      },
      {
        path: '/productos',
        component: () => import('@/views/mantenimiento/ProductosView.vue'),
        name: 'MantenimientoProductos',
        meta: { title: 'Productos', icon: 'md-playlistaddcheck-round' }
      },
    ]
    
  }
  
  export default mantenimientoRoutes