import {
  campaignAtlas, campaignBumpinInTheVoodoo,
  campaignCollageOfTheStorm, campaignDefinitionForbidden,
  campaignGhostData, campaignNewGamePlus,
  campaignNoTaker,
  campaignTheMMachine, campaignTiltedTowers, campaignTristram,
} from '@/mocks/campaigns';
import {
  characterAltheaEckstrom,
  characterAnsley,
  characterBobbyBounty, characterCedricWend, characterClementBrady, characterDarronKingsley,
  characterDexterNibley, characterDorotheaAshenwind,
  characterEldridge,
  characterErnesto,
  characterEsmeVance,
  characterFennel,
  characterGael,
  characterHarper, characterIrvin,
  characterKismet,
  characterLukaRush,
  characterMarvinRevanoire,
  characterMaxHedgar,
  characterPimVindicar, characterRanaSmallwood, characterRyleeBelgrave,
} from '@/mocks/characters';
import { makeId, makeRef } from '@/stores/coreTypes';
import { mockEntity, mockMeta, mockRights } from '@/mocks/mocking';
import {
  ownerAbdelrahmanThornes,
  ownerAbdulSalamKowalowski,
  ownerBartelMaldenado,
  ownerEoloPonting,
  ownerHubertRossen,
  ownerMackaillynGunst,
  ownerOlesCarchidi,
  ownerRocklandHagemann,
  ownerRollandBasye,
  ownerSaarBoileau,
  ownerSpeeroHarriage,
} from '@/mocks/owners';
import type { PlayerEntity, SubscriptionEntity } from '@/stores/businessTypes';
import { PlayerId, SubscriptionId } from '@/stores/businessTypes';

