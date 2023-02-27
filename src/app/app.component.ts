import { Component } from '@angular/core';
import {
  Observable,
  repeat,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { DataService } from './data.service';
import { loadingDebounce } from './loading-debounce.operator';
import { loadingDelay } from './loading-delay.operator';
import { initial, RemoteData } from './remote-data';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private readonly dataService: DataService,
    private spinnerService: SpinnerService
  ) {
    this.data$ = this.load$.pipe(
      switchMap(() => this.dataService.load()),
      loadingDebounce(500, 1000),
      takeUntil(this.cancel$),
      startWith(initial),
      repeat()
    );

    this.data2$ = this.load2$.pipe(
      switchMap(() => this.dataService.load()),
      loadingDelay(500, 1000),
      takeUntil(this.cancel2$),
      startWith(initial),
      repeat()
    );
  }

  readonly load$ = new Subject<void>();
  readonly cancel$ = new Subject<void>();
  data$: Observable<RemoteData<Error, string>>;

  readonly load2$ = new Subject<void>();
  readonly cancel2$ = new Subject<void>();
  data2$: Observable<RemoteData<Error, string>>;
}
