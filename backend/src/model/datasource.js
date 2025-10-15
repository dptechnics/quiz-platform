/**
 * The Datasource class represents an external value datasource.
 */
export class Datasource {
  /**
   * Construct a new data source.
   * 
   * @param {String} type The type of datasource
   * @param {Object} data The data to construct this datasource.
   * @param {Number} cacheLifetime The number of seconds that an external value is cached before
   * it is re-fetched.
   */
  constructor(type, data, cacheLifetime = 300) {
    this.type = type || "undefined";
    this.board = data?.board || "";
    this.parameter = data?.parameter || "";
    this.cacheLifetime = cacheLifetime;

    this.value = undefined;
    this.lastFetched = 0;
  };

  /**
   * Get a value from a walter demo data source.
   * 
   * @return {Number} The value of the data source or undefined on error.
   */
  getValueWalterDemo = async () => {
    const stop = Math.floor(Date.now() / 1000) + 300;
    const start = stop - 30 * 60;

    try {
      const resp = await fetch(
        `https://walterdemo.quickspot.io/api/walter/measurements/${this.board}/${start}/${stop}`);
      const measurements = await resp.json();

      const mostRecent = measurements.reduce((latest, current) => {
        return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
      }, measurements[0]);

      return mostRecent[this.parameter];
    } catch (err) {
      console.error(`Could not get value from data source: ${err}`);
    }

    return undefined;
  };

  /**
   * Get the actual value of this data source.
   * 
   * @return {Number} The value of the data source or undefined on error.
   */
  getValue = async () => {
    const now = Math.floor(Date.now() / 1000);
    if(this.value != undefined && ((now - this.lastFetched) < this.cacheLifetime)) {
      return this.value;
    }

    switch (this.type) {
      case 'walterdemo':
        this.value = await this.getValueWalterDemo();
        this.lastFetched = now;
        return this.value;
    }

    console.warn(`Cannot retrieve value from data source of type ${this.type}`);
    return undefined;
  };

  /**
   * Return a plain javascript object which represents this datasource.
   * 
   * @return {Object} A POJO representing a this datasource.
   */
  toJS = () => {
    return {
      type: this.type,
      board: this.board,
      parameter: this.parameter
    }
  }
}