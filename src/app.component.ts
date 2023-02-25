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
    switchMap(() => nonFlickerLoader(this.dataService.load(900))),
    startWith('initial'),
    takeUntil(this.cancel$),
    repeat()
  );
}

function nonFlickerLoader<T extends string>(
  data$: Observable<T>,
  delay: number = 800,
  duration: number = 1000
) {
  return data$.pipe(
    combineLatestWith(
      timer(delay, duration).pipe(
        map((i) => !i),
        takeWhile(Boolean, true),
        startWith(false)
      )
    ),
    skip(1), // order matters!!!
    takeWhile(([data, showLoading]) => data === 'pending' || showLoading, true),
    tap(console.log),
    map(([data, showLoading]) =>
      showLoading || data === 'pending' ? 'show loading...' : data
    )
    // distinctUntilChanged()
  );
}
