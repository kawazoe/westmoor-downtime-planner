import { mockEntity, mockMeta } from '@/mocks/mocking';
import { mockRightsPublic, ownerGenericPublisher } from '@/mocks/owners';
import { gameSystemDungeonAndDragons5e } from '@/mocks/gameSystems';
import { makeId } from '@/stores/coreTypes';
import type { ModifierCardEntity } from '@/stores/businessTypes';
import { ModifierCardId } from '@/stores/businessTypes';

export const modifierAdvantage = mockEntity<ModifierCardEntity>(
  mockMeta('ModifierCardEntity', ownerGenericPublisher, { tag: 'mechanic', source: 'game system' }),
  mockRightsPublic(ownerGenericPublisher),
  {
    ...makeId({
      id: ModifierCardId.cast('7A'),
      idp: gameSystemDungeonAndDragons5e.idp,
    }),
    summary: 'Advantage',
    title: 'Advantage',
    description: 'Advantage',
    artwork: '',
    canApply: () => true,
    apply: c => c,
  },
);

export const modifierCards = [modifierAdvantage];
