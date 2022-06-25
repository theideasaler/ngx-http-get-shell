export interface NgxHttpGetStorable<T> {
  /**
   * The value to store
   */
  value: T;
  /**
   * The expiration time of the stored item in milliseconds
   */
  expires: number;
}
