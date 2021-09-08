export class CustomError extends Error {
  public constructor(message?: string) {
    // 'Error' breaks prototype chain here
    super(message);

    // Restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).__proto__ = actualProto;
    }
  }
}

export type Key = string | number | symbol;
