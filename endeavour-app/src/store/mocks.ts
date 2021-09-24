import { faGlobeAfrica, faGlobeAmericas, faGlobeAsia, faGlobeEurope } from '@fortawesome/pro-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import type {
  CampaignEntity,
  CharacterEntity,
  FungibleResourceEntity,
  GameSystemEntity,
  NonFungibleResourceEntity,
  PlayerEntity,
  SubscriptionEntity,
} from '@/store/business-types';
import {
  CampaignId,
  CharacterId,
  FungibleResourceId,
  GameSystemId,
  NonFungibleResourceId,
  PlayerId,
  SubscriptionId,
} from '@/store/business-types';
import type { CombinedId, EntityMeta, EntityRef, EntityRights, OwnershipEntity, Right } from '@/store/core-types';
import { Email, makeId, makeRef, OwnershipId, PartitionId, Uri } from '@/store/core-types';

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
      by: makeRef(ownerJohnRef),
    },
    modified: {
      on: new Date().toJSON(),
      by: makeRef(ownerJohnRef),
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

function mockRightsPublic(owner: EntityRef<OwnershipId>): EntityRights {
  return mockRights(owner, [[makeRef(ownerAll), ['read']]]);
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

const ownerAll: OwnershipEntity = {
  ...(makeId({
    id: OwnershipId.cast('EBd'),
    idp: PartitionId.cast('EBd'),
  })),
  description: 'All Users',
  fullName: 'All Users',
};

const ownerJohn: OwnershipEntity = {
  ...(makeId({
    id: OwnershipId.cast('fu1'),
    idp: PartitionId.cast('fu1'),
  })),
  description: 'John Doe',
  fullName: 'John Doe',
  email: Email.cast('john.doe@example.com'),
  picture: Uri.cast('https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/John_Doe%2C_born_John_Nommensen_Duchac.jpg/220px-John_Doe%2C_born_John_Nommensen_Duchac.jpg'),
};
const ownerJohnRef = makeRef(ownerJohn);

const ownerPeter: OwnershipEntity = {
  ...(makeId({
    id: OwnershipId.cast('lFH'),
    idp: PartitionId.cast('lFH'),
  })),
  description: 'Peter Parker',
  fullName: 'Peter Parker',
  email: Email.cast('peter.parker@example.com'),
  picture: Uri.cast('https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Peter_Parker_%28physician%29_in_the_1860s%2C_from_-_Hon._Parker_-_NARA_-_528706_%28cropped%29.jpg/220px-Peter_Parker_%28physician%29_in_the_1860s%2C_from_-_Hon._Parker_-_NARA_-_528706_%28cropped%29.jpg'),
};
const ownerPeterRef = makeRef(ownerPeter);

const genericGameSystem = mockEntity<GameSystemEntity>(
  mockMeta('GameSystemEntity'),
  mockRightsPublic(ownerJohnRef),
  {
    ...makeId({
      id: GameSystemId.cast('1Fe'),
      idp: PartitionId.cast('1Fe'),
    }),
    description: 'Generic Game System',
  },
);
const genericGameSystemRef = makeRef(genericGameSystem);

export const testGameSystems: Record<CombinedId, GameSystemEntity> = { [genericGameSystem.cid]: genericGameSystem };

export const fungibleTime = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity'),
  mockRightsPublic(ownerJohnRef),
  {
    ...makeId({
      id: FungibleResourceId.cast('QS'),
      idp: genericGameSystemRef.idp,
    }),
    description: 'Time (days)',
  },
);
export const fungibleCurrency = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity'),
  mockRightsPublic(ownerJohnRef),
  {
    ...makeId({
      id: FungibleResourceId.cast('Y4'),
      idp: genericGameSystemRef.idp,
    }),
    description: 'Currency (gold)',
  },
);
export const testFungibleResources: Record<CombinedId, FungibleResourceEntity> = {
  [fungibleTime.cid]: fungibleTime,
  [fungibleCurrency.cid]: fungibleCurrency,
};

export const nonFungibleDoomCoin = mockEntity<NonFungibleResourceEntity>(
  mockMeta('NonFungibleResourceEntity'),
  mockRightsPublic(ownerJohnRef),
  {
    ...makeId({
      id: NonFungibleResourceId.cast('_s'),
      idp: ownerJohnRef.idp,
    }),
    description: 'Doom Coin',
  },
);
export const nonFungibleSword = mockEntity<NonFungibleResourceEntity>(
  mockMeta('NonFungibleResourceEntity'),
  mockRightsPublic(ownerJohnRef),
  {
    ...makeId({
      id: NonFungibleResourceId.cast('S0'),
      idp: ownerJohnRef.idp,
    }),
    description: 'Sword',
  },
);

