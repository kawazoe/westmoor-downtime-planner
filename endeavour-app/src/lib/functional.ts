export function _throw(error: unknown): never {
  throw error;
}

export function _with<T>(mutator: (v: T) => void): (v: T) => T {
  return v => {
    mutator(v);
    return v;
  };
}

export const _log: <T>(v: T) => T = _with(v => console.log(v));
