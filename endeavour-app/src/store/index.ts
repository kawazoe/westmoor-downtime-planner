import { useStore as baseUseStore, createLogger, createStore } from 'vuex';
import type { InjectionKey } from 'vue';
import type { Store } from 'vuex';

import type {
  CampaignEntity,
  CharacterEntity,
  FungibleResourceEntity,
  GameSystemEntity,
  NonFungibleResourceEntity,
  PlayerEntity,
} from '@/store/business-types';
import {
  playerJohn,
  testCampaigns,
  testCharacters,
  testFungibleResources,
  testGameSystems,
  testNonFungibleResources,
  testPlayers,
} from '@/store/mocks';
import type { CombinedId } from '@/store/core-types';

export interface RootState {
  player: PlayerEntity | null;
  gameSystems: Record<CombinedId, GameSystemEntity>;
  fungibleResources: Record<CombinedId, FungibleResourceEntity>;
  nonFungibleResource: Record<CombinedId, NonFungibleResourceEntity>;
  players: Record<CombinedId, PlayerEntity>;
  campaigns: Record<CombinedId, CampaignEntity>;
  characters: Record<CombinedId, CharacterEntity>;
}

export const key: InjectionKey<Store<RootState>> = Symbol('vuex.RootState');

export const store = createStore<RootState>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    player: playerJohn,
    gameSystems: testGameSystems,
    fungibleResources: testFungibleResources,
    nonFungibleResource: testNonFungibleResources,
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
