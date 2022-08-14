import type { CombinedId, SearchDocumentsPageResult, SearchMeta, SearchResult, Uri } from '@/stores/coreTypes';
import type { Bookmark } from '@/stores/bookmarks';
import type { Page } from '@/composables/binders';

export class RestRepository<T> {
  public constructor(private endpoint: Uri) {
  }

  public getPage(): (bookmark: Bookmark | null) => Promise<Page<T>> {
    return async bookmark => {
      function prepareQueryString(): string {
        if (!bookmark) {
          return '';
        }

        return `?${new URLSearchParams(Object.entries(bookmark).map(([k, v]) => [k, `${v}`])).toString()}`;
      }

      const request = await fetch(`${this.endpoint}${prepareQueryString()}`);
      return await request.json();
    };
  }

  public search(): (bookmark: Bookmark | null) => Promise<Page<SearchResult<T>, SearchMeta<T>>> {
    return async bookmark => {
      if (bookmark && bookmark.kind !== 'progressive') {
        throw new Error('Unsupported bookmark kind');
      }

      const params = new URLSearchParams({ token: bookmark?.token ?? '' });
      const request = await fetch(`${this.endpoint}/search?${params}`);
      const response = await request.json() as SearchDocumentsPageResult<T>;

      const { results, continuationToken, ...rest } = response;

      return {
        bookmark: { kind: 'progressive', token: continuationToken ?? '' },
        value: results,
        metadata: {
          full: true,
          last: !continuationToken ? true : undefined,
          ...rest,
        },
      };
    };
  }

  public async getById(id: CombinedId): Promise<T | null> {
    const request = await fetch(`${this.endpoint}/${id}`);
    return await request.json();
  }
}
