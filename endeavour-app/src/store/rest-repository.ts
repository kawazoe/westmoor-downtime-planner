import type { CombinedId, Uri } from '@/store/core-types';

export class RestRepository<T> {
  public constructor(private endpoint: Uri) {
  }

  public getAll(): Promise<T[]> {
    return fetch(this.endpoint).then(r => r.json() as Promise<T[]>);
  }

  public getById(id: CombinedId): Promise<T | null> {
    return fetch(`${this.endpoint}/${id}`).then(r => r.json() as Promise<T | null>);
  }
}
