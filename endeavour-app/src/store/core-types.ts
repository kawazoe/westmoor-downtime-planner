import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import type { Brand, Iron } from '@/lib/branding';
import { _throw } from '@/lib/functional';
import { brand } from '@/lib/branding';

export type Uuid = Brand<string, 'Uuid'>;

const uuidRegex = /^[0-9A-Za-z_-]{10}$/.compile();
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Uuid = brand((v: string): v is Uuid => uuidRegex.test(v));

export type PartitionId = Brand<string, 'PartitionId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PartitionId = brand((v: string): v is PartitionId => Uuid.is(v));

export type OwnershipId = Brand<string, 'OwnershipId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OwnershipId = brand((v: string): v is OwnershipId => Uuid.is(v));

export type Uri = Brand<string, 'Uri'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Uri = brand((v: string): v is Uri => true);

export type Email = Brand<string, 'Email'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Email = brand((v: string): v is Email => true);

export interface EntityId<TId> {
  idp: PartitionId;
  id: TId;
}

export function byRef<TId>(idp: PartitionId, id: TId): (entity: EntityId<TId>) => boolean {
  return e => e.idp === idp && e.id === id;
}

// TODO: maintain this dynamically
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
export function makeCid<TId>(entity: EntityId<TId>): string {
  return `${entity.idp}${entity.id}`;
}
export function splitCid<TId extends string>(cid: string, idIron: Iron<string, TId>): [PartitionId, TId] {
  const index = cidSplits[cid.length] ?? _throw(() => new Error(`Invalid combined id. Unknown length: ${cid.length}.`));
  return [PartitionId.cast(cid.substring(0, index)), idIron.cast(cid.substring(index))];
}

export interface EntityRef<TId> extends EntityId<TId> {
  description: string;
  icon?: string | [string, string] | IconDefinition;
}

export function makeRef<TId>(entity: EntityRef<TId>): EntityRef<TId> {
  return {
    idp: entity.idp,
    id: entity.id,
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
