import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb/with-async-ittr';
import { NgxHttpGetShellComponent } from './ngx-http-get-shell.component';
import {
  HttpGetCacheDbSchema,
  IndexedDbService,
  NGX_HTTP_GET_SHELL_DB,
  NGX_HTTP_GET_SHELL_INDEXED_KEY,
  NGX_HTTP_GET_SHELL_STORE
} from './services/indexed-db.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [NgxHttpGetShellComponent],
  exports: [NgxHttpGetShellComponent],
})
export class NgxHttpGetShellModule {
  static forRoot(): ModuleWithProviders<NgxHttpGetShellModule> {
    return {
      ngModule: NgxHttpGetShellModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: () =>
            async function () {
              const db: IDBPDatabase<HttpGetCacheDbSchema> = await openDB(
                NGX_HTTP_GET_SHELL_DB,
                1,
                {
                  upgrade(db) {
                    const httpGetCacheStore = db.createObjectStore(
                      NGX_HTTP_GET_SHELL_STORE
                    );
                    httpGetCacheStore.createIndex(
                      NGX_HTTP_GET_SHELL_INDEXED_KEY,
                      NGX_HTTP_GET_SHELL_INDEXED_KEY
                    );
                  },
                }
              );
              IndexedDbService.cleanup(db);
              IndexedDbService.db = db;
            },
          multi: true,
        },
        IndexedDbService,
      ],
    };
  }
}
