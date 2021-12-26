export function _throw(error: unknown | (() => unknown)): never {
  throw typeof error === 'function' ? error() : error;
}
