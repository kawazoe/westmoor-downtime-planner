import { createServer } from 'miragejs';
import type { Request } from 'miragejs';

import { pipe } from 'fp-ts/function';

import type { EntityMeta, OwnershipMeta, RestData } from '@/store/core-types';
import { relativePager, stampEpoch } from '@/store/mocks/mocking';

import { campaigns } from '@/store/mocks/campaigns';
import { characters } from '@/store/mocks/characters';
import { fungibleResources } from '@/store/mocks/fungibleResources';
import { gameSystems } from '@/store/mocks/gameSystems';
import { nonFungibleResources } from '@/store/mocks/nonFungibleResources';
import { owners } from '@/store/mocks/owners';
import { players } from '@/store/mocks/players';

createServer({
  timing: 1000,
  routes() {
    this.namespace = 'api/v1';

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const server = this;

    function createShorthands<T>(
      endpoint: string,
      data: T[],
      idSelector: (v: T) => unknown,
      epoch: (r: Request) => (d: T[]) => T[],
      pager: (r: Request) => (d: T[]) => RestData<T>,
    ): void {
      server.get(`/${endpoint}`, (_, request) => pipe(data, epoch(request), pager(request)));
      server.get(`/${endpoint}/:cid`, (_, request) => data.filter(v => idSelector(v) === request.params.cid)[0] || null);
    }

    function createOwnershipShorthands<T extends { cid: unknown } & OwnershipMeta>(
      endpoint: string,
      data: T[],
    ): void {
      const selector = (v: T): unknown => v.cid;
      const epoch = stampEpoch((v: T) => new Date(v.createdOn).getTime());

      createShorthands(endpoint, data, selector, epoch, relativePager(25));
    }

    function createEntityShorthands<T extends { cid: unknown } & EntityMeta>(
      endpoint: string,
      data: T[],
    ): void {
      const selector = (v: T): unknown => v.cid;
      const epoch = stampEpoch((v: T) => new Date(v.created.on).getTime());

      createShorthands(endpoint, data, selector, epoch, relativePager(25));
    }

    createOwnershipShorthands('owners', owners);

    createEntityShorthands('game-systems', gameSystems);
    createEntityShorthands('fungible-resources', fungibleResources);
    createEntityShorthands('non-fungible-resources', nonFungibleResources);
    createEntityShorthands('characters', characters);
    createEntityShorthands('campaigns', campaigns);
    createEntityShorthands('players', players);
  },
});
