import { Injectable } from '@angular/core';
import { defer, Observable, timer, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  load(delay?: number): Observable<string> {
    return defer(() => {
      const f = delay ? delay : Math.random() * 5 * 1000;

      return timer(f).pipe(map(() => `Loading took ${f} miliseconds`));
    }).pipe(startWith('pending'));
  }
}
