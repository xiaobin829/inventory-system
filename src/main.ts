import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next'
import router from './router'
import App from './App.vue'

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'

import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(TDesign)

app.mount('#app')
