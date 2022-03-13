export function _with<P extends unknown[]>(mutator: (...args: P) => void): (...args: P) => P[0] {
  return (...args) => {
    mutator(...args);
    return args[0];
  };
}
