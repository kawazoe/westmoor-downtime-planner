import { makeId, PartitionId } from '@/store/core-types';
import { mockEntity, mockMeta } from '@/store/mocks/mocking';
import { mockRightsPublic, ownerJohn } from '@/store/mocks/owners';
import type { GameSystemEntity } from '@/store/business-types';
import { GameSystemId } from '@/store/business-types';

export const genericGameSystem = mockEntity<GameSystemEntity>(
  mockMeta('GameSystemEntity', ownerJohn),
  mockRightsPublic(ownerJohn),
  {
    ...makeId({
      id: GameSystemId.cast('1Fe'),
      idp: PartitionId.cast('1Fe'),
    }),
    description: 'Generic Game System',
  },
);

export const gameSystems = [genericGameSystem];
