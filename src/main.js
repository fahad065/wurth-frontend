import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import router from './router'
import App from './App.vue'

const vuetify = createVuetify({
  components, directives,
  theme: {
    defaultTheme: 'wps',
    themes: {
      wps: {
        dark: false,
        colors: {
          primary:    '#CC0000',
          secondary:  '#1A1A1A',
          surface:    '#FFFFFF',
          background: '#F5F5F5',
          success:    '#2E7D32',
          warning:    '#E65100',
          info:       '#1565C0',
        },
      },
    },
  },
})

const pinia = createPinia()
createApp(App).use(pinia).use(vuetify).use(router).mount('#app')
