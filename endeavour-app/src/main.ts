import { createApp } from 'vue';
import router from './router';
import store from './store';

import './app.css';

import { faBars, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { svgIconCache } from '@/components/TheSvgIconCache';

import App from './App.vue';

svgIconCache.add(faBars, faTimes);

createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
