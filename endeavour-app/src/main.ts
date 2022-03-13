import { createApp } from 'vue';
import { createPinia } from 'pinia';

import router from './router';

import './app.css';

import { faBars, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { svgIconCache } from '@/components/TheSvgIconCache';

import App from './App.vue';

import './mocks';

svgIconCache.add(faBars, faTimes);

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app');
