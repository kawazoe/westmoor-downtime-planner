import { _with } from '@/lib/_with';

import { mockEntity, mockMeta } from '@/store/mocks/mocking';
import { mockRightsPublic, ownerGenericPublisher } from '@/store/mocks/owners';
import type { NonFungibleResourceEntity, NonFungibleResourceId } from '@/store/business-types';
import { makeId } from '@/store/core-types';

function capitalize(str: string): string {
  return str.length > 1 ? str.substring(0, 1).toLocaleUpperCase() + str.substring(1) : str.toLocaleLowerCase();
}

export const nonFungibleResources: NonFungibleResourceEntity[] = [];
const addResource = _with((r: NonFungibleResourceEntity) => nonFungibleResources.push(r));

export function nonFungibleClothes(
  id: NonFungibleResourceId,
  era: 'medieval' | 'modern' | 'futuristic',
  grade: 'low' | 'common' | 'fancy',
): NonFungibleResourceEntity {
  return addResource(mockEntity<NonFungibleResourceEntity>(
    mockMeta('NonFungibleResourceEntity', ownerGenericPublisher),
    mockRightsPublic(ownerGenericPublisher),
    {
      ...makeId({
        id,
        idp: ownerGenericPublisher.idp,
      }),
      description: `${capitalize(era)} Clothes (${capitalize(grade)})`,
    },
  ));
}
export function nonFungibleSmartphone(id: NonFungibleResourceId): NonFungibleResourceEntity {
  return addResource(mockEntity<NonFungibleResourceEntity>(
    mockMeta('NonFungibleResourceEntity', ownerGenericPublisher),
    mockRightsPublic(ownerGenericPublisher),
    {
      ...makeId({
        id,
        idp: ownerGenericPublisher.idp,
      }),
      description: 'Smartphone',
    },
  ));
}
export function nonFungibleCreditCard(id: NonFungibleResourceId): NonFungibleResourceEntity {
  return addResource(mockEntity<NonFungibleResourceEntity>(
    mockMeta('NonFungibleResourceEntity', ownerGenericPublisher),
    mockRightsPublic(ownerGenericPublisher),
    {
      ...makeId({
        id,
        idp: ownerGenericPublisher.idp,
      }),
      description: 'Credit Card',
    },
  ));
}
export function nonFungibleCreditChip(id: NonFungibleResourceId): NonFungibleResourceEntity {
  return addResource(mockEntity<NonFungibleResourceEntity>(
    mockMeta('NonFungibleResourceEntity', ownerGenericPublisher),
    mockRightsPublic(ownerGenericPublisher),
    {
      ...makeId({
        id,
        idp: ownerGenericPublisher.idp,
      }),
      description: 'Credit Chip',
    },
  ));
}
export function nonFungibleBandages(id: NonFungibleResourceId): NonFungibleResourceEntity {
  return addResource(mockEntity<NonFungibleResourceEntity>(
    mockMeta('NonFungibleResourceEntity', ownerGenericPublisher),
    mockRightsPublic(ownerGenericPublisher),
    {
      ...makeId({
        id,
        idp: ownerGenericPublisher.idp,
      }),
      description: 'Bandages',
    },
  ));
}
export function nonFungibleWeapon(
  id: NonFungibleResourceId,
  era: 'medieval' | 'modern' | 'futurist',
  kind: 'slicing' | 'piercing' | 'bludgeoning' | 'explosive' | 'energetic',
  rate: 'single' | 'burst' | 'auto',
): NonFungibleResourceEntity {
  return addResource(mockEntity<NonFungibleResourceEntity>(
    mockMeta('NonFungibleResourceEntity', ownerGenericPublisher),
    mockRightsPublic(ownerGenericPublisher),
    {
      ...makeId({
        id,
        idp: ownerGenericPublisher.idp,
      }),
      description: `${capitalize(era)} ${capitalize(kind)} ${capitalize(rate)} Weapon`,
    },
  ));
}
