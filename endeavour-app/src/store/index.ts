import { useStore as baseUseStore, createStore } from 'vuex';
import type { InjectionKey } from 'vue';
import type { Store } from 'vuex';

import { faGlobeAfrica, faGlobeAmericas, faGlobeAsia, faGlobeEurope } from '@fortawesome/pro-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

function randomGlobeIcon(): IconDefinition {
  const rnd = Math.random() * 4;
  if (rnd >= 0  && rnd < 1) {
    return faGlobeAfrica;
  } else if (rnd >= 1 && rnd < 2) {
    return faGlobeAmericas;
  } else if (rnd >= 2 && rnd < 3) {
    return faGlobeAsia;
  }
  return faGlobeEurope;
}

export interface CampaignEntity {
  id: string;
  name: string;
  icon: IconDefinition;
}

export interface RootState {
  campaigns: CampaignEntity[];
}

export const key: InjectionKey<Store<RootState>> = Symbol('vuex.RootState');

export const store = createStore<RootState>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    campaigns: [
      { id: 'dd8e4c1c-cd28-4703-a5eb-a569836b8bc6', name: 'Lorem Ipsum', icon: randomGlobeIcon() } as CampaignEntity,
      { id: '7b036df8-ecf3-4ef2-a06c-3cd2398d7a70', name: 'Dolor Sit Amet', icon: randomGlobeIcon() } as CampaignEntity,
      { id: '443bfac6-8c51-42b1-be8e-98ff1e0ca58c', name: 'Consectetur adipiscing elit', icon: randomGlobeIcon() } as CampaignEntity,
    ],
  },
  mutations: {},
  actions: {},
  modules: {},
});

export function useStore(): Store<RootState> {
  return baseUseStore(key);
}
