import { campaignConsecteturAdipiscingElit, campaignDolorSitAmet, campaignLoremIpsum } from '@/store/mocks/campaigns';
import { characterBatMan, characterIronMan } from '@/store/mocks/characters';
import { makeId, makeRef } from '@/store/core-types';
import { mockEntity, mockMeta, mockRights } from '@/store/mocks/mocking';
import { ownerJohn, ownerPeter } from '@/store/mocks/owners';
import type { PlayerEntity, SubscriptionEntity } from '@/store/business-types';
import { PlayerId, SubscriptionId } from '@/store/business-types';

const subscriptionJohn = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerJohn),
  {
    ...makeId({
      id: SubscriptionId.cast('W9'),
      idp: ownerJohn.idp,
    }),
    description: 'Annual Subscription',
  },
);

const subscriptionPeter = mockEntity<SubscriptionEntity>(
  mockMeta('SubscriptionEntity', ownerJohn),
  {
    ...makeId({
      id: SubscriptionId.cast('D6'),
      idp: ownerPeter.idp,
    }),
    description: 'Annual Subscription',
  },
);

export const playerJohn = mockEntity<PlayerEntity>(
  mockMeta('PlayerEntity', ownerJohn),
  mockRights(ownerJohn),
  {
    ...makeId({
      id: PlayerId.cast(ownerJohn.id),
      idp: ownerJohn.idp,
    }),
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
  mockMeta('PlayerEntity', ownerPeter),
  mockRights(ownerPeter),
  {
    ...makeId({
      id: PlayerId.cast(ownerPeter.id),
      idp: ownerPeter.idp,
    }),
    description: ownerPeter.description,
    icon: ownerPeter.icon,
    characters: [],
    campaigns: [
      makeRef(campaignDolorSitAmet),
      makeRef(campaignConsecteturAdipiscingElit),
    ],
    subscription: subscriptionPeter,
  },
);

export const players = [
  playerJohn,
  playerPeter,
];
