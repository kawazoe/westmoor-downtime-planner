import { _with } from '@/lib/_with';

export const log = _with((...args) => console.log(...args));
export const makeGlobal = <P extends unknown[]>(key: string): (...args: P) => P[0] => _with((...args) => (window as unknown as Record<string, unknown>)[key] = args.length === 1 ? args[0] : args);
