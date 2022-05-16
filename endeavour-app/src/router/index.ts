/// <reference types="vite/client" />

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
    component: () => import('../views/TheCampaigns.vue'),

    children: [
      {
        path: ':campaignCid',
        name: 'campaign',

        component: () => import('../views/TheCampaign.vue'),
        props: true,

        children: [
          {
            path: '',
            redirect: to => ({ name: 'endeavours', params: to.params, replace: true }),
          },
          {
            path: 'actions',
            component: () => import('../views/TheCampaignActions.vue'),
          },
          {
            path: 'characters',
            component: () => import('../views/TheCampaignCharacters.vue'),
          },
          {
            path: 'endeavours',
            name: 'endeavours',
            component: () => import('../views/TheCampaignEndeavours.vue'),
          },
          {
            path: 'resources',
            component: () => import('../views/TheCampaignResources.vue'),
          },
          {
            path: 'settings',
            component: () => import('../views/TheCampaignSettings.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/player',
    name: 'player',
    component: () => import('../views/ThePlayer.vue'),
  },
  {
    path: '/player/characters',

    redirect: to => ({ name: 'player', params: to.params, replace: true }),
  },
  {
    path: '/player/characters/:characterCid',

    component: () => import('../views/ThePlayerCharacter.vue'),
    props: true,
  },
  {
    path: '/tos',
    name: 'tos',
    component: () => import('../views/TheTermsOfService.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
