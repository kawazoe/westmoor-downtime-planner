import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import type { Brand, Iron } from '@/lib/branding';
import { _throw } from '@/lib/_throw';
import { brand } from '@/lib/branding';

export type Uuid = Brand<string, 'Uuid'>;
const uuidRegex = /^[0-9A-Za-z_-]{1,5}$/;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Uuid = brand((v: string): v is Uuid => uuidRegex.test(v));

export type PartitionId = Brand<string, 'PartitionId'>;
const partitionIdRegex = /^[0-9A-Za-z_-]{1,7}$/;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PartitionId = brand((v: string): v is PartitionId => partitionIdRegex.test(v));

export type CombinedId = Brand<string, 'CombinedId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CombinedId = brand((v: string): v is CombinedId => {
  const [idp, id] = splitCidSafe(v as CombinedId, Uuid);
  return idp !== undefined && id !== undefined;
});

// TODO: maintain this list dynamically
const cidSplits = [
  undefined, //< undefined
  undefined, //< undefined
  1,         //< 1:1
  2,         //< 2:1
  3,         //< 3:1
  3,         //< 3:2
  3,         //< 3:3
  4,         //< 4:3
  4,         //< 4:4
  5,         //< 5:4
  6,         //< 6:4
  6,         //< 6:5
  7,         //< 7:5
];

export function makeCid<TId>(entity: RawEntityId<TId>): CombinedId {
  return CombinedId.cast(`${entity.idp}${entity.id}`);
}
export function splitCid<TId extends string>(cid: CombinedId, idIron: Iron<string, TId>): [PartitionId, TId] {
  const index = cidSplits[cid.length] ?? _throw(() => new Error(`Invalid combined id. Unknown length: ${cid.length}.`));
  return [PartitionId.cast(cid.substring(0, index)), idIron.cast(cid.substring(index))];
}
export function splitCidSafe<TId extends string>(cid: CombinedId, idIron: Iron<string, TId>): [PartitionId | undefined, TId | undefined] | [] {
  const index = cidSplits[cid.length];
  return index === undefined
    ? []
    : [PartitionId.as(cid.substring(0, index)), idIron.as(cid.substring(index))];
}

export type OwnershipId = Brand<string, 'OwnershipId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OwnershipId = brand((v: string): v is OwnershipId => Uuid.is(v));

export type Uri = Brand<string, 'Uri'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Uri = brand((v: string): v is Uri => true);

export type Email = Brand<string, 'Email'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Email = brand((v: string): v is Email => true);

export interface RawEntityId<TId> {
  idp: PartitionId;
  id: TId;
}

export interface EntityId<TId> extends RawEntityId<TId> {
  cid: CombinedId;
}
export function makeId<TId>(rawId: RawEntityId<TId>): EntityId<TId> {
  return {
    ...rawId,
    cid: makeCid(rawId),
  };
}

export interface EntityRef<TId> extends EntityId<TId> {
  description: string;
  icon?: string | [string, string] | IconDefinition;
}

export function makeRef<TId>(entity: EntityRef<TId>): EntityRef<TId> {
  return {
    idp: entity.idp,
    id: entity.id,
    cid: entity.cid,
    description: entity.description,
    icon: entity.icon,
  };
}

export type OwnershipEntity = EntityRef<OwnershipId> & {
  fullName: string,
  picture?: Uri,
  email?: Email,
};

export const allRights = Object.freeze(['read', 'write', 'share', 'delete'] as const);
export type Right = typeof allRights[number];

export interface AccessControl {
  rights: readonly Right[];
}

export interface EntityRights {
  owner: EntityRef<OwnershipId>;
  sharedWith: (EntityRef<OwnershipId> & AccessControl)[];
}

export interface EntityMeta {
  schema: string;
  schemaVersion: number;

  created: {
    by: EntityRef<OwnershipId>,
    on: string,
  };
  modified: {
    by: EntityRef<OwnershipId>,
    on: string,
  };

  metas: Record<string, unknown>;
}

export interface RestData<T> {
  data: T[];
}
export interface OffsetedRestData<T> extends RestData<T> {
  offset: number;
  limit: number;
}
export interface PagedRestData<T> extends RestData<T>  {
  page: number;
  pageSize: number;
}
export interface TokenedRestData<T> extends RestData<T>  {
  token: Uuid;
}
