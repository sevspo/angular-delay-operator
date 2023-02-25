import {
  HttpEvent,
  HttpEventType,
  HttpProgressEvent,
} from '@angular/common/http';
import { catchError, map, Observable, of, startWith } from 'rxjs';

export type RemoteProgress = {
  loaded: number;
  total?: number;
};

export type RemoteInitial = {
  state: 'initial';
};

export type RemoteFailure<E> = {
  state: 'failure';
  error: E;
};

export type RemoteSuccess<T> = {
  state: 'success';
  data: T;
};

export type RemotePending = {
  state: 'pending';
  progress: RemoteProgress;
};

export type RemoteData<E, T> =
  | RemoteFailure<E>
  | RemoteSuccess<T>
  | RemotePending
  | RemoteInitial;

export const failure = <E = never, T = never>(error: E): RemoteData<E, T> => ({
  state: 'failure',
  error,
});

export const success = <E = never, T = never>(data: T): RemoteData<E, T> => ({
  state: 'success',
  data,
});

export const pending: RemoteData<never, never> = {
  state: 'pending',
  progress: { loaded: 0, total: 0 },
};

export const initial: RemoteData<never, never> = {
  state: 'initial',
};

export const progress = (
  progress: HttpProgressEvent
): RemoteData<never, never> => ({
  state: 'pending',
  progress: progress,
});

// look up implementation of fromProgressEvent in rxjs
// export function fromProgressEvent(
//   event: HttpProgressEvent,
// ): RemoteData<never, never> {
//   return progress({
//     loaded: event.loaded,
//     total: event.total ?? 0,
//   });
// }

export const isFailure = <E>(
  response: RemoteData<E, unknown>
): response is RemoteFailure<E> => response.state === 'failure';

export const isSuccess = <T>(
  response: RemoteData<unknown, T>
): response is RemoteSuccess<T> => response.state === 'success';

export const isPending = (
  response: RemoteData<unknown, unknown>
): response is RemotePending => response.state === 'pending';

export const isInitial = (
  response: RemoteData<unknown, unknown>
): response is RemoteInitial => response.state === 'initial';

export function createRemoteData<T>() {
  return (source: Observable<T>) => {
    return source.pipe(
      map((response: T) => {
        return success(response);
      }),
      catchError((error: Error) => of(failure(error))),
      startWith(pending)
    );
  };
}
