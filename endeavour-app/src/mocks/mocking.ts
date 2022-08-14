import type { Request } from 'miragejs';

import { nanoid } from 'nanoid';

import { parseIntSafe } from '@/lib/parsing';

import type {
  EntityMeta,
  EntityRef,
  EntityRights,
  OwnershipId,
  Right,
  SearchDocumentsPageResult,
} from '@/stores/coreTypes';
import { makeRef, Uuid } from '@/stores/coreTypes';

import type { AbsoluteBookmark, ProgressiveBookmark, RelativeBookmark } from '@/lib/bookmarks';
import { toBookmark } from '@/lib/bookmarks';

import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as R from 'fp-ts/Record';
import type { Page } from '@/composables/binders';
import { pipe } from 'fp-ts/function';

export function mockMeta(schema: string, creator: EntityRef<OwnershipId>, metas: Record<string, unknown> = {}): EntityMeta {
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
    metas,
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

export const stampEpoch = <T>(selector: (v: T) => number) => (request: Request): (d: T[]) => T[] => {
  const stamp = parseIntSafe(request.queryParams.stamp, new Date().getTime());

  return (d: T[]) => d.filter(v => selector(v) <= stamp);
};

export const absolutePager = <T>(request: Request): (d: T[]) => Omit<Page<T>, 'status'> & { bookmark: AbsoluteBookmark } => {
  const bookmark = toBookmark({
    offset: request.queryParams.offset,
    limit: request.queryParams.limit,
  });

  return (d: T[]) => {
    const value = d.filter((_, index) => between(index, bookmark.offset, bookmark.limit));
    return {
      bookmark,
      value,
      metadata: {
        full: value.length === bookmark.limit ? true : undefined,
        last: d.length <= bookmark.offset + bookmark.limit ? true : undefined,
      },
    };
  };
};
export const relativePager = <T>(pageSize: number) => (request: Request): (d: T[]) => Omit<Page<T>, 'status'> & { bookmark: RelativeBookmark } => {
  const bookmark = toBookmark({
    page: request.queryParams.page,
    pageSize,
  });

  return (d: T[]) => {
    const value = d.filter((_, index) => between(index, bookmark.page * bookmark.pageSize, bookmark.page * bookmark.pageSize + bookmark.pageSize));
    return {
      bookmark,
      value,
      metadata: {
        full: value.length === pageSize ? true : undefined,
        last: d.length <= bookmark.page * pageSize + pageSize ? true : undefined,
      },
    };
  };
};
export const progressivePager = <T>(storage: ProgressiveDataTokenStorage) => (request: Request): (d: T[]) => Omit<Page<T>, 'status'> & { bookmark: ProgressiveBookmark } => {
  const token = storage.getOrCreate(request.queryParams.token);
  const bookmark = toBookmark({ token: token.id });

  return (d: T[]) => {
    const value = d.filter((_, index) => between(index, token.offset, token.limit));
    return {
      bookmark,
      value,
      metadata: {
        full: value.length === token.limit ? true : undefined,
        last: d.length <= token.offset + token.limit ? true : undefined,
      },
    };
  };
};
export const searchFakePager = <T>(facets: Record<string, (e: T) => string>) => (request: Request): (d: T[]) => SearchDocumentsPageResult<T> => (d: T[]) => {
  if (request.queryParams.token) {
    return { results: [] };
  }

  return {
    count: d.length,
    coverage: Math.random(),
    facets: pipe(
      facets,
      R.map(f => pipe(
        d,
        NEA.groupBy(f),
        R.mapWithIndex((k, group) => ({ value: k, count: group.length })),
        R.toArray,
        A.map(([,v]) => v),
      )),
    ),
    results: pipe(
      d,
      A.mapWithIndex((i, e) => ({
        score: d.length - i,
        document: e,
      })),
    ),
    continuationToken: undefined,
  };
};
