import { useStore as baseUseStore, createLogger, createStore } from 'vuex';
import type { Commit, Module, Store } from 'vuex';
import type { InjectionKey } from 'vue';

import './mocks';

import type {
  CampaignEntity, CampaignId,
  CharacterEntity, CharacterId,
  FungibleResourceEntity, FungibleResourceId,
  GameSystemEntity, GameSystemId,
  NonFungibleResourceEntity, NonFungibleResourceId,
  PlayerEntity, PlayerId,
} from '@/store/business-types';
import { CombinedId, makeCid } from '@/store/core-types';
import type { EntityId, PartitionId } from '@/store/core-types';

import { CustomError } from '@/lib/generics';
import { record } from '@/lib/functional';

export type LoadingStatus = 'initial' | 'loading' | 'success' | 'error';

export interface ApiCacheState<TEntity> {
  data: Record<CombinedId, TEntity>;
  error: string | null;
  status: LoadingStatus;
}
export interface RootState {
  status: LoadingStatus;
  playerCid: CombinedId;
}
export interface RootModules {
  gameSystems: ApiCacheState<GameSystemEntity>;
  fungibleResources: ApiCacheState<FungibleResourceEntity>;
  nonFungibleResources: ApiCacheState<NonFungibleResourceEntity>;
  players: ApiCacheState<PlayerEntity>;
  campaigns: ApiCacheState<CampaignEntity>;
  characters: ApiCacheState<CharacterEntity>;
}

export const key: InjectionKey<Store<RootState>> = Symbol('vuex.RootState');

function createApiCacheModule<TId, TEntity extends EntityId<TId>, TRoot = RootState>(endpoint: string): Module<ApiCacheState<TEntity>, TRoot> {
  async function withQuery<TPayload>(
    commit: Commit,
    url: string,
    selector: (payload: TPayload) => Record<CombinedId, TEntity>,
  ): Promise<void> {
    commit('query');

    const response = await fetch(url);

    try {
      if (response.ok) {
        const payload: TPayload = await response.json();
        commit('resolve', selector(payload));
      } else {
        const payload = new CustomError(response.statusText);
        commit('reject', payload);
      }
    } catch (e: unknown) {
      commit('reject', e instanceof Error ? e : new CustomError(JSON.stringify(e)));
    }
  }

  return {
    namespaced: true,
    state: () => ({
      data: {},
      error: null,
      status: 'initial',
    }),
    getters: {
      all: s => s.data,
      byCid: s => (cid: CombinedId) => s.data[cid],
      byId: s => (idp: PartitionId, id: TId) => s.data[makeCid({ idp, id })],
    },
    mutations: {
      query(s) {
        s.status = 'loading';
      },
      resolve(s, payload: Record<CombinedId, TEntity>) {
        s.data = {
          ...s.data,
          ...payload,
        };
        s.status = 'success';
      },
      reject(s, payload: Error) {
        s.error = payload.message;
        s.status = 'error';
      },
    },
    actions: {
      async loadAll({ commit }) {
        await withQuery(commit, endpoint, record((v: TEntity) => v.cid));
      },
      async loadByCid({ commit }, cid: CombinedId) {
        await withQuery(commit, `${endpoint}/${cid}`, (payload: TEntity) => ({ [payload.cid]: payload }));
      },
    },
  };
}

export const store = createStore<RootState & Partial<RootModules>>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    status: 'initial',
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

      await dispatch('gameSystems/loadAll');
      await dispatch('players/loadAll');
      await dispatch('fungibleResources/loadAll');
      await dispatch('nonFungibleResources/loadAll');
      await dispatch('campaigns/loadAll');
      await dispatch('characters/loadAll');

      commit('resolve');
    },
  },
  modules: {
    gameSystems: createApiCacheModule<GameSystemId, GameSystemEntity>('/api/v1/game-systems'),
    fungibleResources: createApiCacheModule<FungibleResourceId, FungibleResourceEntity>('/api/v1/fungible-resources'),
    nonFungibleResources: createApiCacheModule<NonFungibleResourceId, NonFungibleResourceEntity>('/api/v1/non-fungible-resources'),
    players: createApiCacheModule<PlayerId, PlayerEntity>('/api/v1/players'),
    campaigns: createApiCacheModule<CampaignId, CampaignEntity>('/api/v1/campaigns'),
    characters: createApiCacheModule<CharacterId, CharacterEntity>('/api/v1/characters'),
  },
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : [],
}) as Store<RootState & RootModules>;

export function useStore(): Store<RootState & RootModules> {
  return baseUseStore(key) as Store<RootState & RootModules>;
}
