import { useStore as baseUseStore, createLogger, createStore } from 'vuex';
import type { InjectionKey } from 'vue';
import type { Store } from 'vuex';

import type {
  CampaignEntity,
  CharacterEntity,
  PlayerEntity,
} from '@/store/business-types';
import { playerJohn, testCampaigns, testCharacters, testPlayers } from '@/store/mocks';
import type { CombinedId } from '@/store/core-types';

export interface RootState {
  player: PlayerEntity | null;
  players: Record<CombinedId, PlayerEntity>;
  campaigns: Record<CombinedId, CampaignEntity>;
  characters: Record<CombinedId, CharacterEntity>;
}

export const key: InjectionKey<Store<RootState>> = Symbol('vuex.RootState');

export const store = createStore<RootState>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    player: playerJohn,
    players: testPlayers,
    campaigns: testCampaigns,
    characters: testCharacters,
  },
  mutations: {},
  actions: {},
  modules: {},
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : [],
});

export function useStore(): Store<RootState> {
  return baseUseStore(key);
}
