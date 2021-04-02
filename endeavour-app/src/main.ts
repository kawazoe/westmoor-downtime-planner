import { createApp } from 'vue';

import { key, store } from './store';
import router from './router';

import './app.css';

import { faBars, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { svgIconCache } from '@/components/TheSvgIconCache';

import App from './App.vue';

svgIconCache.add(faBars, faTimes);

createApp(App)
  .use(store, key)
  .use(router)
  .mount('#app');
