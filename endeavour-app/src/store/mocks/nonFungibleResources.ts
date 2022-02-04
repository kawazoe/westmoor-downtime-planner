import { mockEntity, mockMeta } from '@/store/mocks/mocking';
import { mockRightsPublic, ownerJohn } from '@/store/mocks/owners';
import { makeId } from '@/store/core-types';
import type { NonFungibleResourceEntity } from '@/store/business-types';
import { NonFungibleResourceId } from '@/store/business-types';

export const nonFungibleDoomCoin = mockEntity<NonFungibleResourceEntity>(
  mockMeta('NonFungibleResourceEntity', ownerJohn),
  mockRightsPublic(ownerJohn),
  {
    ...makeId({
      id: NonFungibleResourceId.cast('_s'),
      idp: ownerJohn.idp,
    }),
    description: 'Doom Coin',
  },
);
export const nonFungibleSword = mockEntity<NonFungibleResourceEntity>(
  mockMeta('NonFungibleResourceEntity', ownerJohn),
  mockRightsPublic(ownerJohn),
  {
    ...makeId({
      id: NonFungibleResourceId.cast('S0'),
      idp: ownerJohn.idp,
    }),
    description: 'Sword',
  },
);

export const nonFungibleResources = [
  nonFungibleDoomCoin,
  nonFungibleSword,
];
