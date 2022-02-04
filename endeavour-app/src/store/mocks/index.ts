import type { AnyFactories, AnyModels, Registry } from 'miragejs/-types';
import { createServer } from 'miragejs';
import type { Request } from 'miragejs';
import type { Server } from 'miragejs/server';

import type { EntityRef, RestData } from '@/store/core-types';
import { pageWindow } from '@/store/mocks/mocking';

import { campaigns } from '@/store/mocks/campaigns';
import { characters } from '@/store/mocks/characters';
import { fungibleResources } from '@/store/mocks/fungibleResources';
import { gameSystems } from '@/store/mocks/gameSystems';
import { nonFungibleResources } from '@/store/mocks/nonFungibleResources';
import { owners } from '@/store/mocks/owners';
import { players } from '@/store/mocks/players';

createServer({
  routes() {
    this.namespace = 'api/v1';

    function createShorthands<TId, T extends EntityRef<TId>>(
      this: Server<Registry<AnyModels, AnyFactories>>,
      endpoint: string,
      data: T[],
      window: (r: Request) => (d: T[]) => RestData<T>,
    ): void {
      this.get(`/${endpoint}`, (_, request) => window(request)(data));
      this.get(`/${endpoint}/:cid`, (_, request) => data.filter(v => v.cid === request.params.cid)[0] || null);
    }

    createShorthands.call(this, 'owners', owners, pageWindow(25));
    createShorthands.call(this, 'game-systems', gameSystems, pageWindow(25));
    createShorthands.call(this, 'fungible-resources', fungibleResources, pageWindow(25));
    createShorthands.call(this, 'non-fungible-resources', nonFungibleResources, pageWindow(25));
    createShorthands.call(this, 'characters', characters, pageWindow(25));
    createShorthands.call(this, 'campaigns', campaigns, pageWindow(25));
    createShorthands.call(this, 'players', players, pageWindow(25));
  },
});
