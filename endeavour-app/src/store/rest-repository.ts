import type { CombinedId, Uri } from '@/store/core-types';

export class RestRepository<T> {
  public constructor(private endpoint: Uri) {
  }

  public async getAll(): Promise<T[]> {
    const r = await fetch(this.endpoint);
    return r.json();
  }

  public async getById(id: CombinedId): Promise<T | null> {
    const r = await fetch(`${this.endpoint}/${id}`);
    const p = await r.json() as T[] | null;
    return p?.[0] ?? null;
  }
}
