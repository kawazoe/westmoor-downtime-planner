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
    summary: 'Annual Subscription',
  },
);

const subscriptionRocklandHagemann = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerRocklandHagemann),
  {
    ...makeId({
      id: SubscriptionId.cast('4z'),
      idp: ownerRocklandHagemann.idp,
    }),
    summary: 'Annual Subscription',
  },
);

const subscriptionAbdulSalamKowalowski = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerAbdulSalamKowalowski),
  {
    ...makeId({
      id: SubscriptionId.cast('PL'),
      idp: ownerAbdulSalamKowalowski.idp,
    }),
    summary: 'Annual Subscription',
  },
);

const subscriptionSpeeroHarriage = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerSpeeroHarriage),
  {
    ...makeId({
      id: SubscriptionId.cast('-Y'),
      idp: ownerSpeeroHarriage.idp,
    }),
    summary: 'Annual Subscription',
  },
);

const subscriptionEoloPonting = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerEoloPonting),
  {
    ...makeId({
      id: SubscriptionId.cast('AB'),
      idp: ownerEoloPonting.idp,
    }),
    summary: 'Annual Subscription',
  },
);

const subscriptionRollandBasye = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerRollandBasye),
  {
    ...makeId({
      id: SubscriptionId.cast('7C'),
      idp: ownerRollandBasye.idp,
    }),
    summary: 'Annual Subscription',
  },
);

const subscriptionAbdelrahmanThornes = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerAbdelrahmanThornes),
  {
    ...makeId({
      id: SubscriptionId.cast('x3'),
      idp: ownerAbdelrahmanThornes.idp,
    }),
    summary: 'Annual Subscription',
  },
);

const subscriptionSaarBoileau = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerSaarBoileau),
  {
    ...makeId({
      id: SubscriptionId.cast('E7'),
      idp: ownerSaarBoileau.idp,
    }),
    summary: 'Annual Subscription',
  },
);

const subscriptionMackaillynGunst = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerMackaillynGunst),
  {
    ...makeId({
      id: SubscriptionId.cast('Ma'),
      idp: ownerMackaillynGunst.idp,
    }),
    summary: 'Annual Subscription',
  },
);

const subscriptionBartelMaldenado = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerBartelMaldenado),
  {
    ...makeId({
      id: SubscriptionId.cast('vm'),
      idp: ownerBartelMaldenado.idp,
    }),
    summary: 'Annual Subscription',
  },
);

const subscriptionOlesCarchidi = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerOlesCarchidi),
  {
    ...makeId({
      id: SubscriptionId.cast('JZ'),
      idp: ownerOlesCarchidi.idp,
    }),
    summary: 'Annual Subscription',
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
    summary: ownerHubertRossen.summary,
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
    summary: ownerRocklandHagemann.summary,
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
    summary: ownerAbdulSalamKowalowski.summary,
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
    summary: ownerSpeeroHarriage.summary,
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
    summary: ownerEoloPonting.summary,
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
    summary: ownerRollandBasye.summary,
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
    summary: ownerAbdelrahmanThornes.summary,
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
    summary: ownerSaarBoileau.summary,
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
    summary: ownerMackaillynGunst.summary,
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
    summary: ownerBartelMaldenado.summary,
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
    summary: ownerOlesCarchidi.summary,
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
