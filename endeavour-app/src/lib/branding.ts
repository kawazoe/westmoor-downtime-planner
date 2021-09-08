import { _throw } from '@/lib/functional';
import { CustomError } from '@/lib/generics';
import type { Key } from '@/lib/generics';

/**
 * Thrown when a fatal error happens during the branding process.
 */
export class BrandingError extends CustomError {
  private constructor(message: string) {
    super(`[BrandingError] ${message}`);
  }

  public static brandingFailed(id: string): BrandingError {
    return new BrandingError(`Branding failed for brand: ${id}. Source value did not pass type-guard function.`);
  }
}

/**
 * A type that workarounds TypeScript's aliasing to clone other types.
 */
export type Brand<T, Id extends Key> = T & { readonly _brand: Id };
export type Iron<TSource, TBrand extends TSource> = {
  readonly is: (value: TSource) => value is TBrand,
  readonly as: (value: TSource) => TBrand | undefined,
  readonly cast: (value: TSource) => TBrand,
};

/**
 * Generates an Iron that can be used to brand a Source type as a Brand type or
 * check compatibility of a Source value against a given Brand.
 *
 * Similar to livestock branding, type branding applies a unique pattern, or
 * brand, on a type which makes it different from its other variants. While
 * TypeScript natively supports type aliasing (giving two different names to the
 * same time), it doesn't supports type cloning (creating a different type with
 * a similar structure as another one). Type branding alleviates this issue by
 * marking each type with a unique id. The result of this marking is a unique
 * type that remains compatible with the Source type's interface.
 * @param is A type guard function that can validates the compatibility of a
 *           given value with the branded type.
 */
export function brand<TSource, TBrand extends TSource>(is: (value: TSource) => value is TBrand): Iron<TSource, TBrand> {
  function as(v: TSource): TBrand | undefined {
    return is(v) ? v : undefined;
  }
  function cast(v: TSource): TBrand {
    return is(v)
      ? v
      : _throw(BrandingError.brandingFailed(is.name.replace('is', '')));
  }

  return Object.freeze({ is, as, cast });
}
