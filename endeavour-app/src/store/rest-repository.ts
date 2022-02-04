import type { CombinedId, RestData, Uri } from '@/store/core-types';

export class RestRepository<T> {
  public constructor(private endpoint: Uri) {
  }

  public async getAll(): Promise<RestData<T>> {
    const r = await fetch(this.endpoint);
    return r.json();
  }

  public async getById(id: CombinedId): Promise<T | null> {
    const r = await fetch(`${this.endpoint}/${id}`);
    return await r.json();
  }
}
