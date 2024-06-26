import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import AdminLayout from '../layouts/adminLayout/adminLayout.vue'
import { useAuthStore } from '../stores/auth';
import getPageTitle from '../utils/get-page-title';
import { getToken } from '../utils/auth';
import authRoutes from './modules/auth';
import inventarioRoutes from './modules/inventario';
import mantenimientoRoutes from './modules/mantenimiento'

export const routes =  [
  {
    path: '/',
    redirect: '/signin',
    meta: {
      hidden: true,
      title: 'Enlaces Publicos',
      icon: 'md-spacedashboard'
    },
    children: [
      {                     
        path: 'signin',
        name: 'SignIn',
        hidden: true,
        component: () => import('@/views/auth/signInView.vue'),
        meta: { title: 'Login'}
      },
    ],
  },
  {
    path: "/dashboard",
    component: AdminLayout,
    name: 'Dashboard',
    redirect: '/dashboard/home',
    meta: {
      main:true,
      title: 'Panel',
      icon: 'md-spacedashboard'
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/dashboard/dashboardView.vue'),
        name: 'Panel',
        meta: {title: 'Panel de control', icon: 'md-spacedashboard'}
      }
    ],
  },
  {
    path: '/miperfil',
    component: AdminLayout,
    redirect: '/usuario',
    hidden: true,
    children: [
      {
        path: 'usuario',
        component: () => import('@/views/profile/index.vue'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
];
export const asyncRoutes = [
  authRoutes,
  mantenimientoRoutes,
  inventarioRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: "NotFound",
    component: () => import('@/views/error-pages/404.vue'),
    hidden: true,
  },
]


const initRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
const router = initRouter

export function resetRouter() {
  const newRouter = initRouter
  router.matcher = newRouter.matcher // reset router
}

const whiteList = ['/','/home','/about','/signin', '/404'] 

router.beforeEach(async (to, from, next) => {

  const authStore = useAuthStore();

  document.title = getPageTitle(to.meta.title)
  authStore.changePageCurrentInfo(to.meta)
    if(getToken()) {
      if(to.path == '/signin') {
        nextTick(() => {
         // Oculta el loader una vez que la app esté montada
         const loader = document.getElementById('page-loader')
         if (loader) {
           loader.style.display = 'none'
         }
       })
        next('/home');
      } else {
        if(authStore.getRoles && authStore.getRoles.length > 0) {
          nextTick(() => {
            // Oculta el loader una vez que la app esté montada
            const loader = document.getElementById('page-loader')
            if (loader) {
              loader.style.display = 'none'
            }
          })
          next();
        } else {
          try{
            const { roles ,permissions} = await authStore.userInfo();
            // generate accessible routes map based on roles
            await authStore.generateRoutes(roles, permissions)

            // dynamically add accessible routes
            // router.addRoutes(accessRoutes)
            nextTick(() => {
              // Oculta el loader una vez que la app esté montada
              const loader = document.getElementById('page-loader')
              if (loader) {
                loader.style.display = 'none'
              }
            })
            next({ ...to, replace: true })
          } catch(error) {
            console.log(error);
            nextTick(() => {
              // Oculta el loader una vez que la app esté montada
              const loader = document.getElementById('page-loader')
              if (loader) {
                loader.style.display = 'none'
              }
            })
            next(`/signin`);
          }
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        nextTick(() => {
          // Oculta el loader una vez que la app esté montada
          const loader = document.getElementById('page-loader')
          if (loader) {
            loader.style.display = 'none'
          }
        })
        next()
      } else {
        nextTick(() => {
          // Oculta el loader una vez que la app esté montada
          const loader = document.getElementById('page-loader')
          if (loader) {
            loader.style.display = 'none'
          }
        })
        next(`/signin`);
      }
    }
});

// import '../permission' // permission control
export default router
