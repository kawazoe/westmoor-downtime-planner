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
export function chain<A, B, R>(
  fnB: (b: B) => R,
  fnA: (a: A) => B,
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
export function chain<A, B, C, R>(
  fnC: (c: C) => R,
  fnB: (b: B) => C,
  fnA: (a: A) => B,
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
export function chain<A, B, C, D, R>(
  fnD: (d: D) => R,
  fnC: (c: C) => D,
  fnB: (b: B) => C,
  fnA: (a: A) => B,
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
export function chain<A, B, C, D, E, R>(
  fnE: (e: E) => R,
  fnD: (d: D) => E,
  fnC: (c: C) => D,
  fnB: (b: B) => C,
  fnA: (a: A) => B,
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
export function chain<A, B, C, D, E, F, R>(
  fnF: (f: F) => R,
  fnE: (e: E) => F,
  fnD: (d: D) => E,
  fnC: (c: C) => D,
  fnB: (b: B) => C,
  fnA: (a: A) => B,
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
export function chain<A, B, C, D, E, F, G, R>(
  fnG: (g: G) => R,
  fnF: (f: F) => G,
  fnE: (e: E) => F,
  fnD: (d: D) => E,
  fnC: (c: C) => D,
  fnB: (b: B) => C,
  fnA: (a: A) => B,
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
export function chain<A, B, C, D, E, F, G, H, R>(
  fnH: (h: H) => R,
  fnG: (g: G) => H,
  fnF: (f: F) => G,
  fnE: (e: E) => F,
  fnD: (d: D) => E,
  fnC: (c: C) => D,
  fnB: (b: B) => C,
  fnA: (a: A) => B,
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
export function chain<A, B, C, D, E, F, G, H, I, R>(
  fnI: (i: I) => R,
  fnH: (h: H) => I,
  fnG: (g: G) => H,
  fnF: (f: F) => G,
  fnE: (e: E) => F,
  fnD: (d: D) => E,
  fnC: (c: C) => D,
  fnB: (b: B) => C,
  fnA: (a: A) => B,
): (a: A) => R;
/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {(i: any) => any} fns
 *      A list of selectors to apply in sequence on the result of each other.
 * @returns {(value: any) => any}
 *      Returns a function that transforms a value A into a result R.
 */
export function chain(...fns: ((i: any) => any)[]): (value: any) => any;
export function chain(...fns: ((i: any) => any)[]): (value: any) => any {
  const rfns = fns.reduce((acc, cur) => [cur, ...acc], []);
  return (value: any) => rfns.reduce((prev, fn) => fn(prev), value);
}
