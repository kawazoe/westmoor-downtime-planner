import type {
  EntityMeta,
  EntityRef,
  EntityRights,
  OffsetedRestData,
  OwnershipId,
  PagedRestData,
  ProgressiveRestData, Right,
} from '@/store/core-types';
import { makeRef, Uuid } from '@/store/core-types';
import { nanoid } from 'nanoid';
import type { Request } from 'miragejs';

export function mockMeta(schema: string, creator: EntityRef<OwnershipId>): EntityMeta {
  return {
    schema,
    schemaVersion: 1,
    created: {
      on: new Date().toJSON(),
      by: makeRef(creator),
    },
    modified: {
      on: new Date().toJSON(),
      by: makeRef(creator),
    },
    metas: {},
  };
}

export function mockRights(
  owner: EntityRef<OwnershipId>,
  sharedWith: [EntityRef<OwnershipId>, readonly Right[]][] = [],
): EntityRights {
  return {
    owner: makeRef(owner),
    sharedWith: sharedWith.map(([share, rights]) => ({ ...makeRef(share), rights })),
  };
}

export function mockEntity<T>(
  meta: EntityMeta,
  base: Omit<T, keyof EntityMeta>,
): T;
export function mockEntity<T>(
  meta: EntityMeta,
  rights: EntityRights,
  base: Omit<T, keyof EntityMeta | keyof EntityRights>,
): T;
export function mockEntity<T>(...args: unknown[]): T {
  return args.length === 2
    ? {
      ...args[1] as EntityMeta,
      ...args[0] as Omit<T, keyof EntityMeta>,
    } as unknown as T
    : {
      ...args[2] as EntityMeta,
      ...args[0] as EntityRights,
      ...args[1] as Omit<T, keyof EntityMeta | keyof EntityRights>,
    } as unknown as T;
}

function parseIntSafe(value: string | null | undefined, defaultValue: number): number {
  return value == null ? defaultValue : parseInt(value, 10);
}

function between(value: number, min: number, max: number): boolean {
  return value >= min && value < max;
}

export interface ProgressiveDataToken {
  id: Uuid;
  offset: number;
  limit: number;
  accessedOn: Date;
}

export class ProgressiveDataTokenStorage {
  private store: Map<Uuid, ProgressiveDataToken> = new Map<Uuid, ProgressiveDataToken>();

  public constructor(private pageSize: number = 25, private ttl: number = 60) {}

  public getOrCreate(id: string | undefined): ProgressiveDataToken {
    this.scrub();

    if (id && Uuid.is(id)) {
      const token = this.store.get(Uuid.cast(id));
      if (token) {
        token.accessedOn = new Date();
        return token;
      }
    }

    const newToken = { id: Uuid.cast(nanoid(16)), offset: 0, limit: this.pageSize, accessedOn: new Date() };
    this.store.set(newToken.id, newToken);
    return newToken;
  }

  private scrub(): void {
    const expiration = new Date(new Date().getTime() - this.ttl * 1000);
    this.store.forEach((v, k) => {
      if (v.accessedOn < expiration) {
        this.store.delete(k);
      }
    });
  }
}

export const offsetWindow = <T>(request: Request): (d: T[]) => OffsetedRestData<T> => {
  const offset = parseIntSafe(request.params.offset, 0);
  const limit = parseIntSafe(request.params.limit, 25);

  return (d: T[]) => ({ data: d.filter((_, index) => between(index, offset, limit)), offset, limit });
};
export const pageWindow = <T>(pageSize: number) => (request: Request): (d: T[]) => PagedRestData<T> => {
  const page = parseIntSafe(request.params.page, 0);

  return (d: T[]) => ({ data: d.filter((_, index) => between(index, page * pageSize, page * pageSize + pageSize)), page, pageSize });
};
export const progressiveWindow = <T>(storage: ProgressiveDataTokenStorage) => (request: Request): (d: T[]) => ProgressiveRestData<T> => {
  const token = storage.getOrCreate(request.params.token);

  return (d: T[]) => ({ data: d.filter((_, index) => between(index, token.offset, token.limit)), token: token.id });
};
