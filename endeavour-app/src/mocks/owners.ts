import { Email, makeId, OwnershipId, PartitionId, Uri } from '@/stores/coreTypes';
import type { EntityRef, EntityRights, OwnershipEntity } from '@/stores/coreTypes';
import { mockMeta, mockRights } from '@/mocks/mocking';

const ownerSystemId = makeId({
  id: OwnershipId.cast('58A'),
  idp: PartitionId.cast('58A'),
});

/**
 * A meta owner representing the system itself.
 *
 * It is stored like all other owners to prevent the ID from getting subverted.
 */
export const ownerSystem: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', { ...ownerSystemId, summary: 'System' }),
  ...ownerSystemId,
  summary: 'System',
  fullName: 'System',
};

/**
 * A meta owner representing all owners in the system.
 *
 * It is stored like all other owners to prevent the ID from getting subverted.
 */
export const ownerAll: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...makeId({
    id: OwnershipId.cast('EBd'),
    idp: PartitionId.cast('EBd'),
  }),
  summary: 'All Users',
  fullName: 'All Users',
};

/**
 * A generic publisher owner to stand-in until publishers are added to the app.
 */
export const ownerGenericPublisher: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('C0L'),
    idp: PartitionId.cast('C0L'),
  })),
  summary: 'Generic Publisher',
  fullName: 'Generic Publisher',
};

export const ownerHubertRossen: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('pxb'),
    idp: PartitionId.cast('pxb'),
  })),
  summary: 'Hubert Rossen',
  fullName: 'Hubert Rossen',
};

export const ownerRocklandHagemann: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('896'),
    idp: PartitionId.cast('896'),
  })),
  summary: 'Rockland Hagemann',
  fullName: 'Rockland Hagemann',
};

export const ownerAbdulSalamKowalowski: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('823'),
    idp: PartitionId.cast('823'),
  })),
  summary: 'Abdul Salam Kowalowski',
  fullName: 'Abdul Salam Kowalowski',
  email: Email.cast('mock.abdulsako@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/7c19517e3ab2bb15d7f98d93f2c116ef?d=identicon'),
};

export const ownerSpeeroHarriage: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('91b'),
    idp: PartitionId.cast('91b'),
  })),
  summary: 'Speero Harriage',
  fullName: 'Speero Harriage',
  picture: Uri.cast('https://www.gravatar.com/avatar/6e97c8e1001685f10aa63db0dd13192a?d=identicon'),
};

export const ownerEoloPonting: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('560'),
    idp: PartitionId.cast('560'),
  })),
  summary: 'Eolo Ponting',
  fullName: 'Eolo Ponting',
  email: Email.cast('mock.eolopo@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/0b86ac508753a978132ed7abe2754f91?d=identicon'),
};

export const ownerRollandBasye: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('94a'),
    idp: PartitionId.cast('94a'),
  })),
  summary: 'Rolland Basye',
  fullName: 'Rolland Basye',
  email: Email.cast('mock.rollandba@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/3bfee221618d38eaed023132c6b5b656?d=identicon'),
};

export const ownerAbdelrahmanThornes: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('e51'),
    idp: PartitionId.cast('e51'),
  })),
  summary: 'Abdelrahman Thornes',
  fullName: 'Abdelrahman Thornes',
  email: Email.cast('mock.abdelrahmanth@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/95a53d0cf6809196911fdd32c111f476?d=identicon'),
};

export const ownerSaarBoileau: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('5bc'),
    idp: PartitionId.cast('5bc'),
  })),
  summary: 'Saar Boileau',
  fullName: 'Saar Boileau',
  email: Email.cast('mock.saarbo@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/bd6f7915fd0c7b29e7d12c0f6799dced?d=identicon'),
};

export const ownerMackaillynGunst: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('65e'),
    idp: PartitionId.cast('65e'),
  })),
  summary: 'Mackaillyn Gunst',
  fullName: 'Mackaillyn Gunst',
  email: Email.cast('mock.mackaillyngu@endeavourapp.io'),
  picture: Uri.cast('https://www.gravatar.com/avatar/8dd3f79f68716975316aa76e250dd3f7?d=identicon'),
};

export const ownerBartelMaldenado: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('6d8'),
    idp: PartitionId.cast('6d8'),
  })),
  summary: 'Bartel Maldenado',
  fullName: 'Bartel Maldenado',
};

export const ownerOlesCarchidi: OwnershipEntity = {
  ...mockMeta('OwnershipEntity', ownerSystem),
  ...(makeId({
    id: OwnershipId.cast('e27'),
    idp: PartitionId.cast('e27'),
  })),
  summary: 'Oles Carchidi',
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
