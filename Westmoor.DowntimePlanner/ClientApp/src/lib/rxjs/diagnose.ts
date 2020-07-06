import { OperatorFunction, defer } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

/**
 * Intercept notifications in an observable chain to diagnose their behaviour.
 *
 * This operator will call the logger each time the resulting observable is
 * subscribed/unsubscribed as well as when any notification passes through it.
 *
 * @example
 *  timer(500).pipe(diag('example')).subscribe();
 *  // Will output the following to the console:
 *  // [RxJs.diag] [example] subscribe
 *  // [RxJs.diag] [example] next 0
 *  // [RxJs.diag] [example] complete
 *  // [RxJs.diag] [example] unsubscribe
 *
 *  @example
 *  timer(500).pipe(diag('example'), takeWhile(i => i < 2)).subscribe();
 *  // Will output the following to the console:
 *  // [RxJs.diag] [example] subscribe
 *  // [RxJs.diag] [example] next 0
 *  // [RxJs.diag] [example] next 1
 *  // [RxJs.diag] [example] next 2
 *  // [RxJs.diag] [example] unsubscribe
 *
 *  @example
 *  timer(500).pipe(takeWhile(i => i < 2), diag('example')).subscribe();
 *  // Will output the following to the console:
 *  // [RxJs.diag] [example] subscribe
 *  // [RxJs.diag] [example] next 0
 *  // [RxJs.diag] [example] next 1
 *  // [RxJs.diag] [example] complete
 *  // [RxJs.diag] [example] unsubscribe
 *
 * @param marker A string help to identify the observable chain in the logger.
 * @param logger The tracing target function.
 */
export function diagnose<T>(
  marker: string,
  logger = ((msg: string, value?: any) => { console.log(msg, value); })
): OperatorFunction<T, T> {
  return o => defer(() => {
    const msgTag = `[RxJs.diag] [${marker}]`;

    logger(`${msgTag} subscribe`);
    return o
      .pipe(
        tap(
          v => logger(`${msgTag} next`, v),
          e => logger(`${msgTag} error`, e),
          () => logger(`${msgTag} complete`),
        ),
        finalize(() => logger(`${msgTag} unsubscribe`))
      );
  });
}
