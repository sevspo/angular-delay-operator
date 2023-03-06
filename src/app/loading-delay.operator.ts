// function nonFlickerLoader(
//   data$: Observable<RemoteData<Error, string>>,
//   delay: number = 500,
//   duration: number = 1500
// ) {
//   return data$.pipe(
//     // tap(console.log),
//     combineLatestWith(
//       timer(delay, duration).pipe(
//         map((i) => !i),
//         takeWhile(Boolean, true),
//         startWith(false)
//
//       )
//     ),
//     skip(1), // order matters!!!
//     takeWhile(([rd, showLoading]) => isPending(rd) || showLoading, true),
//     map(([rd, showLoading]) =>
//       showLoading || isPending(rd) ? success('loading...') : rd
//     )
//     // distinctUntilChanged()
//   );
// }

import { inject } from '@angular/core';
import {
  combineLatestWith,
  distinctUntilChanged,
  filter,
  from,
  map,
  Observable,
  of,
  partition,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
  timer,
} from 'rxjs';
import { isPending, isSuccess, RemoteData } from './remote-data';
import { SpinnerService } from './spinner.service';

export function loadingDelay(delay = 250, duration = 250) {
  const spinnerService = inject(SpinnerService);

  return <T>(source: Observable<RemoteData<Error, T>>) => {
    const pending$ = source.pipe(filter((rd) => rd.state === 'pending'));

    // const pending$ = from(source).pipe(filter((rd) => isPending(rd)));

    const loading$ = pending$.pipe(
      switchMap((rd) =>
        timer(delay, duration).pipe(
          map((i) => !i),
          takeWhile(Boolean, true),
          startWith(false)
        )
      )
    );

    // false  ---------------- true ---------------- false
    // pending ------ success --------------|

    // false  ---------------- true ---------------- false
    // pending ------------------s----- success ---------h-----|

    // false  ---------------- true ---------------- false------h
    // pending ------------------s-------------------------- success ----------|

    return source.pipe(
      combineLatestWith(loading$),
      // these conditions couls also be changed to delay the emission of the data for an operator that
      // does not handle the loading state as side effect, eg a loading template
      map(([rd, loading]) => {
        if (loading && isPending(rd)) {
          spinnerService.show();
        }

        if (!loading && isSuccess(rd)) {
          spinnerService.hide();
        }

        return rd;
      }),
      distinctUntilChanged(),
      tap(console.log)
    );
  };
}
