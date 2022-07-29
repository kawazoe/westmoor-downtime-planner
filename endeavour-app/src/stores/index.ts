import { defineBinderStore } from '@/stores/binderStore';
import { definePromiseStore } from '@/stores/promiseStore';

import type {
  CampaignEntity,
  CharacterEntity,
  FungibleResourceEntity,
  GameSystemEntity,
  NonFungibleResourceEntity,
  PlayerEntity,
} from '@/stores/businessTypes';
import { CombinedId, Uri } from '@/stores/coreTypes';
import { RestRepository } from '@/stores/restRepository';

const gameSystemsRepository = new RestRepository<GameSystemEntity>(Uri.cast('/api/v1/game-systems'));
const fungibleResourcesRepository = new RestRepository<FungibleResourceEntity>(Uri.cast('/api/v1/fungible-resources'));
const nonFungibleResourcesRepository = new RestRepository<NonFungibleResourceEntity>(Uri.cast('/api/v1/non-fungible-resources'));
const playersRepository = new RestRepository<PlayerEntity>(Uri.cast('/api/v1/players'));
const campaignsRepository = new RestRepository<CampaignEntity>(Uri.cast('/api/v1/campaigns'));
const charactersRepository = new RestRepository<CharacterEntity>(Uri.cast('/api/v1/characters'));

export const useGameSystemsDataStore = defineBinderStore('game-systems-data', () => gameSystemsRepository.getPage());
export const useFungibleResourcesDataStore = definePromiseStore('fungible-resources-data', () => fungibleResourcesRepository.getPage()());
export const useNonFungibleResourcesDataStore = definePromiseStore('non-fungible-resources-data', () => nonFungibleResourcesRepository.getPage()());
export const usePlayersDataStore = defineBinderStore('players-data', () => playersRepository.getPage());
// TODO: default id is only there temporarily. This call shouldn't trigger if there isn't an id.
const getCurrentPlayerCid = (): CombinedId => CombinedId.cast(sessionStorage.getItem('current-player') ?? 'mismis');
export const usePlayersCurrentStore = definePromiseStore('players-current', () => playersRepository.getById(getCurrentPlayerCid()), { keySelector: getCurrentPlayerCid });
export const useCampaignsDataStore = definePromiseStore('campaigns-data', () => campaignsRepository.getPage()());
export const useCampaignsCurrentStore = definePromiseStore('campaigns-current', (cid: CombinedId) => campaignsRepository.getById(cid));
export const useCharactersDataStore = definePromiseStore('characters-data', () => charactersRepository.getPage()());
export const useCharactersCurrentStore = definePromiseStore('characters-current', (cid: CombinedId) => charactersRepository.getById(cid));

export const useStore = definePromiseStore('main', async () => {
  const gameSystemsStore = useGameSystemsDataStore();
  await gameSystemsStore.bind()();
  return true;
});