import { faGlobeAfrica, faGlobeAmericas, faGlobeAsia, faGlobeEurope } from '@fortawesome/pro-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import { makeId, makeRef, PartitionId } from '@/store/core-types';
import { mockEntity, mockMeta, mockRights } from '@/store/mocks/mocking';
import { mockRightsPublic, ownerJohn, ownerPeter } from '@/store/mocks/owners';
import type { CampaignEntity } from '@/store/business-types';
import { CampaignId } from '@/store/business-types';
import { genericGameSystem } from '@/store/mocks/gameSystems';

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

export const campaignLoremIpsum = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerJohn),
  mockRightsPublic(ownerJohn),
  {
    ...(makeId({
      id: CampaignId.cast('aEf'),
      idp: PartitionId.cast('aEf'),
    })),
    description: 'Lorem Ipsum',
    gameSystem: makeRef(genericGameSystem),
    icon: randomGlobeIcon(),
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignDolorSitAmet = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerJohn),
  mockRights(ownerJohn),
  {
    ...(makeId({
      id: CampaignId.cast('9ge'),
      idp: PartitionId.cast('9ge'),
    })),
    description: 'Dolor Sit Amet',
    gameSystem: makeRef(genericGameSystem),
    icon: randomGlobeIcon(),
    actionCards: [],
    modifierCards: [],
  },
);
export const campaignConsecteturAdipiscingElit = mockEntity<CampaignEntity>(
  mockMeta('CampaignEntity', ownerPeter),
  mockRights(ownerPeter),
  {
    ...(makeId({
      id: CampaignId.cast('Sgt'),
      idp: PartitionId.cast('Sgt'),
    })),
    description: 'Consectetur Adipiscing Elit',
    gameSystem: makeRef(genericGameSystem),
    icon: randomGlobeIcon(),
    actionCards: [],
    modifierCards: [],
  },
);

export const campaigns = [
  campaignLoremIpsum,
  campaignDolorSitAmet,
  campaignConsecteturAdipiscingElit,
];
