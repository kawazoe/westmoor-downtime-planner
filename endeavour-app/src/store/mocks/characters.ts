import { fungibleCurrency, fungibleTime } from '@/store/mocks/fungibleResources';
import { makeId, makeRef } from '@/store/core-types';
import { mockEntity, mockMeta, mockRights } from '@/store/mocks/mocking';
import type { CharacterEntity } from '@/store/business-types';
import { CharacterId } from '@/store/business-types';
import { nonFungibleSword } from '@/store/mocks/nonFungibleResources';
import { ownerJohn } from '@/store/mocks/owners';

export const characterIronMan = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerJohn),
  mockRights(ownerJohn),
  {
    ...makeId({
      id: CharacterId.cast('Mk'),
      idp: ownerJohn.idp,
    }),
    description: 'IronMan',
    fullName: 'IronMan',
    bio: 'He\'s a multi-billionaire dude who loves to build things.',
    resources: {
      fungibles: [
        [makeRef(fungibleCurrency), 42],
        [makeRef(fungibleTime), 13],
      ],
      nonFungibles: [makeRef(nonFungibleSword)],
    },
    modifierCards: [],
  },
);
export const characterBatMan = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerJohn),
  mockRights(ownerJohn),
  {
    ...makeId({
      id: CharacterId.cast('L2'),
      idp: ownerJohn.idp,
    }),
    description: 'BatMan',
    fullName: 'BatMan',
    bio: 'He\'s a multi-billionaire dude who loves to wear a mask.',
    resources: {
      fungibles: [],
      nonFungibles: [],
    },
    modifierCards: [],
  },
);

export const characters = [
  characterIronMan,
  characterBatMan,
];
