/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {A} a
 *      The source value to pass through the pipe
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => R} fnB
 *      The second selector to apply to the input.
 * @returns {R}
 *      Returns the transformed value A into a result R.
 */
export function pipe<A, B, R>(
  a: A,
  fnA: (a: A) => B,
  fnB: (b: B) => R
): R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {A} a
 *      The source value to pass through the pipe
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => C} fnB
 *      The second selector to apply to the input.
 * @param {(c: C) => R} fnC
 *      The third selector to apply to the input.
 * @returns {R}
 *      Returns the transformed value A into a result R.
 */
export function pipe<A, B, C, R>(
  a: A,
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => R
): R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {A} a
 *      The source value to pass through the pipe
 * @param {(a: A) => B} fnA
 *      The first selector to apply to the input.
 * @param {(b: B) => R} fnB
 *      The second selector to apply to the input.
 * @param {(c: C) => D} fnC
 *      The third selector to apply to the input.
 * @param {(d: D) => R} fnD
 *      The fourth selector to apply to the input.
 * @returns {R}
 *      Returns the transformed value A into a result R.
 */
export function pipe<A, B, C, D, R>(
  a: A,
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => R
): R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {A} a
 *      The source value to pass through the pipe
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
 * @returns {R}
 *      Returns the transformed value A into a result R.
 */
export function pipe<A, B, C, D, E, R>(
  a: A,
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => E,
  fnE: (e: E) => R
): R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {A} a
 *      The source value to pass through the pipe
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
 * @returns {R}
 *      Returns the transformed value A into a result R.
 */
export function pipe<A, B, C, D, E, F, R>(
  a: A,
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => E,
  fnE: (e: E) => F,
  fnF: (f: F) => R
): R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {A} a
 *      The source value to pass through the pipe
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
 * @returns {R}
 *      Returns the transformed value A into a result R.
 */
export function pipe<A, B, C, D, E, F, G, R>(
  a: A,
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => E,
  fnE: (e: E) => F,
  fnF: (f: F) => G,
  fnG: (g: G) => R
): R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {A} a
 *      The source value to pass through the pipe
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
 * @returns {R}
 *      Returns the transformed value A into a result R.
 */
export function pipe<A, B, C, D, E, F, G, H, R>(
  a: A,
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => E,
  fnE: (e: E) => F,
  fnF: (f: F) => G,
  fnG: (g: G) => H,
  fnH: (h: H) => R
): R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {A} a
 *      The source value to pass through the pipe
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
 * @returns {R}
 *      Returns the transformed value A into a result R.
 */
export function pipe<A, B, C, D, E, F, G, H, I, R>(
  a: A,
  fnA: (a: A) => B,
  fnB: (b: B) => C,
  fnC: (c: C) => D,
  fnD: (d: D) => E,
  fnE: (e: E) => F,
  fnF: (f: F) => G,
  fnG: (g: G) => H,
  fnH: (h: H) => I,
  fnI: (i: I) => R
): R;

/**
 * Creates a function that converts an input value A to a result R
 * using a set of intermediate selectors.
 * @param {unknown} input
 *      The source value to pass through the pipe
 * @param {(i: unknown) => unknown} fns
 *      A list of selectors to apply in sequence on the result of each other.
 * @returns {unknown}
 *      Returns the transformed value A into a result R.
 */
export function pipe<F, R>(input: F, ...fns: ((i: unknown) => unknown)[]): R;
export function pipe<F, R>(input: F, ...fns: ((i: unknown) => unknown)[]): R{
  if (fns.length === 0) {
    return input as unknown as R;
  }

  if (fns.length === 1 && fns[0]) {
    return fns[0](input as unknown) as R;
  }

  return fns.reduce((prev, fn) => fn(prev), input as unknown) as R;
}
