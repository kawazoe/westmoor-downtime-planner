import { CharacterId, NonFungibleResourceId } from '@/stores/business-types';
import { makeId, makeRef } from '@/stores/core-types';
import type { CharacterEntity } from '@/stores/business-types';

import {
  fungibleCurrencyCredits,
  fungibleCurrencyDollars,
  fungibleCurrencyGold,
  fungibleDownTimeDays,
} from '@/mocks/fungibleResources';
import {
  gameSystemDungeonAndDragons5e,
  gameSystemGeneric,
  gameSystemTravellers,
  gameSystemWorldOfDarkness,
} from '@/mocks/gameSystems';
import { mockEntity, mockMeta, mockRights } from '@/mocks/mocking';
import {
  nonFungibleBandages, nonFungibleClothes, nonFungibleCreditCard, nonFungibleCreditChip,
  nonFungibleSmartphone, nonFungibleWeapon,
} from '@/mocks/nonFungibleResources';
import {
  ownerAbdelrahmanThornes, ownerAbdulSalamKowalowski, ownerEoloPonting,
  ownerHubertRossen, ownerMackaillynGunst, ownerOlesCarchidi, ownerRocklandHagemann,
  ownerRollandBasye, ownerSaarBoileau,
  ownerSpeeroHarriage,
} from '@/mocks/owners';

export const characterEldridge = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerSpeeroHarriage),
  mockRights(ownerSpeeroHarriage),
  {
    ...makeId({
      id: CharacterId.cast('L2'),
      idp: ownerSpeeroHarriage.idp,
    }),
    description: 'Eldridge',
    gameSystem: makeRef(gameSystemWorldOfDarkness),
    fullName: 'Eldridge',
    bio: 'He\' quiet, sarcastic amd sometimes spaces out',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 121],
        [makeRef(fungibleCurrencyDollars), 409],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('S0'), 'modern', 'common')),
        makeRef(nonFungibleSmartphone(NonFungibleResourceId.cast('_s'))),
        makeRef(nonFungibleCreditCard(NonFungibleResourceId.cast('ms'))),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('_U'), 'modern', 'slicing', 'single')),
      ],
    },
    modifierCards: [],
  },
);
export const characterDexterNibley = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerAbdelrahmanThornes),
  mockRights(ownerAbdelrahmanThornes),
  {
    ...makeId({
      id: CharacterId.cast('Sp'),
      idp: ownerAbdelrahmanThornes.idp,
    }),
    description: 'Dexter Nibley',
    gameSystem: makeRef(gameSystemWorldOfDarkness),
    fullName: 'Dexter Nibley',
    bio: 'He is almost always sleepy',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 118],
        [makeRef(fungibleCurrencyDollars), 735],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('YP'), 'modern', 'common')),
        makeRef(nonFungibleSmartphone(NonFungibleResourceId.cast('s8'))),
        makeRef(nonFungibleCreditCard(NonFungibleResourceId.cast('Qx'))),
        makeRef(nonFungibleBandages(NonFungibleResourceId.cast('C_'))),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('r_'), 'modern', 'piercing', 'single')),
      ],
    },
    modifierCards: [],
  },
);
export const characterHarper = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerRollandBasye),
  mockRights(ownerRollandBasye),
  {
    ...makeId({
      id: CharacterId.cast('Qj'),
      idp: ownerRollandBasye.idp,
    }),
    description: 'Harper',
    gameSystem: makeRef(gameSystemWorldOfDarkness),
    fullName: 'Harper',
    bio: 'He owns a private library',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 2],
        [makeRef(fungibleCurrencyDollars), 427],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('2-'), 'modern', 'common')),
        makeRef(nonFungibleSmartphone(NonFungibleResourceId.cast('gE'))),
        makeRef(nonFungibleCreditCard(NonFungibleResourceId.cast('ma'))),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('Jb'), 'modern', 'bludgeoning', 'single')),
      ],
    },
    modifierCards: [],
  },
);

