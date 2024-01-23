import { createApp } from 'vue'
import '@/assets/css/reset.css'
import '@/assets/css/normalise.css'
import '@/assets/css/googleFonts.css'
import '@/assets/css/cropper.css'
import '@/cropper/cropper.js'
import App from '@/App.vue'
import router from '@/router/router.js'
import naive from "naive-ui";

createApp(App).use(router).use(naive).mount('#app')
