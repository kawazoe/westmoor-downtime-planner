import { createServer } from 'miragejs';

import { pipe } from 'fp-ts/function';

import type { EntityMeta } from '@/stores/coreTypes';
import { relativePager, searchFakePager, stampEpoch } from '@/mocks/mocking';

import { actionCards } from '@/mocks/actionCards';
import { campaigns } from '@/mocks/campaigns';
import { characters } from '@/mocks/characters';
import { fungibleResources } from '@/mocks/fungibleResources';
import { gameSystems } from '@/mocks/gameSystems';
import { modifierCards } from '@/mocks/modifierCards';
import { nonFungibleResources } from '@/mocks/nonFungibleResources';
import { owners } from '@/mocks/owners';
import { players } from '@/mocks/players';

createServer({
  timing: 1000,
  routes() {
    this.namespace = 'api/v1';

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const server = this;

    function createEntityShorthands<T extends { cid: unknown } & EntityMeta>(
      endpoint: string,
      data: T[],
      facets: Record<string, (v: T) => string>,
    ): void {
      const idSelector = (v: T): unknown => v.cid;
      const epoch = stampEpoch((v: T) => new Date(v.created.on).getTime());

      server.get(`/${endpoint}`, (_, request) => pipe(data, epoch(request), relativePager(3)(request)));
      server.get(`/${endpoint}/search`, (_, request) => pipe(data, epoch(request), searchFakePager(facets)(request)));
      server.get(`/${endpoint}/:cid`, (_, request) => data.filter(v => idSelector(v) === request.params.cid)[0] || null);
    }

    createEntityShorthands('owners', owners, {});

    createEntityShorthands('game-systems', gameSystems, {});
    createEntityShorthands('fungible-resources', fungibleResources, {
      tag: e => `${e.metas['tag']}`,
      source: e => `${e.metas['source']}`,
    });
    createEntityShorthands('non-fungible-resources', nonFungibleResources, {
      tag: e => `${e.metas['tag']}`,
      source: e => `${e.metas['source']}`,
    });
    createEntityShorthands('characters', characters, {});
    createEntityShorthands('campaigns', campaigns, {});
    createEntityShorthands('players', players, {});
  },
});