export const characterKismet = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerHubertRossen),
  mockRights(ownerHubertRossen),
  {
    ...makeId({
      id: CharacterId.cast('e7'),
      idp: ownerHubertRossen.idp,
    }),
    description: 'Kismet',
    gameSystem: makeRef(gameSystemGeneric),
    fullName: 'Kismet',
    bio: 'She primarily uses salves and bandages to heal',
    resources: {
      fungibles: [[makeRef(fungibleDownTimeDays), 118]],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('F4'), 'medieval', 'common')),
        makeRef(nonFungibleBandages(NonFungibleResourceId.cast('C_'))),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('_U'), 'medieval', 'slicing', 'single')),
      ],
    },
    modifierCards: [],
  },
);
export const characterFennel = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerSpeeroHarriage),
  mockRights(ownerSpeeroHarriage),
  {
    ...makeId({
      id: CharacterId.cast('1S'),
      idp: ownerSpeeroHarriage.idp,
    }),
    description: 'Fennel',
    gameSystem: makeRef(gameSystemGeneric),
    fullName: 'Fennel',
    bio: 'He specializes in locating artifacts',
    resources: {
      fungibles: [[makeRef(fungibleDownTimeDays), 28]],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('O9'), 'medieval', 'fancy')),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('aB'), 'medieval', 'energetic', 'burst')),
      ],
    },
    modifierCards: [],
  },
);
export const characterGael = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerAbdelrahmanThornes),
  mockRights(ownerAbdelrahmanThornes),
  {
    ...makeId({
      id: CharacterId.cast('f0'),
      idp: ownerAbdelrahmanThornes.idp,
    }),
    description: 'Gael',
    gameSystem: makeRef(gameSystemGeneric),
    fullName: 'Gael',
    bio: 'He runs a band of mercenaries',
    resources: {
      fungibles: [[makeRef(fungibleDownTimeDays), 12]],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('az'), 'medieval', 'common')),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('_A'), 'medieval', 'slicing', 'single')),
      ],
    },
    modifierCards: [],
  },
);
export const characterMarvinRevanoire = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerSaarBoileau),
  mockRights(ownerSaarBoileau),
  {
    ...makeId({
      id: CharacterId.cast('3r'),
      idp: ownerSaarBoileau.idp,
    }),
    description: 'Marvin Revanoire',
    gameSystem: makeRef(gameSystemGeneric),
    fullName: 'Marvin Revanoire',
    bio: 'He is from out of town',
    resources: {
      fungibles: [[makeRef(fungibleDownTimeDays), 101]],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('N8'), 'medieval', 'common')),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('PD'), 'medieval', 'piercing', 'burst')),
      ],
    },
    modifierCards: [],
  },
);
export const characterBobbyBounty = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerRollandBasye),
  mockRights(ownerRollandBasye),
  {
    ...makeId({
      id: CharacterId.cast('qx'),
      idp: ownerRollandBasye.idp,
    }),
    description: 'Bobby Bounty',
    gameSystem: makeRef(gameSystemGeneric),
    fullName: 'Bobby Bounty',
    bio: 'He speaks to animals like people',
    resources: {
      fungibles: [[makeRef(fungibleDownTimeDays), 41]],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('-d'), 'medieval', 'low')),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('-7'), 'medieval', 'bludgeoning', 'single')),
      ],
    },
    modifierCards: [],
  },
);

export const characterMaxHedgar = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerEoloPonting),
  mockRights(ownerEoloPonting),
  {
    ...makeId({
      id: CharacterId.cast('Mk'),
      idp: ownerEoloPonting.idp,
    }),
    description: 'Max Hedgar',
    gameSystem: makeRef(gameSystemDungeonAndDragons5e),
    fullName: 'Max Hedgar',
    bio: 'He owns "The Squire\'s Sack Pub", a nice inn in the middle districts',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 84],
        [makeRef(fungibleCurrencyGold), 582],
      ],
      nonFungibles: [makeRef(nonFungibleClothes(NonFungibleResourceId.cast('cS'), 'medieval', 'fancy'))],
    },
    modifierCards: [],
  },
);
export const characterEsmeVance = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerMackaillynGunst),
  mockRights(ownerMackaillynGunst),
  {
    ...makeId({
      id: CharacterId.cast('7v'),
      idp: ownerMackaillynGunst.idp,
    }),
    description: 'Esme Vance',
    gameSystem: makeRef(gameSystemDungeonAndDragons5e),
    fullName: 'Esme Vance',
    bio: 'She owns "The Captain\'s Best Inn", a nice inn in the poor districts',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 82],
        [makeRef(fungibleCurrencyGold), 328],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('rZ'), 'medieval', 'common')),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('Y7'), 'medieval', 'slicing', 'single')),
      ],
    },
    modifierCards: [],
  },
);
export const characterErnesto = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerAbdelrahmanThornes),
  mockRights(ownerAbdelrahmanThornes),
  {
    ...makeId({
      id: CharacterId.cast('wq'),
      idp: ownerAbdelrahmanThornes.idp,
    }),
    description: 'Ernesto',
    gameSystem: makeRef(gameSystemDungeonAndDragons5e),
    fullName: 'Ernesto',
    bio: 'He owns "The Farmer\'s Best Tavern", a booming inn in the upper districts',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 102],
        [makeRef(fungibleCurrencyGold), 547],
      ],
      nonFungibles: [makeRef(nonFungibleClothes(NonFungibleResourceId.cast('ZB'), 'medieval', 'fancy'))],
    },
    modifierCards: [],
  },
);

