import { _with } from '@/lib/functional/_with';

export const log: <T>(v: T) => T = _with(v => console.log(v));
