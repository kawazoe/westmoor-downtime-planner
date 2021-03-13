import { createApp } from 'vue';
import router from './router';
import store from './store';

import './app.css';

import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { svgIconCache } from '@/components/AppSvgIconCache';

import App from './App.vue';

svgIconCache.add(faChevronRight);

createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