export const testNonFungibleResources: Record<CombinedId, NonFungibleResourceEntity> = {
  [nonFungibleDoomCoin.cid]: nonFungibleDoomCoin,
  [nonFungibleSword.cid]: nonFungibleSword,
};

export const characterIronMan = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity'),
  mockRights(ownerJohnRef),
  {
    ...makeId({
      id: CharacterId.cast('Mk'),
      idp: ownerJohnRef.idp,
    }),
    description: 'IronMan',
    fullName: 'IronMan',
    bio: 'He\'s a multi-billionaire dude who loves to build things.',
    resources: {
      fungibles: new Map<EntityRef<FungibleResourceId>, number>([
        [makeRef(fungibleCurrency), 42],
        [makeRef(fungibleTime), 13],
      ]),
      nonFungibles: [makeRef(nonFungibleSword)],
    },
    modifierCards: [],
  },
);
export const characterBatMan = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity'),
  mockRights(ownerJohnRef),
  {
    ...makeId({
      id: CharacterId.cast('L2'),
      idp: ownerJohnRef.idp,
    }),
    description: 'BatMan',
    fullName: 'BatMan',
    bio: 'He\'s a multi-billionaire dude who loves to wear a mask.',
    resources: {
      fungibles: new Map<EntityRef<FungibleResourceId>, number>(),
      nonFungibles: [],
    },
    modifierCards: [],
  },
);
export const testCharacters: Record<CombinedId, CharacterEntity> = {
  [characterIronMan.cid]: characterIronMan,
  [characterBatMan.cid]: characterBatMan,
};

export const campaignLoremIpsum = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity'),
  mockRightsPublic(ownerJohnRef),
  {
    ...(makeId({
      id: CampaignId.cast('aEf'),
      idp: PartitionId.cast('aEf'),
    })),
    description: 'Lorem Ipsum',
    gameSystem: genericGameSystemRef,
    icon: randomGlobeIcon(),
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignDolorSitAmet = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity'),
  mockRights(ownerJohnRef),
  {
    ...(makeId({
      id: CampaignId.cast('9ge'),
      idp: PartitionId.cast('9ge'),
    })),
    description: 'Dolor Sit Amet',
    gameSystem: genericGameSystemRef,
    icon: randomGlobeIcon(),
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignConsecteturAdipiscingElit = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity'),
  mockRights(ownerPeterRef),
  {
    ...(makeId({
      id: CampaignId.cast('Sgt'),
      idp: PartitionId.cast('Sgt'),
    })),
    description: 'Consectetur Adipiscing Elit',
    gameSystem: genericGameSystemRef,
    icon: randomGlobeIcon(),
    actionCards: [],
    modifierCards: [],
  },
);
export const testCampaigns: Record<CombinedId, CampaignEntity> = {
  [campaignLoremIpsum.cid]: campaignLoremIpsum,
  [campaignDolorSitAmet.cid]: campaignDolorSitAmet,
  [campaignConsecteturAdipiscingElit.cid]: campaignConsecteturAdipiscingElit,
};

export const subscriptionJohn = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity'),
  {
    ...makeId({
      id: SubscriptionId.cast('W9'),
      idp: ownerJohnRef.idp,
    }),
    description: 'Annual Subscription',
  },
);

export const subscriptionPeter = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity'),
  {
    ...makeId({
      id: SubscriptionId.cast('D6'),
      idp: ownerPeterRef.idp,
    }),
    description: 'Annual Subscription',
  },
);

export const playerJohn = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity'),
  mockRights(ownerJohnRef),
  {
    ...makeId({
      id: PlayerId.cast(ownerJohnRef.id),
      idp: ownerJohnRef.idp,
    }),
    description: ownerJohnRef.description,
    icon: ownerJohnRef.icon,
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
  mockRights(ownerPeterRef),
  {
    ...makeId({
      id: PlayerId.cast(ownerPeterRef.id),
      idp: ownerPeterRef.idp,
    }),
    description: ownerPeterRef.description,
    icon: ownerPeterRef.icon,
    characters: [],
    campaigns: [
      makeRef(campaignDolorSitAmet),
      makeRef(campaignConsecteturAdipiscingElit),
    ],
    subscription: subscriptionPeter,
  },
);

export const testPlayers: Record<CombinedId, PlayerEntity> = {
  [playerJohn.cid]: playerJohn,
  [playerPeter.cid]: playerPeter,
};
