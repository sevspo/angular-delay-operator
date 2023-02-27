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

import { Observable, switchMap } from 'rxjs';
import { RemoteData } from './remote-data';

export function loadingDelay(delay = 150, duration = 250) {
  return <T>(source: Observable<RemoteData<Error, T>>) => {
    return source.pipe(switchMap((rd) => {}));
  };
}
