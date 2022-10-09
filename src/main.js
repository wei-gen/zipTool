import { createApp } from 'vue'
import App from './App.vue'
import { createRouter,createWebHashHistory } from 'vue-router'
import index from '@/components/index.vue'
import chinese from '@/components/chinese.vue'
import reader from '@/components/reader.vue'

const routes = [
    { path: '/', component: index },
    { path: '/index', component: index },
    { path: '/chinese', component: chinese },
    { path: '/reader', component: reader },
]


const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes,
})


createApp(App).use(router).mount('#app')
