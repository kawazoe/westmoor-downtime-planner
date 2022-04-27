import { makeId, PartitionId } from '@/stores/coreTypes';
import { mockEntity, mockMeta } from '@/mocks/mocking';
import { mockRightsPublic, ownerGenericPublisher } from '@/mocks/owners';
import type { GameSystemEntity } from '@/stores/businessTypes';
import { GameSystemId } from '@/stores/businessTypes';

export const gameSystemGeneric = mockEntity<GameSystemEntity>(
  mockMeta('GameSystemEntity', ownerGenericPublisher),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: GameSystemId.cast('1Fe'),
      idp: PartitionId.cast('1Fe'),
    }),
    description: 'Generic Game System',
  },
);

export const gameSystemDungeonAndDragons5e = mockEntity<GameSystemEntity>(
  mockMeta('GameSystemEntity', ownerGenericPublisher),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: GameSystemId.cast('R02'),
      idp: PartitionId.cast('R02'),
    }),
    description: 'Dungeon & Dragons (5e)',
  },
);

export const gameSystemWorldOfDarkness = mockEntity<GameSystemEntity>(
  mockMeta('GameSystemEntity', ownerGenericPublisher),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: GameSystemId.cast('Klw'),
      idp: PartitionId.cast('Klw'),
    }),
    description: 'Wold of Darkness',
  },
);

export const gameSystemTravellers = mockEntity<GameSystemEntity>(
  mockMeta('GameSystemEntity', ownerGenericPublisher),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: GameSystemId.cast('G4f'),
      idp: PartitionId.cast('G4f'),
    }),
    description: 'Travellers',
  },
);

export const gameSystems = [
  gameSystemGeneric,
  gameSystemDungeonAndDragons5e,
  gameSystemWorldOfDarkness,
  gameSystemTravellers,
];
