import { Injectable } from '@angular/core';
import { defer, Observable, timer, map, startWith } from 'rxjs';
import { pending, RemoteData, success } from './remote-data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  load(delay?: number): Observable<RemoteData<Error, string>> {
    return defer(() => {
      const f = delay ? delay : Math.random() * 5 * 1000;

      return timer(f).pipe(map(() => success(`data took ${f} ms to load`)));
    }).pipe(startWith(pending));
  }
}
