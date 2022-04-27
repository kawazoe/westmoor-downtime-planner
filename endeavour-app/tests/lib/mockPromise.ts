export type Resolver<T> = (value: PromiseLike<T> | T) => void;
export type Rejecter = (reason?: unknown) => void;
export type MockPromise<T> = Promise<T> & { resolve: Resolver<T>, reject: Rejecter };

export const stall = <T>(): MockPromise<T> => {
  let resolver: Resolver<T> = () => {};
  let rejecter: Rejecter = () => {};
  const promise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  }) as MockPromise<T>;

  promise.resolve = resolver;
  promise.reject = rejecter;

  return promise;
};
