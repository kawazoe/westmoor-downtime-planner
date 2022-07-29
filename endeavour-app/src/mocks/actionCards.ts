import { mockEntity, mockMeta } from '@/mocks/mocking';
import { mockRightsPublic, ownerGenericPublisher } from '@/mocks/owners';
import type { ActionCardEntity } from '@/stores/businessTypes';
import { ActionCardId } from '@/stores/businessTypes';
import { gameSystemDungeonAndDragons5e } from '@/mocks/gameSystems';
import { makeId } from '@/stores/coreTypes';

export function plainAction(id: ActionCardId, title: string, metas: Record<string, unknown>): ActionCardEntity {
  return mockEntity<ActionCardEntity>(
    mockMeta('ActionCardEntity', ownerGenericPublisher, metas),
    mockRightsPublic(ownerGenericPublisher),
    {
      ...makeId({
        id,
        idp: gameSystemDungeonAndDragons5e.idp,
      }),
      summary: title,
      title,
      description: title,
      artwork: '',
      canApply: () => true,
      apply: c => c,
    },
  );
}

export const actionCards = [
  plainAction(ActionCardId.cast('QS'), 'Short Sword', { tag: 'weapon', source: 'game system' }),
  plainAction(ActionCardId.cast('yr'), 'Long Sword', { tag: 'weapon', source: 'game system' }),
  plainAction(ActionCardId.cast('BL'), 'Compound Bow', { tag: 'weapon', source: 'game system' }),
  plainAction(ActionCardId.cast('Zh'), 'Pistol', { tag: 'weapon', source: 'game system' }),
  plainAction(ActionCardId.cast('hY'), 'Healing Potion', { tag: 'potion', source: 'game system' }),
  plainAction(ActionCardId.cast('-l'), 'Antitoxin Vial', { tag: 'potion', source: 'game system' }),
  plainAction(ActionCardId.cast('NX'), 'Carousing', { tag: 'downtime', source: 'campaign' }),
  plainAction(ActionCardId.cast('_2'), 'Gambling', { tag: 'downtime', source: 'campaign' }),
  plainAction(ActionCardId.cast('la'), 'Pit Fighting', { tag: 'downtime', source: 'campaign' }),
  plainAction(ActionCardId.cast('7W'), 'Selling a Magic Item', { tag: 'downtime', source: 'campaign' }),
  plainAction(ActionCardId.cast('s3'), 'Crafting a Potion', { tag: 'downtime', source: 'campaign' }),
  plainAction(ActionCardId.cast('Yo'), 'Investigate', { tag: 'downtime', source: 'campaign' }),
  plainAction(ActionCardId.cast('05'), 'Research', { tag: 'downtime', source: 'campaign' }),
  plainAction(ActionCardId.cast('Xj'), 'Work', { tag: 'downtime', source: 'campaign' }),
];
