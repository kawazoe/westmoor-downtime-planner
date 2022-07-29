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
  summary: string;
  icon?: string | [string, string] | IconDefinition;
}

export function makeRef<TId>(entity: EntityRef<TId>): EntityRef<TId> {
  return {
    idp: entity.idp,
    id: entity.id,
    cid: entity.cid,
    summary: entity.summary,
    icon: entity.icon,
  };
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

export type OwnershipEntity = EntityRef<OwnershipId> & EntityMeta & {
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

// From @azure/search-documents
//////////////////////////////////
/** A single bucket of a facet query result. Reports the number of documents with a field value falling within a particular range or having a particular value or interval. */
export interface FacetResult {

  readonly value: unknown;

  /**
   * The approximate count of documents falling within the bucket described by this facet.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly count?: number;
}

/** An answer is a text passage extracted from the contents of the most relevant documents that matched the query. Answers are extracted from the top search results. Answer candidates are scored and the top answers are selected. */
export interface AnswerResult {

  /**
   * The score value represents how relevant the answer is to the query relative to other answers returned for the query.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly score: number;

  /**
   * The key of the document the answer was extracted from.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly key: string;

  /**
   * The text passage extracted from the document contents as the answer.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly text: string;

  /**
   * Same text passage as in the Text property with highlighted text phrases most relevant to the query.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly highlights?: string;
}

/** Captions are the most representative passages from the document relatively to the search query. They are often used as document summary. Captions are only returned for queries of type 'semantic'.. */
export interface CaptionResult {

  /**
   * A representative text passage extracted from the document most relevant to the search query.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly text?: string;

  /**
   * Same text passage as in the Text property with highlighted phrases most relevant to the query.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly highlights?: string;
}

/**
 * Contains a document found by a search query, plus associated metadata.
 */
export type SearchResult<T> = {

  /**
   * The relevance score of the document compared to other documents returned by the query.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  readonly score: number,

  /**
   * The relevance score computed by the semantic ranker for the top search results. Search results are sorted by the RerankerScore first and then by the Score. RerankerScore is only returned for queries of type 'semantic'.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly rerankerScore?: number,

  /**
   * Text fragments from the document that indicate the matching search terms, organized by each
   * applicable field; null if hit highlighting was not enabled for the query.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  readonly highlights?: { [k in keyof T]?: string[] },

  /**
   * Captions are the most representative passages from the document relatively to the search query. They are often used as document summary. Captions are only returned for queries of type 'semantic'.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly captions?: CaptionResult[],

  document: T,
};

/**
 * Response containing search results from an index.
 */
export interface SearchDocumentsResultBase {

  /**
   * The total count of results found by the search operation, or null if the count was not
   * requested. If present, the count may be greater than the number of results in this response.
   * This can happen if you use the $top or $skip parameters, or if Azure Cognitive Search can't
   * return all the requested documents in a single Search response.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  readonly count?: number;

  /**
   * A value indicating the percentage of the index that was included in the query, or null if
   * minimumCoverage was not specified in the request.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  readonly coverage?: number;

  /**
   * The facet query results for the search operation, organized as a collection of buckets for
   * each faceted field; null if the query did not include any facet expressions.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  readonly facets?: { [propertyName: string]: FacetResult[] };

  /**
   * The answers query results for the search operation; null if the answers query parameter was
   * not specified or set to 'none'.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly answers?: AnswerResult[];
}

/**
 * Response containing search page results from an index.
 */
export interface SearchDocumentsPageResult<T> extends SearchDocumentsResultBase {

  /**
   * The sequence of results returned by the query.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  readonly results: SearchResult<T>[];

  /**
   * A token used for retrieving the next page of results when the server
   * enforces pagination.
   */
  continuationToken?: string;
}

export type SearchMeta<T> = Omit<SearchDocumentsPageResult<T>, 'results' | 'continuationToken'>;
