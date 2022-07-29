import { faGlobeAfrica, faGlobeAmericas, faGlobeAsia, faGlobeEurope } from '@fortawesome/pro-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import { makeId, makeRef, PartitionId } from '@/stores/coreTypes';
import type { CampaignEntity } from '@/stores/businessTypes';
import { CampaignId } from '@/stores/businessTypes';

import {
  characterAltheaEckstrom,
  characterAnsley,
  characterBobbyBounty, characterCedricWend, characterClementBrady, characterDarronKingsley,
  characterDexterNibley, characterDorotheaAshenwind,
  characterEldridge, characterErnesto, characterEsmeVance, characterFennel, characterGael,
  characterHarper, characterIrvin, characterKismet, characterLukaRush, characterMarvinRevanoire,
  characterMaxHedgar, characterPimVindicar, characterRanaSmallwood, characterRyleeBelgrave,
} from '@/mocks/characters';
import {
  gameSystemDungeonAndDragons5e,
  gameSystemGeneric,
  gameSystemTravellers,
  gameSystemWorldOfDarkness,
} from '@/mocks/gameSystems';
import { mockEntity, mockMeta, mockRights } from '@/mocks/mocking';
import {
  mockRightsPublic,
  ownerEoloPonting,
  ownerHubertRossen,
  ownerMackaillynGunst,
  ownerRocklandHagemann,
} from '@/mocks/owners';

export function randomGlobeIcon(): IconDefinition {
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

export const campaignGhostData = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerHubertRossen),
  mockRightsPublic(ownerHubertRossen),
  {
    ...(makeId({
      id: CampaignId.cast('aEf'),
      idp: PartitionId.cast('aEf'),
    })),
    summary: 'Ghost Data',
    icon: randomGlobeIcon(),
    gameSystem: makeRef(gameSystemWorldOfDarkness),
    characters: [
      makeRef(characterEldridge),
      makeRef(characterDexterNibley),
      makeRef(characterHarper),
    ],
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignNoTaker = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerHubertRossen),
  mockRights(ownerHubertRossen),
  {
    ...(makeId({
      id: CampaignId.cast('9ge'),
      idp: PartitionId.cast('9ge'),
    })),
    summary: 'NoTaker',
    icon: randomGlobeIcon(),
    gameSystem: makeRef(gameSystemGeneric),
    characters: [
      makeRef(characterKismet),
      makeRef(characterFennel),
      makeRef(characterGael),
      makeRef(characterMarvinRevanoire),
      makeRef(characterBobbyBounty),
    ],
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignTheMMachine = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerEoloPonting),
  mockRights(ownerEoloPonting),
  {
    ...(makeId({
      id: CampaignId.cast('Sgt'),
      idp: PartitionId.cast('Sgt'),
    })),
    summary: 'The M Machine',
    icon: randomGlobeIcon(),
    gameSystem: makeRef(gameSystemWorldOfDarkness),
    characters: [
      makeRef(characterDorotheaAshenwind),
      makeRef(characterCedricWend),
      makeRef(characterAltheaEckstrom),
    ],
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignAtlas = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerRocklandHagemann),
  mockRights(ownerRocklandHagemann),
  {
    ...(makeId({
      id: CampaignId.cast('PC3'),
      idp: PartitionId.cast('PC3'),
    })),
    summary: 'ATLAS',
    icon: randomGlobeIcon(),
    gameSystem: makeRef(gameSystemTravellers),
    characters: [
      makeRef(characterLukaRush),
      makeRef(characterPimVindicar),
      makeRef(characterRyleeBelgrave),
      makeRef(characterAnsley),
    ],
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignCollageOfTheStorm = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerRocklandHagemann),
  mockRights(ownerRocklandHagemann),
  {
    ...(makeId({
      id: CampaignId.cast('FVP'),
      idp: PartitionId.cast('FVP'),
    })),
    summary: 'Collage of the Storm',
    icon: randomGlobeIcon(),
    gameSystem: makeRef(gameSystemDungeonAndDragons5e),
    characters: [
      makeRef(characterIrvin),
      makeRef(characterClementBrady),
      makeRef(characterDarronKingsley),
      makeRef(characterRanaSmallwood),
    ],
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignTristram = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerRocklandHagemann),
  mockRights(ownerRocklandHagemann),
  {
    ...(makeId({
      id: CampaignId.cast('eYC'),
      idp: PartitionId.cast('eYC'),
    })),
    summary: 'Tristram',
    icon: randomGlobeIcon(),
    gameSystem: makeRef(gameSystemDungeonAndDragons5e),
    characters: [],
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignTiltedTowers = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerRocklandHagemann),
  mockRights(ownerRocklandHagemann),
  {
    ...(makeId({
      id: CampaignId.cast('Us1'),
      idp: PartitionId.cast('Us1'),
    })),
    summary: 'Tilted Towers',
    icon: randomGlobeIcon(),
    gameSystem: makeRef(gameSystemDungeonAndDragons5e),
    characters: [
      makeRef(characterMaxHedgar),
      makeRef(characterEsmeVance),
      makeRef(characterErnesto),
    ],
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignNewGamePlus = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerRocklandHagemann),
  mockRights(ownerRocklandHagemann),
  {
    ...(makeId({
      id: CampaignId.cast('2K3'),
      idp: PartitionId.cast('2K3'),
    })),
    summary: 'New Game +',
    icon: randomGlobeIcon(),
    gameSystem: makeRef(gameSystemGeneric),
    characters: [
      makeRef(characterFennel),
      makeRef(characterGael),
      makeRef(characterMarvinRevanoire),
    ],
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignBumpinInTheVoodoo = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerMackaillynGunst),
  mockRights(ownerMackaillynGunst),
  {
    ...(makeId({
      id: CampaignId.cast('nV0'),
      idp: PartitionId.cast('nV0'),
    })),
    summary: 'Bumpin\' in the Voodoo',
    icon: randomGlobeIcon(),
    gameSystem: makeRef(gameSystemGeneric),
    characters: [],
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignDefinitionForbidden = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerMackaillynGunst),
  mockRights(ownerMackaillynGunst),
  {
    ...(makeId({
      id: CampaignId.cast('P6k'),
      idp: PartitionId.cast('P6k'),
    })),
    summary: 'Definition Forbidden',
    icon: randomGlobeIcon(),
    gameSystem: makeRef(gameSystemWorldOfDarkness),
    characters: [],
    actionCards: [],
    modifierCards: [],
  },
);

export const campaigns = [
  campaignGhostData,
  campaignNoTaker,
  campaignTheMMachine,
  campaignAtlas,
  campaignCollageOfTheStorm,
  campaignTristram,
  campaignTiltedTowers,
  campaignNewGamePlus,
  campaignBumpinInTheVoodoo,
  campaignDefinitionForbidden,
];
