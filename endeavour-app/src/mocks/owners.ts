import { Email, makeId, OwnershipId, PartitionId, Uri } from '@/stores/core-types';
import type { EntityRef, EntityRights, OwnershipEntity, OwnershipMeta } from '@/stores/core-types';
import { mockRights } from '@/mocks/mocking';

function mockMeta(): OwnershipMeta {
  return {
    schemaVersion: 1,
    createdOn: new Date().toJSON(),
    modifiedOn: new Date().toJSON(),
  };
}

/**
 * A meta owner representing all owners in the system.
 *
 * It is stored like all other owners to prevent the ID from getting subverted.
 */
export const ownerAll: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('EBd'),
    idp: PartitionId.cast('EBd'),
  })),
  description: 'All Users',
  fullName: 'All Users',
};

/**
 * A generic publisher owner to stand-in until publishers are added to the app.
 */
export const ownerGenericPublisher: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('C0L'),
    idp: PartitionId.cast('C0L'),
  })),
  description: 'Generic Publisher',
  fullName: 'Generic Publisher',
};

export const ownerHubertRossen: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('pxb'),
    idp: PartitionId.cast('pxb'),
  })),
  description: 'Hubert Rossen',
  fullName: 'Hubert Rossen',
};

export const ownerRocklandHagemann: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('896'),
    idp: PartitionId.cast('896'),
  })),
  description: 'Rockland Hagemann',
  fullName: 'Rockland Hagemann',
};

export const ownerAbdulSalamKowalowski: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('823'),
    idp: PartitionId.cast('823'),
  })),
  description: 'Abdul Salam Kowalowski',
  fullName: 'Abdul Salam Kowalowski',
  email: Email.cast('mock.abdulsako@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/7c19517e3ab2bb15d7f98d93f2c116ef?d=identicon'),
};

export const ownerSpeeroHarriage: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('91b'),
    idp: PartitionId.cast('91b'),
  })),
  description: 'Speero Harriage',
  fullName: 'Speero Harriage',
  picture: Uri.cast('https://www.gravatar.com/avatar/6e97c8e1001685f10aa63db0dd13192a?d=identicon'),
};

export const ownerEoloPonting: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('560'),
    idp: PartitionId.cast('560'),
  })),
  description: 'Eolo Ponting',
  fullName: 'Eolo Ponting',
  email: Email.cast('mock.eolopo@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/0b86ac508753a978132ed7abe2754f91?d=identicon'),
};

export const ownerRollandBasye: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('94a'),
    idp: PartitionId.cast('94a'),
  })),
  description: 'Rolland Basye',
  fullName: 'Rolland Basye',
  email: Email.cast('mock.rollandba@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/3bfee221618d38eaed023132c6b5b656?d=identicon'),
};

export const ownerAbdelrahmanThornes: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('e51'),
    idp: PartitionId.cast('e51'),
  })),
  description: 'Abdelrahman Thornes',
  fullName: 'Abdelrahman Thornes',
  email: Email.cast('mock.abdelrahmanth@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/95a53d0cf6809196911fdd32c111f476?d=identicon'),
};

export const ownerSaarBoileau: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('5bc'),
    idp: PartitionId.cast('5bc'),
  })),
  description: 'Saar Boileau',
  fullName: 'Saar Boileau',
  email: Email.cast('mock.saarbo@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/bd6f7915fd0c7b29e7d12c0f6799dced?d=identicon'),
};

export const ownerMackaillynGunst: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('65e'),
    idp: PartitionId.cast('65e'),
  })),
  description: 'Mackaillyn Gunst',
  fullName: 'Mackaillyn Gunst',
  email: Email.cast('mock.mackaillyngu@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/8dd3f79f68716975316aa76e250dd3f7?d=identicon'),
};

export const ownerBartelMaldenado: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('6d8'),
    idp: PartitionId.cast('6d8'),
  })),
  description: 'Bartel Maldenado',
  fullName: 'Bartel Maldenado',
};

export const ownerOlesCarchidi: OwnershipEntity = {
  ...mockMeta(),
  ...(makeId({
    id: OwnershipId.cast('e27'),
    idp: PartitionId.cast('e27'),
  })),
  description: 'Oles Carchidi',
  fullName: 'Oles Carchidi',
  email: Email.cast('mock.olesca@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/b861c8f173aa388536465b3e94ae2183?d=identicon'),
};

export const owners = [
  ownerAll,
  ownerGenericPublisher,
  ownerHubertRossen,
  ownerRocklandHagemann,
  ownerAbdulSalamKowalowski,
  ownerSpeeroHarriage,
  ownerEoloPonting,
  ownerRollandBasye,
  ownerAbdelrahmanThornes,
  ownerSaarBoileau,
  ownerMackaillynGunst,
  ownerBartelMaldenado,
  ownerOlesCarchidi,
];

export function mockRightsPublic(owner: EntityRef<OwnershipId>): EntityRights {
  return mockRights(owner, [[ownerAll, ['read']]]);
}