const subscriptionHubertRossen = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerHubertRossen),
  {
    ...makeId({
      id: SubscriptionId.cast('D6'),
      idp: ownerHubertRossen.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionRocklandHagemann = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerRocklandHagemann),
  {
    ...makeId({
      id: SubscriptionId.cast('4z'),
      idp: ownerRocklandHagemann.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionAbdulSalamKowalowski = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerAbdulSalamKowalowski),
  {
    ...makeId({
      id: SubscriptionId.cast('PL'),
      idp: ownerAbdulSalamKowalowski.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionSpeeroHarriage = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerSpeeroHarriage),
  {
    ...makeId({
      id: SubscriptionId.cast('-Y'),
      idp: ownerSpeeroHarriage.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionEoloPonting = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerEoloPonting),
  {
    ...makeId({
      id: SubscriptionId.cast('AB'),
      idp: ownerEoloPonting.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionRollandBasye = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerRollandBasye),
  {
    ...makeId({
      id: SubscriptionId.cast('7C'),
      idp: ownerRollandBasye.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionAbdelrahmanThornes = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerAbdelrahmanThornes),
  {
    ...makeId({
      id: SubscriptionId.cast('x3'),
      idp: ownerAbdelrahmanThornes.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionSaarBoileau = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerSaarBoileau),
  {
    ...makeId({
      id: SubscriptionId.cast('E7'),
      idp: ownerSaarBoileau.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionMackaillynGunst = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerMackaillynGunst),
  {
    ...makeId({
      id: SubscriptionId.cast('Ma'),
      idp: ownerMackaillynGunst.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionBartelMaldenado = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerBartelMaldenado),
  {
    ...makeId({
      id: SubscriptionId.cast('vm'),
      idp: ownerBartelMaldenado.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionOlesCarchidi = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerOlesCarchidi),
  {
    ...makeId({
      id: SubscriptionId.cast('JZ'),
      idp: ownerOlesCarchidi.idp,
    }),
    description: 'Annual Subscription',
  },
);

export const playerHubertRossen = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerHubertRossen),
  mockRights(ownerHubertRossen),
  {
    ...makeId({
      id: PlayerId.cast(ownerHubertRossen.id),
      idp: ownerHubertRossen.idp,
    }),
    description: ownerHubertRossen.description,
    icon: ownerHubertRossen.icon,
    characters: [makeRef(characterKismet)],
    campaigns: [
      makeRef(campaignGhostData),
      makeRef(campaignNoTaker),
    ],
    subscription: subscriptionHubertRossen,
  },
);

export const playerRocklandHagemann = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerRocklandHagemann),
  mockRights(ownerRocklandHagemann),
  {
    ...makeId({
      id: PlayerId.cast(ownerRocklandHagemann.id),
      idp: ownerRocklandHagemann.idp,
    }),
    description: ownerRocklandHagemann.description,
    icon: ownerRocklandHagemann.icon,
    characters: [
      makeRef(characterLukaRush),
      makeRef(characterIrvin),
    ],
    campaigns: [
      makeRef(campaignAtlas),
      makeRef(campaignCollageOfTheStorm),
      makeRef(campaignTristram),
      makeRef(campaignTiltedTowers),
      makeRef(campaignNewGamePlus),
    ],
    subscription: subscriptionRocklandHagemann,
  },
);

export const playerAbdulSalamKowalowski = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerAbdulSalamKowalowski),
  mockRights(ownerAbdulSalamKowalowski),
  {
    ...makeId({
      id: PlayerId.cast(ownerAbdulSalamKowalowski.id),
      idp: ownerAbdulSalamKowalowski.idp,
    }),
    description: ownerAbdulSalamKowalowski.description,
    icon: ownerAbdulSalamKowalowski.icon,
    characters: [
      makeRef(characterPimVindicar),
      makeRef(characterClementBrady),
    ],
    campaigns: [],
    subscription: subscriptionAbdulSalamKowalowski,
  },
);

export const playerSpeeroHarriage = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerSpeeroHarriage),
  mockRights(ownerSpeeroHarriage),
  {
    ...makeId({
      id: PlayerId.cast(ownerSpeeroHarriage.id),
      idp: ownerSpeeroHarriage.idp,
    }),
    description: ownerSpeeroHarriage.description,
    icon: ownerSpeeroHarriage.icon,
    characters: [
      makeRef(characterEldridge),
      makeRef(characterFennel),
    ],
    campaigns: [],
    subscription: subscriptionSpeeroHarriage,
  },
);

export const playerEoloPonting = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerEoloPonting),
  mockRights(ownerEoloPonting),
  {
    ...makeId({
      id: PlayerId.cast(ownerEoloPonting.id),
      idp: ownerEoloPonting.idp,
    }),
    description: ownerEoloPonting.description,
    icon: ownerEoloPonting.icon,
    characters: [
      makeRef(characterMaxHedgar),
      makeRef(characterAnsley),
      makeRef(characterRanaSmallwood),
    ],
    campaigns: [makeRef(campaignTheMMachine)],
    subscription: subscriptionEoloPonting,
  },
);

export const playerRollandBasye = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerRollandBasye),
  mockRights(ownerRollandBasye),
  {
    ...makeId({
      id: PlayerId.cast(ownerRollandBasye.id),
      idp: ownerRollandBasye.idp,
    }),
    description: ownerRollandBasye.description,
    icon: ownerRollandBasye.icon,
    characters: [
      makeRef(characterHarper),
      makeRef(characterBobbyBounty),
    ],
    campaigns: [],
    subscription: subscriptionRollandBasye,
  },
);

export const playerAbdelrahmanThornes = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerAbdelrahmanThornes),
  mockRights(ownerAbdelrahmanThornes),
  {
    ...makeId({
      id: PlayerId.cast(ownerAbdelrahmanThornes.id),
      idp: ownerAbdelrahmanThornes.idp,
    }),
    description: ownerAbdelrahmanThornes.description,
    icon: ownerAbdelrahmanThornes.icon,
    characters: [
      makeRef(characterDexterNibley),
      makeRef(characterGael),
      makeRef(characterErnesto),
      makeRef(characterCedricWend),
      makeRef(characterAltheaEckstrom),
    ],
    campaigns: [],
    subscription: subscriptionAbdelrahmanThornes,
  },
);

export const playerSaarBoileau = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerSaarBoileau),
  mockRights(ownerSaarBoileau),
  {
    ...makeId({
      id: PlayerId.cast(ownerSaarBoileau.id),
      idp: ownerSaarBoileau.idp,
    }),
    description: ownerSaarBoileau.description,
    icon: ownerSaarBoileau.icon,
    characters: [makeRef(characterMarvinRevanoire)],
    campaigns: [],
    subscription: subscriptionSaarBoileau,
  },
);

export const playerMackaillynGunst = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerMackaillynGunst),
  mockRights(ownerMackaillynGunst),
  {
    ...makeId({
      id: PlayerId.cast(ownerMackaillynGunst.id),
      idp: ownerMackaillynGunst.idp,
    }),
    description: ownerMackaillynGunst.description,
    icon: ownerMackaillynGunst.icon,
    characters: [
      makeRef(characterEsmeVance),
      makeRef(characterDorotheaAshenwind),
    ],
    campaigns: [
      makeRef(campaignBumpinInTheVoodoo),
      makeRef(campaignDefinitionForbidden),
    ],
    subscription: subscriptionMackaillynGunst,
  },
);

export const playerBartelMaldenado = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerBartelMaldenado),
  mockRights(ownerBartelMaldenado),
  {
    ...makeId({
      id: PlayerId.cast(ownerBartelMaldenado.id),
      idp: ownerBartelMaldenado.idp,
    }),
    description: ownerBartelMaldenado.description,
    icon: ownerBartelMaldenado.icon,
    characters: [],
    campaigns: [],
    subscription: subscriptionBartelMaldenado,
  },
);

export const playerOlesCarchidi = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerOlesCarchidi),
  mockRights(ownerOlesCarchidi),
  {
    ...makeId({
      id: PlayerId.cast(ownerOlesCarchidi.id),
      idp: ownerOlesCarchidi.idp,
    }),
    description: ownerOlesCarchidi.description,
    icon: ownerOlesCarchidi.icon,
    characters: [
      makeRef(characterRyleeBelgrave),
      makeRef(characterDarronKingsley),
    ],
    campaigns: [],
    subscription: subscriptionOlesCarchidi,
  },
);

export const players = [
  playerHubertRossen,
  playerRocklandHagemann,
  playerAbdulSalamKowalowski,
  playerSpeeroHarriage,
  playerEoloPonting,
  playerRollandBasye,
  playerAbdelrahmanThornes,
  playerSaarBoileau,
  playerMackaillynGunst,
  playerBartelMaldenado,
  playerOlesCarchidi,
];
