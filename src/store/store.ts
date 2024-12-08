import { action, computed, makeObservable, observable, runInAction } from 'mobx';


export class Store {
  lastUpdate = 0;
  light = false;
  private timer: NodeJS.Timeout | undefined;

  constructor() {
    makeObservable(this, {
      lastUpdate: observable,
      light: observable,
      start: action,
      hydrate: action,
      timeString: computed,
    });
  }

  start = () => {
    this.timer = setInterval(() => {
      runInAction(() => {});
      this.lastUpdate = Date.now();
      this.light = true;
    }, 1000);
  };

  get timeString() {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    const format = (t) =>
      `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:${pad(
        t.getUTCSeconds()
      )}`;
    return format(new Date(this.lastUpdate));
  }

  stop = () => clearInterval(this.timer);

  hydrate = (data: { lastUpdate: number | null; light: any }) => {
    if (!data) return;

    this.lastUpdate = data.lastUpdate !== null ? data.lastUpdate : Date.now();
    this.light = !!data.light;
  };
}