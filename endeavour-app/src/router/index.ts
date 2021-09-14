import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import TheLanding from '@/views/TheLanding.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: TheLanding,
  },
  {
    path: '/campaigns',
    name: 'campaigns',
    component: () => import(/* WebpackChunkName: "campaigns" */ '../views/TheCampaigns.vue'),

    children: [
      {
        path: ':campaignCid',
        name: 'campaign',

        component: () => import(/* WebpackChunkName: "campaign" */ '../views/TheCampaign.vue'),
        props: true,

        children: [
          {
            path: '',
            redirect: to => ({ name: 'endeavours', params: to.params, replace: true }),
          },
          {
            path: 'activities',
            component: () => import(/* WebpackChunkName: "activities" */ '../views/TheCampaignActivities.vue'),
          },
          {
            path: 'characters',
            component: () => import(/* WebpackChunkName: "characters" */ '../views/TheCampaignCharacters.vue'),
          },
          {
            path: 'endeavours',
            name: 'endeavours',
            component: () => import(/* WebpackChunkName: "endeavours" */ '../views/TheCampaignEndeavours.vue'),
          },
          {
            path: 'resources',
            component: () => import(/* WebpackChunkName: "resources" */ '../views/TheCampaignResources.vue'),
          },
          {
            path: 'settings',
            component: () => import(/* WebpackChunkName: "settings" */ '../views/TheCampaignSettings.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/player',
    name: 'player',
    component: () => import(/* WebpackChunkName: "player" */ '../views/ThePlayer.vue'),
  },
  {
    path: '/player/characters',

    redirect: to => ({ name: 'player', params: to.params, replace: true }),
  },
  {
    path: '/player/characters/:characterCid',

    component: () => import(/* WebpackChunkName: "endeavours" */ '../views/ThePlayerCharacter.vue'),
    props: true,
  },
  {
    path: '/tos',
    name: 'tos',
    component: () => import(/* WebpackChunkName: "tos" */ '../views/TheTermsOfService.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
