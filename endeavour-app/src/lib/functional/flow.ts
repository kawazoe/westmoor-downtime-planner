/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => R} fnB
 *      The second selector to apply to the input.
 * @returns {(a: A) => R}
 *      Returns a function that transforms a value A into a result R.
 */
export function flow<A, B, R>(
  fnA: (a: A) => B,
  fnB: (b: B) => R
): (a: A) => R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => C} fnB
 *      The second selector to apply to the input.
 * @param {(c: C) => R} fnC
 *      The third selector to apply to the input.
 * @returns {(a: A) => R}
 *      Returns a function that transforms a value A into a result R.
 */
export function flow<A, B, C, R>(
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => R
): (a: A) => R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => R} fnB
 *      The second selector to apply to the input.
 * @param {(c: C) => D} fnC
 *      The third selector to apply to the input.
 * @param {(d: D) => R} fnD
 *      The fourth selector to apply to the input.
 * @returns {(a: A) => R}
 *      Returns a function that transforms a value A into a result R.
 */
export function flow<A, B, C, D, R>(
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => R
): (a: A) => R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => R} fnB
 *      The second selector to apply to the input.
 * @param {(c: C) => D} fnC
 *      The third selector to apply to the input.
 * @param {(d: D) => E} fnD
 *      The fourth selector to apply to the input.
 * @param {(e: E) => R} fnE
 *      The fifth selector to apply to the input.
 * @returns {(a: A) => R}
 *      Returns a function that transforms a value A into a result R.
 */
export function flow<A, B, C, D, E, R>(
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => E,
  fnE: (e: E) => R
): (a: A) => R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => R} fnB
 *      The second selector to apply to the input.
 * @param {(c: C) => D} fnC
 *      The third selector to apply to the input.
 * @param {(d: D) => E} fnD
 *      The fourth selector to apply to the input.
 * @param {(e: E) => F} fnE
 *      The fifth selector to apply to the input.
 * @param {(f: F) => R} fnF
 *      The sixth selector to apply to the input.
 * @returns {(a: A) => R}
 *      Returns a function that transforms a value A into a result R.
 */
export function flow<A, B, C, D, E, F, R>(
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => E,
  fnE: (e: E) => F,
  fnF: (f: F) => R
): (a: A) => R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => R} fnB
 *      The second selector to apply to the input.
 * @param {(c: C) => D} fnC
 *      The third selector to apply to the input.
 * @param {(d: D) => E} fnD
 *      The fourth selector to apply to the input.
 * @param {(e: E) => F} fnE
 *      The fifth selector to apply to the input.
 * @param {(f: F) => G} fnF
 *      The sixth selector to apply to the input.
 * @param {(g: G) => R} fnG
 *      The seventh selector to apply to the input.
 * @returns {(a: A) => R}
 *      Returns a function that transforms a value A into a result R.
 */
export function flow<A, B, C, D, E, F, G, R>(
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => E,
  fnE: (e: E) => F,
  fnF: (f: F) => G,
  fnG: (g: G) => R
): (a: A) => R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => R} fnB
 *      The second selector to apply to the input.
 * @param {(c: C) => D} fnC
 *      The third selector to apply to the input.
 * @param {(d: D) => E} fnD
 *      The fourth selector to apply to the input.
 * @param {(e: E) => F} fnE
 *      The fifth selector to apply to the input.
 * @param {(f: F) => G} fnF
 *      The sixth selector to apply to the input.
 * @param {(g: G) => H} fnG
 *      The seventh selector to apply to the input.
 * @param {(h: H) => R} fnH
 *      The eight selector to apply to the input.
 * @returns {(a: A) => R}
 *      Returns a function that transforms a value A into a result R.
 */
export function flow<A, B, C, D, E, F, G, H, R>(
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => E,
  fnE: (e: E) => F,
  fnF: (f: F) => G,
  fnG: (g: G) => H,
  fnH: (h: H) => R
): (a: A) => R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => C} fnB
 *      The second selector to apply to the input.
 * @param {(c: C) => D} fnC
 *      The third selector to apply to the input.
 * @param {(d: D) => E} fnD
 *      The fourth selector to apply to the input.
 * @param {(e: E) => F} fnE
 *      The fifth selector to apply to the input.
 * @param {(f: F) => G} fnF
 *      The sixth selector to apply to the input.
 * @param {(g: G) => H} fnG
 *      The seventh selector to apply to the input.
 * @param {(h: H) => I} fnH
 *      The eight selector to apply to the input.
 * @param {(i: I) => R} fnI
 *      The ninth selector to apply to the input.
 * @returns {(a: A) => R}
 *      Returns a function that transforms a value A into a result R.
 */
export function flow<A, B, C, D, E, F, G, H, I, R>(
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => E,
  fnE: (e: E) => F,
  fnF: (f: F) => G,
  fnG: (g: G) => H,
  fnH: (h: H) => I,
  fnI: (i: I) => R
): (a: A) => R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {(i: unknown) => unknown} fns
 *      A list of selectors to apply in sequence on the result of each other.
 * @returns {(value: unknown) => unknown}
 *      Returns a function that transforms a value A into a result R.
 */
export function flow(...fns: ((i: unknown) => unknown)[]): (value: unknown) => unknown;
export function flow(...fns: ((i: unknown) => unknown)[]): (value: unknown) => unknown {
  if (fns.length === 0) {
    return v => v;
  }

  if (fns.length === 1 && fns[0]) {
    return fns[0];
  }

  return (value: unknown) => fns.reduce((prev, fn) => fn(prev), value);
}