export const characterLukaRush = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerRocklandHagemann),
  mockRights(ownerRocklandHagemann),
  {
    ...makeId({
      id: CharacterId.cast('l4'),
      idp: ownerRocklandHagemann.idp,
    }),
    description: 'Luka Rush',
    gameSystem: makeRef(gameSystemTravellers),
    fullName: 'Luka Rush',
    bio: 'He owns the "Alpha Centaury Exchange", a high traffic trading company in the local cluster',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 109],
        [makeRef(fungibleCurrencyCredits), 949],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('4H'), 'futuristic', 'fancy')),
        makeRef(nonFungibleCreditChip(NonFungibleResourceId.cast('88'))),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('Li'), 'futurist', 'energetic', 'burst')),
      ],
    },
    modifierCards: [],
  },
);
export const characterPimVindicar = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerAbdulSalamKowalowski),
  mockRights(ownerAbdulSalamKowalowski),
  {
    ...makeId({
      id: CharacterId.cast('BP'),
      idp: ownerAbdulSalamKowalowski.idp,
    }),
    description: 'Pim Vindicar',
    gameSystem: makeRef(gameSystemTravellers),
    fullName: 'Pim Vindicar',
    bio: 'He smuggles weapons',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 22],
        [makeRef(fungibleCurrencyCredits), 826],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('SZ'), 'futuristic', 'common')),
        makeRef(nonFungibleCreditChip(NonFungibleResourceId.cast('88'))),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('Hs'), 'futurist', 'energetic', 'auto')),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('PE'), 'futurist', 'explosive', 'single')),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('M5'), 'medieval', 'slicing', 'single')),
      ],
    },
    modifierCards: [],
  },
);
export const characterRyleeBelgrave = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerOlesCarchidi),
  mockRights(ownerOlesCarchidi),
  {
    ...makeId({
      id: CharacterId.cast('Ki'),
      idp: ownerOlesCarchidi.idp,
    }),
    description: 'Rylee Belgrave',
    gameSystem: makeRef(gameSystemTravellers),
    fullName: 'Rylee Belgrave',
    bio: 'She\'s a chemist whom specializes in narcotics',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 24],
        [makeRef(fungibleCurrencyCredits), 945],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('Vm'), 'futuristic', 'common')),
        makeRef(nonFungibleCreditChip(NonFungibleResourceId.cast('88'))),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('_G'), 'futurist', 'explosive', 'single')),
      ],
    },
    modifierCards: [],
  },
);
export const characterAnsley = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerEoloPonting),
  mockRights(ownerEoloPonting),
  {
    ...makeId({
      id: CharacterId.cast('OX'),
      idp: ownerEoloPonting.idp,
    }),
    description: 'Ansley',
    gameSystem: makeRef(gameSystemTravellers),
    fullName: 'Ansley',
    bio: 'She works at the Alpha Cluster Bank',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 65],
        [makeRef(fungibleCurrencyCredits), 8],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('M7'), 'futuristic', 'fancy')),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('mw'), 'futurist', 'slicing', 'single')),
      ],
    },
    modifierCards: [],
  },
);

export const characterClementBrady = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerAbdulSalamKowalowski),
  mockRights(ownerAbdulSalamKowalowski),
  {
    ...makeId({
      id: CharacterId.cast('_A'),
      idp: ownerAbdulSalamKowalowski.idp,
    }),
    description: 'Clement Brady',
    gameSystem: makeRef(gameSystemDungeonAndDragons5e),
    fullName: 'Clement Brady',
    bio: 'He works out of the rich districts',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 97],
        [makeRef(fungibleCurrencyGold), 451],
      ],
      nonFungibles: [makeRef(nonFungibleClothes(NonFungibleResourceId.cast('05'), 'medieval', 'fancy'))],
    },
    modifierCards: [],
  },
);
export const characterIrvin = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerRocklandHagemann),
  mockRights(ownerRocklandHagemann),
  {
    ...makeId({
      id: CharacterId.cast('2D'),
      idp: ownerRocklandHagemann.idp,
    }),
    description: 'Irvin',
    gameSystem: makeRef(gameSystemDungeonAndDragons5e),
    fullName: 'Irvin',
    bio: 'He fights for a private mercenary company as a swordsman',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 66],
        [makeRef(fungibleCurrencyGold), 948],
      ],
      nonFungibles: [makeRef(nonFungibleClothes(NonFungibleResourceId.cast('DM'), 'medieval', 'common'))],
    },
    modifierCards: [],
  },
);
export const characterDarronKingsley = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerOlesCarchidi),
  mockRights(ownerOlesCarchidi),
  {
    ...makeId({
      id: CharacterId.cast('FL'),
      idp: ownerOlesCarchidi.idp,
    }),
    description: 'Darron Kingsley',
    gameSystem: makeRef(gameSystemDungeonAndDragons5e),
    fullName: 'Darron Kingsley',
    bio: 'He clothes dames and dukes',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 70],
        [makeRef(fungibleCurrencyGold), 48],
      ],
      nonFungibles: [makeRef(nonFungibleClothes(NonFungibleResourceId.cast('C4'), 'medieval', 'fancy'))],
    },
    modifierCards: [],
  },
);
export const characterRanaSmallwood = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerEoloPonting),
  mockRights(ownerEoloPonting),
  {
    ...makeId({
      id: CharacterId.cast('m6'),
      idp: ownerEoloPonting.idp,
    }),
    description: 'Rana Smallwood',
    gameSystem: makeRef(gameSystemDungeonAndDragons5e),
    fullName: 'Rana Smallwood',
    bio: 'She belongs to a house known for it\'s fine art',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 93],
        [makeRef(fungibleCurrencyGold), 412],
      ],
      nonFungibles: [makeRef(nonFungibleClothes(NonFungibleResourceId.cast('4A'), 'medieval', 'fancy'))],
    },
    modifierCards: [],
  },
);

