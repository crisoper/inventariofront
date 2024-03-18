import AdminLayout from '@/layouts/adminLayout/adminLayout.vue'


const pruebasRoutes = {
    path: '/pruebas',
    component: AdminLayout,
    redirect: '/tareas',
    name: 'Pruebas',
    meta: {
      title: 'Pruebas',
      icon: 'hi-identification',
      main: true, // para indicar que es la ruta principal del modulo
    },
    children: [
      {
        path: '/tareas',
        component: () => import('@/views/prueba/TareasView.vue'),
        name: 'Tareas',
        meta: { title: 'Tareas', icon: 'md-playlistaddcheck-round' }
      },
    ]
  }
  
  export default pruebasRoutes