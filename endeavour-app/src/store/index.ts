import { useStore as baseUseStore, createLogger, createStore } from 'vuex';
import type { InjectionKey } from 'vue';
import type { Store } from 'vuex';

import './mocks';

import type {
  CampaignEntity,
  CharacterEntity,
  FungibleResourceEntity,
  GameSystemEntity,
  NonFungibleResourceEntity,
  PlayerEntity,
} from '@/store/business-types';
import { CombinedId, Uri } from '@/store/core-types';
import type { AsyncStatus } from '@/store/async-store';
import { createStoreModule } from '@/store/async-store';
import { RestRepository } from '@/store/rest-repository';

export interface RootState {
  status: AsyncStatus;
  playerCid: CombinedId;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootModules {
}

export const key: InjectionKey<Store<RootState>> = Symbol('vuex.RootState');

const gameSystems = new RestRepository<GameSystemEntity>(Uri.cast('/api/v1/game-systems'));
const fungibleResources = new RestRepository<FungibleResourceEntity>(Uri.cast('/api/v1/fungible-resources'));
const nonFungibleResources = new RestRepository<NonFungibleResourceEntity>(Uri.cast('/api/v1/non-fungible-resources'));
const players = new RestRepository<PlayerEntity>(Uri.cast('/api/v1/players'));
const campaigns = new RestRepository<CampaignEntity>(Uri.cast('/api/v1/campaigns'));
const characters = new RestRepository<CharacterEntity>(Uri.cast('/api/v1/characters'));

export const store = createStore<RootState & Partial<RootModules>>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    status: 'loading',
    playerCid: CombinedId.cast('fu1fu1'),
  },
  getters: {
    ready: state => state.status === 'success',
    player: (state, getters) => getters['players/byCid'](state.playerCid) as PlayerEntity,
  },
  mutations: {
    load(s) {
      s.status = 'loading';
    },
    resolve(s) {
      s.status = 'success';
    },
    reject(s) {
      s.status = 'error';
    },
  },
  actions: {
    async init({ commit, dispatch }) {
      commit('load');

      await dispatch('player/init');

      commit('resolve');
    },
  },
  modules: {
    player: createStoreModule<{ player: PlayerEntity | null }, RootState>({
      state() {
        return { player: null };
      },
    }),
  },
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : [],
}) as Store<RootState & RootModules>;

export function useStore(): Store<RootState & RootModules> {
  return baseUseStore(key) as Store<RootState & RootModules>;
}
