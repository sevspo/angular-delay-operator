import { inject } from '@angular/core';
import { Observable, debounceTime, map, finalize } from 'rxjs';
import {
  RemoteData,
  isPending,
  isSuccess,
  isFailure,
  isInitial,
} from './remote-data';
import { SpinnerService } from './spinner.service';

export function loadingDebounce(delay = 250, duration = 250) {
  const spinnerService = inject(SpinnerService);

  return <T>(source: Observable<RemoteData<Error, T>>) => {
    return source.pipe(
      debounceTime(delay),
      map((rd) => {
        if (isPending(rd)) {
          spinnerService.show();
        }
        return rd;
      }),
      debounceTime(duration),
      map((rd) => {
        if (isSuccess(rd) || isFailure(rd) || isInitial(rd)) {
          spinnerService.hide();
        }
        return rd;
      }),
      finalize(() => {
        spinnerService.hide();
      })
    );
  };
}
