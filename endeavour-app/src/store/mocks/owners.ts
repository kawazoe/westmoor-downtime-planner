import { Email, makeId, OwnershipId, PartitionId, Uri } from '@/store/core-types';
import type { EntityRef, EntityRights, OwnershipEntity } from '@/store/core-types';
import { mockRights } from '@/store/mocks/mocking';

export const ownerAll: OwnershipEntity = {
  ...(makeId({
    id: OwnershipId.cast('EBd'),
    idp: PartitionId.cast('EBd'),
  })),
  description: 'All Users',
  fullName: 'All Users',
};

export const ownerJohn: OwnershipEntity = {
  ...(makeId({
    id: OwnershipId.cast('fu1'),
    idp: PartitionId.cast('fu1'),
  })),
  description: 'John Doe',
  fullName: 'John Doe',
  email: Email.cast('john.doe@example.com'),
  picture: Uri.cast('https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/John_Doe%2C_born_John_Nommensen_Duchac.jpg/220px-John_Doe%2C_born_John_Nommensen_Duchac.jpg'),
};

export const ownerPeter: OwnershipEntity = {
  ...(makeId({
    id: OwnershipId.cast('lFH'),
    idp: PartitionId.cast('lFH'),
  })),
  description: 'Peter Parker',
  fullName: 'Peter Parker',
  email: Email.cast('peter.parker@example.com'),
  picture: Uri.cast('https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Peter_Parker_%28physician%29_in_the_1860s%2C_from_-_Hon._Parker_-_NARA_-_528706_%28cropped%29.jpg/220px-Peter_Parker_%28physician%29_in_the_1860s%2C_from_-_Hon._Parker_-_NARA_-_528706_%28cropped%29.jpg'),
};

export const owners = [
  ownerAll,
  ownerJohn,
  ownerPeter,
];

export function mockRightsPublic(owner: EntityRef<OwnershipId>): EntityRights {
  return mockRights(owner, [[ownerAll, ['read']]]);
}
