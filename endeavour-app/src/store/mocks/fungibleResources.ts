import type { FungibleResourceEntity } from '@/store/business-types';
import { FungibleResourceId } from '@/store/business-types';
import { makeId } from '@/store/core-types';

import {
  gameSystemDungeonAndDragons5e,
  gameSystemGeneric,
  gameSystemTravellers,
  gameSystemWorldOfDarkness,
} from '@/store/mocks/gameSystems';
import { mockEntity, mockMeta } from '@/store/mocks/mocking';
import { mockRightsPublic, ownerGenericPublisher } from '@/store/mocks/owners';

export const fungibleDownTimeDays = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('QS'),
      idp: gameSystemGeneric.idp,
    }),
    description: 'Down Time (days)',
  },
);
export const fungibleCurrencyGold = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('Y4'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    description: 'Currency (gold)',
  },
);
export const fungibleCurrencyDollars = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('QG'),
      idp: gameSystemWorldOfDarkness.idp,
    }),
    description: 'Currency ($)',
  },
);
export const fungibleCurrencyCredits = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('TX'),
      idp: gameSystemTravellers.idp,
    }),
    description: 'Currency (Credits)',
  },
);

export const fungibleResources = [
  fungibleDownTimeDays,
  fungibleCurrencyGold,
  fungibleCurrencyDollars,
  fungibleCurrencyCredits,
];
