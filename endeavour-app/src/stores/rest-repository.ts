import type { Bookmark, Page } from '@/stores/binder-store';
import type { CombinedId, Uri } from '@/stores/core-types';

export class RestRepository<T> {
  public constructor(private endpoint: Uri) {
  }

  public getPage(): (bookmark?: Bookmark) => Promise<Page<T>> {
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

  public async getById(id: CombinedId): Promise<T | null> {
    const request = await fetch(`${this.endpoint}/${id}`);
    return await request.json();
  }
}
