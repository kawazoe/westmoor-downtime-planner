import { createServer } from 'miragejs';
import type { Request } from 'miragejs';

import { pipe } from 'fp-ts/function';

import type { Page } from '@/stores/binder-store';

import type { EntityMeta, OwnershipMeta } from '@/stores/core-types';
import { relativePager, stampEpoch } from '@/mocks/mocking';

import { campaigns } from '@/mocks/campaigns';
import { characters } from '@/mocks/characters';
import { fungibleResources } from '@/mocks/fungibleResources';
import { gameSystems } from '@/mocks/gameSystems';
import { nonFungibleResources } from '@/mocks/nonFungibleResources';
import { owners } from '@/mocks/owners';
import { players } from '@/mocks/players';

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
      pager: (r: Request) => (d: T[]) => Page<T>,
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

      createShorthands(endpoint, data, selector, epoch, relativePager(3));
    }

    function createEntityShorthands<T extends { cid: unknown } & EntityMeta>(
      endpoint: string,
      data: T[],
    ): void {
      const selector = (v: T): unknown => v.cid;
      const epoch = stampEpoch((v: T) => new Date(v.created.on).getTime());

      createShorthands(endpoint, data, selector, epoch, relativePager(3));
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
