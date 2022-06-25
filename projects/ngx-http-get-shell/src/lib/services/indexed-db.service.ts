import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase } from 'idb';
import { NgxHttpGetStorable } from '../models/ngx-http-get-storable.model';

export const NGX_HTTP_GET_SHELL_DB = 'ngx-http-get-shell';
export const NGX_HTTP_GET_SHELL_STORE = 'ngx-http-get-shell-cache';
export const NGX_HTTP_GET_SHELL_INDEXED_KEY = 'expires';

export interface HttpGetCacheDbSchema extends DBSchema {
  [NGX_HTTP_GET_SHELL_STORE]: {
    value: NgxHttpGetStorable<any>;
    key: string;
    indexes: { [NGX_HTTP_GET_SHELL_INDEXED_KEY]: number };
  };
}

/**
 * This service handles client-side indexed db storage read/write APIs
 */
@Injectable()
export class IndexedDbService {
  static db: IDBPDatabase<HttpGetCacheDbSchema>;
  private _db: IDBPDatabase<HttpGetCacheDbSchema>;

  constructor() {
    this._db = IndexedDbService.db;
  }

  /**
   * Cleans up the database by removing expired items
   */
  static async cleanup(db: IDBPDatabase<HttpGetCacheDbSchema>): Promise<void> {
    const deletes: Promise<void>[] = [];
    const tx = db.transaction(NGX_HTTP_GET_SHELL_STORE, 'readwrite');
    const now = Date.now();
    const index = tx.store.index(NGX_HTTP_GET_SHELL_INDEXED_KEY);

    for await (const record of index.iterate(null, 'next')) {
      if (record.value.expires < now) {
        deletes.push(record.delete());
      } else {
        break;
      }
    }

    await Promise.all(deletes);
    await tx.done;
  }

  /**
   * Adds an item to the database
   * @param key The key to store the value under
   * @param value The value to store
   * @param expires The time in milliseconds until the value expires
   * @returns The stored key
   */
  public setItem<T>(key: string, value: T, expires: number): Promise<string> {
    const NgxHttpGetStorable: NgxHttpGetStorable<T> = {
      value,
      expires,
    };
    return this._db.put(NGX_HTTP_GET_SHELL_STORE, NgxHttpGetStorable, key);
  }

  /**
   * Gets an item from the database
   * @param key The key to retrieve the value from
   * @returns The stored value
   */
  public async getItem<T>(key: string): Promise<T> {
    const NgxHttpGetStorable = await this._db.get(
      NGX_HTTP_GET_SHELL_STORE,
      key
    );
    return NgxHttpGetStorable?.value;
  }

  /**
   * Deletes an item from the database
   * @param key The key to delete
   */
  public removeItem(key: string): Promise<void> {
    return this._db.delete(NGX_HTTP_GET_SHELL_STORE, key);
  }

  /**
   * Clear all items from the database
   */
  public clearAll(): Promise<void> {
    return this._db.clear(NGX_HTTP_GET_SHELL_STORE);
  }

  /**
   * The the indexed db instance used by this service
   * @returns Indexed db instance
   */
  public getDb(): IDBPDatabase<HttpGetCacheDbSchema> {
    return this._db;
  }
}
