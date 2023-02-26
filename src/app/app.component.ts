import { Component } from '@angular/core';
import {
  Subject,
  switchMap,
  startWith,
  takeUntil,
  repeat,
  Observable,
  combineLatestWith,
  timer,
  map,
  takeWhile,
  skip,
} from 'rxjs';
import { DataService } from './data.service';
import { initial, RemoteData, isPending, success } from './remote-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private readonly dataService: DataService) {}

  readonly load$ = new Subject<void>();

  readonly cancel$ = new Subject<void>();

  readonly data$ = this.load$.pipe(
    switchMap(() => nonFlickerLoader(this.dataService.load(600))),
    startWith(initial),
    takeUntil(this.cancel$),
    repeat()
  );
}

function nonFlickerLoader(
  data$: Observable<RemoteData<Error, string>>,
  delay: number = 500,
  duration: number = 1500
) {
  return data$.pipe(
    // tap(console.log),
    combineLatestWith(
      timer(delay, duration).pipe(
        map((i) => !i),
        takeWhile(Boolean, true),
        startWith(false)
        // tap((v) => console.log(v))
      )
    ),
    skip(1), // order matters!!!
    // tap(console.log),
    takeWhile(([rd, showLoading]) => isPending(rd) || showLoading, true),
    map(([rd, showLoading]) =>
      showLoading || isPending(rd) ? success('loading...') : rd
    )
    // distinctUntilChanged()
  );
}
