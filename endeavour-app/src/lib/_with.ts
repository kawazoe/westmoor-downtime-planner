export function _with<T>(mutator: (v: T) => void): (v: T) => T {
  return v => {
    mutator(v);
    return v;
  };
}
