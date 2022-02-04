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
import type { AsyncValueState } from '@/store/async-store';
import { RestRepository } from '@/store/rest-repository';

export type RootState = AsyncValueState<'init', boolean>;
export type RootModules = {
  players: AsyncValueState<'data', PlayerEntity[]> & AsyncValueState<'current', PlayerEntity | null>,
};

export const key: InjectionKey<Store<RootState>> = Symbol('vuex.RootState');

const gameSystems = new RestRepository<GameSystemEntity>(Uri.cast('/api/v1/game-systems'));
const fungibleResources = new RestRepository<FungibleResourceEntity>(Uri.cast('/api/v1/fungible-resources'));
const nonFungibleResources = new RestRepository<NonFungibleResourceEntity>(Uri.cast('/api/v1/non-fungible-resources'));
const players = new RestRepository<PlayerEntity>(Uri.cast('/api/v1/players'));
const campaigns = new RestRepository<CampaignEntity>(Uri.cast('/api/v1/campaigns'));
const characters = new RestRepository<CharacterEntity>(Uri.cast('/api/v1/characters'));

export const store = createStore<RootState & Partial<RootModules>>({
  strict: process.env.NODE_ENV !== 'production',
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : [],
  ...AsyncModule.merge(
    AsyncModule.fromPromise('init', async ({ dispatch }) => {
      await dispatch('gameSystems/data_trigger');
      return true;
    }),
    {
      modules: {
        gameSystems: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => gameSystems.getAll()),
        ),
        fungibleResources: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => fungibleResources.getAll()),
        ),
        nonFungibleResources: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => nonFungibleResources.getAll()),
        ),
        players: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => players.getAll()),
          AsyncModule.fromPromise('current', () => players.getById(CombinedId.cast('fu1fu1'))),
        ),
        campaigns: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => campaigns.getAll()),
          AsyncModule.fromPromise('current', (_, { id }: { id: CombinedId }) => campaigns.getById(id)),
        ),
        characters: AsyncModule.merge(
          { namespaced: true },
          AsyncModule.fromPromise('data', () => characters.getAll()),
          AsyncModule.fromPromise('current', (_, { id }: { id: CombinedId }) => characters.getById(id)),
        ),
      },
    },
  ),
} as StoreOptions<RootState>);

export function useStore(): Store<RootState & RootModules> {
  return baseUseStore(key) as Store<RootState & RootModules>;
}
