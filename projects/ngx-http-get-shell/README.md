# ngx-http-get-shell

A lightweight Angular GET shell component to help reduce creating repetitive code of HttpClient GET APIs. This component has built-in support for client-side cache storage supported by IndexedDB.

## Installation

Install the npm package.
```
  npm i ngx-http-get-shell
```
Import it into your root AppModule:
```ts
  import { NgxHttpGetShellModule } from 'ngx-http-get-shell';

@NgModule({
  imports: [
    ...
    NgxHttpGetShellModule.forRoot(),
    ...
  ],
})
export class AppModule { }
```

## Usage
This library is super easy-to-use, all you need is to pass the `url` you want to get data from into `ngx-http-get-shell`, The url could be **absolute HTTP URL** or a **relative url** of your static files.

```html
<ngx-http-get-shell url="https://api.github.com/users/theideasaler" [maxStale]="1000" [templateRef]="githubTmpl">
  <ng-template #githubTmpl let-data>
    {{ data | json }}
  </ng-template>
</ngx-http-get-shell>

<ngx-http-get-shell url="/assets/test.json" [maxStale]="3000" [templateRef]="staticTmpl">
  <ng-template #staticTmpl let-file>
    <div class="some wrapper elements">
      {{file | json}}
    </div>
  </ng-template>
</ngx-http-get-shell>
```


## NgxHttpGetShellComponent
`NgxHttpGetShellComponent` exposes some I/O for custom configuration.

| I/O | name | type | description |
|------|------|---------|-------------|
| @Input | url | string |  The URL to fetch data from. It will be used as the key from the cache. |
| @Input | maxStale | number | The template reference will be used to take the fetched and processed data. |
| @Input | templateRef | TemplateRef | Max Stale duration in milliseconds, default is 0, which means no cache. |
| @Input | dataProcessor | Function | The processor for the fetched data before it is emitted. |
| @Input | errorHandler | Function | The error handler for the data fetching. |
| @Output | dataLoaded | EventEmitter | Emitted when the data is loaded and processed. You can use this for your custom data handling. |
-------------

## IndexedDbService
This library also exposes `IndexedDbService` for you so that you can have more control of the indexedDB for your caching.

| method | type | description |
|------|---------|-------------|
| cleanup | static | Cleans up the database by removing expired items. This method will be called when `NgxHttpGetShellModule` is initialized. |
| setItem | instance | Adds an item to the database. |
| getItem | instance | Gets an item from the database |
| removeItem | instance | Deletes an item from the database |
| clearAll | instance | Clear all items from the database |
| getDb | instance | The the indexed db instance used by this service |
-------------
