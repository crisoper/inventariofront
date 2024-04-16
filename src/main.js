import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/main.css'
import './assets/variables.css'

import ElementPlus from 'element-plus'
import Permision from './directives/permission'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


// import { OhVueIcon, addIcons } from 'oh-vue-icons'

import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'

// import * as Icons from "oh-vue-icons/icons";

// const AllIcons = Object.values({ ...Icons });
// addIcons(...AllIcons);




const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.directive('permission', Permision)
app.component('v-icon', SvgIcon)
app.use(ElementPlus)

app.mount('#app')
// .$nextTick(() => {
//     // Oculta el loader una vez que la app esté montada
//     const loader = document.getElementById('page-loader')
//     if (loader) {
//       loader.style.display = 'none'
//     }
//   })