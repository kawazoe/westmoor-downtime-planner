import type {
  EntityMeta,
  EntityRef,
  EntityRights,
} from '@/stores/coreTypes';
import { brand } from '@/lib/branding';
import type { Brand } from '@/lib/branding';
import { Uuid } from '@/stores/coreTypes';

export type SubscriptionId = Brand<string, 'SubscriptionId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SubscriptionId = brand((v: string): v is SubscriptionId => Uuid.is(v));

export type SubscriptionEntity = EntityRef<SubscriptionId> & EntityMeta;

export type GameSystemId = Brand<string, 'GameSystemId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GameSystemId = brand((v: string): v is GameSystemId => Uuid.is(v));

export type GameSystemEntity = EntityRef<GameSystemId> & EntityMeta;

export type FungibleResourceId = Brand<string, 'FungibleResourceId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const FungibleResourceId = brand((v: string): v is FungibleResourceId => Uuid.is(v));

export type FungibleResourceEntity = EntityRef<FungibleResourceId> & EntityMeta & EntityRights;

export type NonFungibleResourceId = Brand<string, 'NonFungibleResourceId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NonFungibleResourceId = brand((v: string): v is NonFungibleResourceId => Uuid.is(v));

export type NonFungibleResourceEntity = EntityRef<NonFungibleResourceId> & EntityMeta & EntityRights;

export interface CardBase<TId> extends EntityRef<TId>, EntityMeta, EntityRights {
  title: string;
  description: string;
  artwork: string;
  canApply: (context: unknown) => boolean | number; //< JEXL Expression
  apply: (context: unknown) => unknown; //< JEXL Expression
}

export type ActionCardId = Brand<string, 'ActionCardId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActionCardId = brand((v: string): v is ActionCardId => Uuid.is(v));

export type ActionCardEntity = CardBase<ActionCardId>;

export type ModifierCardId = Brand<string, 'ModifierCardId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ModifierCardId = brand((v: string): v is ModifierCardId => Uuid.is(v));

export type ModifierCardEntity = CardBase<ModifierCardId>;

export type CharacterId = Brand<string, 'CharacterId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CharacterId = brand((v: string): v is CharacterId => Uuid.is(v));

export interface CharacterEntity extends EntityRef<CharacterId>, EntityMeta, EntityRights {
  gameSystem: EntityRef<GameSystemId>;
  fullName: string;
  bio: string;
  resources: {
    fungibles: [EntityRef<FungibleResourceId>, number][],
    nonFungibles: EntityRef<NonFungibleResourceId>[],
  };
  modifierCards: EntityRef<ModifierCardId>[];
}

export type CampaignId = Brand<string, 'CampaignId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CampaignId = brand((v: string): v is CampaignId => Uuid.is(v));

export interface CampaignEntity extends EntityRef<CampaignId>, EntityMeta, EntityRights {
  gameSystem: EntityRef<GameSystemId>;
  characters: EntityRef<CharacterId>[];
  actionCards: ActionCardEntity[];
  modifierCards: ModifierCardEntity[];
}

export type PlayerId = Brand<string, 'PlayerId'>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PlayerId = brand((v: string): v is PlayerId => Uuid.is(v));

export interface PlayerEntity extends EntityRef<PlayerId>, EntityMeta, EntityRights {
  characters: EntityRef<CharacterId>[];
  campaigns: EntityRef<CampaignId>[];
  subscription: SubscriptionEntity;
}
