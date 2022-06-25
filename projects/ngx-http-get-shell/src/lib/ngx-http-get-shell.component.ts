import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  from,
  map,
  of,
  Subscription,
  switchMap,
  take,
  tap,
  throwError
} from 'rxjs';
import { IndexedDbService } from './services';

@Component({
  selector: 'ngx-http-get-shell',
  templateUrl: './ngx-http-get-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxHttpGetShellComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * The URL to fetch data from. It will be used as the key from the cache.
   */
  @Input() url!: string;
  /**
   * Max Stale duration in milliseconds, default is 0, which means no cache.
   */
  @Input() maxStale = 0;
  /**
   * The processor for the fetched data before it is emitted.
   */
  @Input() dataProcessor?: (data: any) => any;
  /**
   * The error handler for the data fetching.
   */
  @Input() errorHandler?: (err: any) => void;
  /**
   * The template reference will be used to render the fetched data.
   */
  @Input() templateRef!: TemplateRef<any>;
  /**
   * Emitted when the data is loaded and processed.
   */
  @Output() dataLoaded = new EventEmitter<any>();

  public data$ = new BehaviorSubject<any>(null);
  private _url$ = new BehaviorSubject<string | null>(null);
  private _sub?: Subscription;

  constructor(private _storage: IndexedDbService, private _http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url']?.currentValue) {
      this.data$.next(null);
      this._url$.next(changes['url'].currentValue);
    }
  }

  ngOnInit() {
    this._subscribeToUrlChange();
  }

  private _subscribeToUrlChange(): void {
    this._sub = this._url$
      .pipe(
        filter((url) => !!url),
        switchMap((url) =>
          from(this._storage.getItem<any>(url!)).pipe(
            switchMap((data) =>
              data ? of(data) : this._http.get(url!).pipe(
                take(1),
                tap((data) => {
                  const maxStale = Number(this.maxStale);
                  if (maxStale > 0)
                    this._storage.setItem(url!, data, Date.now() + maxStale);
                })
              )
            )
          )
        ),
        map((response) =>
          this.dataProcessor ? this.dataProcessor(response) : response
        ),
        tap((data) => {
          this.data$.next(data);
          this.dataLoaded.emit(data);
        }),
        catchError((err) => {
          this.errorHandler?.call(this, err);
          return throwError(() => err);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._sub!.unsubscribe();
  }
}
