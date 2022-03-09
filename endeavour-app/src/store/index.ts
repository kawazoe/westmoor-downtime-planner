import { useStore as baseUseStore, createLogger, createStore } from 'vuex';
import type { Store, StoreOptions } from 'vuex';
import type { InjectionKey } from 'vue';

import './mocks';

import * as AsyncModule from '@/store/async-store';
import type {
  CampaignEntity,
  CharacterEntity,
  FungibleResourceEntity,
  GameSystemEntity,
  NonFungibleResourceEntity,
  PlayerEntity,
} from '@/store/business-types';
import { CombinedId, Uri } from '@/store/core-types';
import type { AsyncValue } from '@/store/async-store';
import type { Binder } from '@/store/core-types';
import { RestRepository } from '@/store/rest-repository';

const gameSystems = new RestRepository<GameSystemEntity>(Uri.cast('/api/v1/game-systems'));
const fungibleResources = new RestRepository<FungibleResourceEntity>(Uri.cast('/api/v1/fungible-resources'));
const nonFungibleResources = new RestRepository<NonFungibleResourceEntity>(Uri.cast('/api/v1/non-fungible-resources'));
const players = new RestRepository<PlayerEntity>(Uri.cast('/api/v1/players'));
const campaigns = new RestRepository<CampaignEntity>(Uri.cast('/api/v1/campaigns'));
const characters = new RestRepository<CharacterEntity>(Uri.cast('/api/v1/characters'));

export type RootState = { ready: AsyncValue<boolean> };
export type RootModules = {
  gameSystems: { data: AsyncValue<Binder<GameSystemEntity>> },
  fungibleResources: { data: AsyncValue<Binder<FungibleResourceEntity>> },
  nonFungibleResources: { data: AsyncValue<Binder<NonFungibleResourceEntity>> },
  players: { data: AsyncValue<Binder<PlayerEntity>> } & { current: AsyncValue<PlayerEntity | null> },
  campaigns: { data: AsyncValue<Binder<CampaignEntity>> } & { current: AsyncValue<CampaignEntity | null> },
  characters: { data: AsyncValue<Binder<CharacterEntity>> } & { current: AsyncValue<CharacterEntity | null> },
};

export const store = createStore<RootState & Partial<RootModules>>({
  strict: process.env.NODE_ENV !== 'production',
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : [],
  ...AsyncModule.merge(
    AsyncModule.fromPromise('ready', async ({ dispatch }) => {
      await dispatch('gameSystems/data_trigger');
      return true;
    }),
    {
      modules: {
        gameSystems: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => gameSystems.getPage()()),
        ),
        fungibleResources: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => fungibleResources.getPage()()),
        ),
        nonFungibleResources: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => nonFungibleResources.getPage()()),
        ),
        players: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => players.getPage()()),
          // TODO: default id is only there temporarily. This call shouldn't trigger if there isn't an id.
          AsyncModule.fromPromise('current', () => players.getById(CombinedId.cast(sessionStorage.getItem('current-player') ?? 'mismis'))),
        ),
        campaigns: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => campaigns.getPage()()),
          AsyncModule.fromPromise('current', (_, { cid }: { cid: CombinedId }) => campaigns.getById(cid), { keySelector: p => p.cid }),
        ),
        characters: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => characters.getPage()()),
          AsyncModule.fromPromise('current', (_, { cid }: { cid: CombinedId }) => characters.getById(cid), { keySelector: p => p.cid }),
        ),
      },
    },
  ),
} as StoreOptions<RootState>);

export const key: InjectionKey<Store<RootState>> = Symbol('vuex.RootState');
export function useStore(): Store<RootState & RootModules> {
  return baseUseStore(key) as Store<RootState & RootModules>;
}
