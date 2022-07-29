import type { FungibleResourceEntity } from '@/stores/businessTypes';
import { FungibleResourceId } from '@/stores/businessTypes';
import { makeId } from '@/stores/coreTypes';

import {
  gameSystemDungeonAndDragons5e,
  gameSystemGeneric,
  gameSystemTravellers,
  gameSystemWorldOfDarkness,
} from '@/mocks/gameSystems';
import { mockEntity, mockMeta } from '@/mocks/mocking';
import { mockRightsPublic, ownerGenericPublisher } from '@/mocks/owners';

export const fungibleDownTimeDays = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'currency', source: 'campaign' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('QS'),
      idp: gameSystemGeneric.idp,
    }),
    summary: 'Down Time (days)',
  },
);
export const fungibleCurrencyGold = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'currency', source: 'campaign' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('Y4'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    summary: 'Currency (gold)',
  },
);
export const fungibleAttributeStrength = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'attribute', source: 'game system' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('y9'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    summary: 'Strength',
  },
);
export const fungibleAttributeDexterity = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'attribute', source: 'game system' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('70'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    summary: 'Dexterity',
  },
);
export const fungibleAttributeConstitution = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'attribute', source: 'game system' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('4N'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    summary: 'Constitution',
  },
);
export const fungibleAttributeIntelligence = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'attribute', source: 'game system' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('92'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    summary: 'Intelligence',
  },
);
export const fungibleAttributeWisdom = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'attribute', source: 'game system' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('gF'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    summary: 'Wisdom',
  },
);
export const fungibleAttributeCharisma = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'attribute', source: 'game system' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('Av'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    summary: 'Charisma',
  },
);
export const fungibleSkillPerformance = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'skill', source: 'game system' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('53'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    summary: 'Performance',
  },
);
export const fungibleSkillStealth = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'skill', source: 'game system' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('a_'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    summary: 'Stealth',
  },
);
export const fungibleCurrencyDollars = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'currency', source: 'campaign' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('QG'),
      idp: gameSystemWorldOfDarkness.idp,
    }),
    summary: 'Currency ($)',
  },
);
export const fungibleCurrencyCredits = mockEntity<FungibleResourceEntity>(
  mockMeta('FungibleResourceEntity', ownerGenericPublisher, { tag: 'currency', source: 'campaign' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: FungibleResourceId.cast('TX'),
      idp: gameSystemTravellers.idp,
    }),
    summary: 'Currency (Credits)',
  },
);

export const fungibleResources = [
  fungibleDownTimeDays,
  fungibleCurrencyGold,
  fungibleAttributeStrength,
  fungibleAttributeDexterity,
  fungibleAttributeConstitution,
  fungibleAttributeIntelligence,
  fungibleAttributeWisdom,
  fungibleAttributeCharisma,
  fungibleSkillPerformance,
  fungibleSkillStealth,
  fungibleCurrencyDollars,
  fungibleCurrencyCredits,
];
