import { faGlobeAfrica, faGlobeAmericas, faGlobeAsia, faGlobeEurope } from '@fortawesome/pro-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import type { CampaignEntity, CharacterEntity, PlayerEntity, SubscriptionEntity } from '@/store/business-types';
import { CampaignId, CharacterId, PlayerId, SubscriptionId } from '@/store/business-types';
import type { EntityMeta, EntityRef, EntityRights, Right } from '@/store/core-types';
import { makeRef, OwnershipId, PartitionId } from '@/store/core-types';

function randomGlobeIcon(): IconDefinition {
  const rnd = Math.random() * 4;
  if (rnd >= 0 && rnd < 1) {
    return faGlobeAfrica;
  } else if (rnd >= 1 && rnd < 2) {
    return faGlobeAmericas;
  } else if (rnd >= 2 && rnd < 3) {
    return faGlobeAsia;
  }
  return faGlobeEurope;
}

function mockMeta(schema: string): EntityMeta {
  return {
    schema,
    schemaVersion: 1,
    created: {
      on: new Date().toJSON(),
      by: makeRef(ownerJohn),
    },
    modified: {
      on: new Date().toJSON(),
      by: makeRef(ownerJohn),
    },
    metas: {},
  };
}

function mockRights(
  owner: EntityRef<OwnershipId>,
  sharedWith: [EntityRef<OwnershipId>, readonly Right[]][] = [],
): EntityRights {
  return {
    owner,
    sharedWith: sharedWith.map(([share, rights]) => ({ ...share, rights })),
  };
}

function mockEntity<T>(
  meta: EntityMeta,
  base: Omit<T, keyof EntityMeta>,
): T;
function mockEntity<T>(
  meta: EntityMeta,
  rights: EntityRights,
  base: Omit<T, keyof EntityMeta | keyof EntityRights>,
): T;
function mockEntity<T>(...args: unknown[]): T {
  return args.length === 2
    ? {
      ...args[1] as EntityMeta,
      ...args[0] as Omit<T, keyof EntityMeta>,
    } as unknown as T
    : {
      ...args[2] as EntityMeta,
      ...args[0] as EntityRights,
      ...args[1] as Omit<T, keyof EntityMeta | keyof EntityRights>,
    } as unknown as T;
}

const ownerJohn: EntityRef<OwnershipId> = {
  id: OwnershipId.cast('fu1'),
  idp: PartitionId.cast('fu1'),
  description: 'John Doe',
};

const ownerPeter: EntityRef<OwnershipId> = {
  id: OwnershipId.cast('lFH'),
  idp: PartitionId.cast('lFH'),
  description: 'Peter Parker',
};

export const characterIronMan = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity'),
  mockRights(ownerJohn),
  {
    id: CharacterId.cast('Mk'),
    idp: ownerJohn.idp,
    description: 'IronMan',
    fullName: 'IronMan',
    resources: {
      fungibles: new Map(),
      nonFungibles: [],
    },
    modifierCards: [],
  },
);
export const characterBatMan = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity'),
  mockRights(ownerJohn),
  {
    id: CharacterId.cast('L2'),
    idp: ownerJohn.idp,
    description: 'BatMan',
    fullName: 'BatMan',
    resources: {
      fungibles: new Map(),
      nonFungibles: [],
    },
    modifierCards: [],
  },
);
export const testCharacters: CharacterEntity[] = [
  characterIronMan,
  characterBatMan,
];

export const campaignLoremIpsum = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity'),
  mockRights(ownerJohn),
  {
    id: CampaignId.cast('V9'),
    idp: ownerJohn.idp,
    description: 'Lorem Ipsum',
    icon: randomGlobeIcon(),
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignDolorSitAmet = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity'),
  mockRights(ownerJohn),
  {
    id: CampaignId.cast('6I'),
    idp: ownerJohn.idp,
    description: 'Dolor Sit Amet',
    icon: randomGlobeIcon(),
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignConsecteturAdipiscingElit = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity'),
  mockRights(ownerJohn),
  {
    id: CampaignId.cast('iS'),
    idp: ownerPeter.idp,
    description: 'Consectetur adipiscing elit',
    icon: randomGlobeIcon(),
    actionCards: [],
    modifierCards: [],
  },
);
export const testCampaigns: CampaignEntity[] = [
  campaignLoremIpsum,
  campaignDolorSitAmet,
  campaignConsecteturAdipiscingElit,
];

export const subscriptionJohn = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity'),
  {
    id: SubscriptionId.cast('W9'),
    idp: ownerJohn.idp,
    description: 'Annual Subscription',
  },
);

export const subscriptionPeter = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity'),
  {
    id: SubscriptionId.cast('D6'),
    idp: ownerPeter.idp,
    description: 'Annual Subscription',
  },
);

export const playerJohn = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity'),
  mockRights(ownerJohn),
  {
    id: PlayerId.cast(ownerJohn.id),
    idp: ownerJohn.idp,
    description: ownerJohn.description,
    icon: ownerJohn.icon,
    characters: [
      makeRef(characterIronMan),
      makeRef(characterBatMan),
    ],
    campaigns: [
      makeRef(campaignLoremIpsum),
      makeRef(campaignDolorSitAmet),
    ],
    subscription: subscriptionJohn,
  },
);

export const playerPeter = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity'),
  mockRights(ownerJohn),
  {
    id: PlayerId.cast(ownerPeter.id),
    idp: ownerPeter.idp,
    description: ownerPeter.description,
    icon: ownerPeter.icon,
    characters: [],
    campaigns: [makeRef(campaignConsecteturAdipiscingElit)],
    subscription: subscriptionPeter,
  },
);

export const testPlayers: PlayerEntity[] = [playerJohn, playerPeter];