export const characterDorotheaAshenwind = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerMackaillynGunst),
  mockRights(ownerMackaillynGunst),
  {
    ...makeId({
      id: CharacterId.cast('ax'),
      idp: ownerMackaillynGunst.idp,
    }),
    description: 'Dorothea Ashenwind',
    gameSystem: makeRef(gameSystemWorldOfDarkness),
    fullName: 'Dorothea Ashenwind',
    bio: 'She\'s a barmaid whom always hums a song',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 39],
        [makeRef(fungibleCurrencyDollars), 230],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('aX'), 'modern', 'low')),
        makeRef(nonFungibleCreditCard(NonFungibleResourceId.cast('wE'))),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('s6'), 'modern', 'piercing', 'burst')),
      ],
    },
    modifierCards: [],
  },
);
export const characterCedricWend = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerAbdelrahmanThornes),
  mockRights(ownerAbdelrahmanThornes),
  {
    ...makeId({
      id: CharacterId.cast('A0'),
      idp: ownerAbdelrahmanThornes.idp,
    }),
    description: 'Cedric Wend',
    gameSystem: makeRef(gameSystemWorldOfDarkness),
    fullName: 'Cedric Wend',
    bio: 'He\'s a standing bass player in a jazz band',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 79],
        [makeRef(fungibleCurrencyDollars), 189],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('w0'), 'modern', 'low')),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('lt'), 'modern', 'piercing', 'auto')),
      ],
    },
    modifierCards: [],
  },
);
export const characterAltheaEckstrom = mockEntity<CharacterEntity>(
  mockMeta('CharacterEntity', ownerAbdelrahmanThornes),
  mockRights(ownerAbdelrahmanThornes),
  {
    ...makeId({
      id: CharacterId.cast('Kr'),
      idp: ownerAbdelrahmanThornes.idp,
    }),
    description: 'Althea Eckstrom',
    gameSystem: makeRef(gameSystemWorldOfDarkness),
    fullName: 'Althea Eckstrom',
    bio: 'She works as the manager for "The M" jazz band',
    resources: {
      fungibles: [
        [makeRef(fungibleDownTimeDays), 38],
        [makeRef(fungibleCurrencyDollars), 376],
      ],
      nonFungibles: [
        makeRef(nonFungibleClothes(NonFungibleResourceId.cast('79'), 'modern', 'common')),
        makeRef(nonFungibleCreditCard(NonFungibleResourceId.cast('9s'))),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('0q'), 'modern', 'piercing', 'single')),
        makeRef(nonFungibleWeapon(NonFungibleResourceId.cast('w2'), 'modern', 'piercing', 'auto')),
      ],
    },
    modifierCards: [],
  },
);


export const characters = [
  characterEldridge,
  characterDexterNibley,
  characterHarper,
  characterKismet,
  characterFennel,
  characterGael,
  characterMarvinRevanoire,
  characterBobbyBounty,
  characterMaxHedgar,
  characterEsmeVance,
  characterErnesto,
  characterLukaRush,
  characterPimVindicar,
  characterRyleeBelgrave,
  characterAnsley,
  characterClementBrady,
  characterIrvin,
  characterDarronKingsley,
  characterRanaSmallwood,
  characterDorotheaAshenwind,
  characterCedricWend,
  characterAltheaEckstrom,
];
