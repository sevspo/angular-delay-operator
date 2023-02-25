import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Subject,
  switchMap,
  startWith,
  takeUntil,
  repeat,
  map,
  tap,
  timer,
  Observable,
  combineLatestWith,
  takeWhile,
  skip,
  distinctUntilChanged,
} from 'rxjs';
import { DataService } from './data.service';
import { initial, isPending, RemoteData, success } from './remote-data';

@Component({
  selector: 'app-component',
  standalone: true,
  imports: [CommonModule],
  styles: [],
  templateUrl: './app.component.html',
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
