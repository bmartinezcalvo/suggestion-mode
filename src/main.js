import { createApp } from 'vue'
import { CdxTooltip } from '@wikimedia/codex'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.directive('tooltip', CdxTooltip)
app.mount('#app')

