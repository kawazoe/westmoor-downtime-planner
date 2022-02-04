import { mockEntity, mockMeta } from '@/store/mocks/mocking';
import { mockRightsPublic, ownerJohn } from '@/store/mocks/owners';
import type { FungibleResourceEntity } from '@/store/business-types';
import { FungibleResourceId } from '@/store/business-types';
import { genericGameSystem } from '@/store/mocks/gameSystems';
import { makeId } from '@/store/core-types';

export const fungibleTime = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerJohn),
  mockRightsPublic(ownerJohn),
  {
    ...makeId({
      id: FungibleResourceId.cast('QS'),
      idp: genericGameSystem.idp,
    }),
    description: 'Time (days)',
  },
);
export const fungibleCurrency = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerJohn),
  mockRightsPublic(ownerJohn),
  {
    ...makeId({
      id: FungibleResourceId.cast('Y4'),
      idp: genericGameSystem.idp,
    }),
    description: 'Currency (gold)',
  },
);

export const fungibleResources = [
  fungibleTime,
  fungibleCurrency,
];
