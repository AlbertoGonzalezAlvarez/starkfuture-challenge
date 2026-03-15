import { HttpClient, HttpResponse } from "./HttpClient";
import { sleep } from "../sleep";

export class HttpClientFake implements HttpClient {
  private readonly calls: Map<string, { isCalled: boolean }> = new Map();
  private readonly delayedCalls: Map<string, { delayInMs: number }> = new Map();

  static create() {
    return new HttpClientFake();
  }

  async get<T>(path: string) {
    this.calls.set(path, { isCalled: true });

    const haveDelay = this.delayedCalls.get(path);
    if (haveDelay) await sleep(haveDelay.delayInMs);

    return { data: path } as HttpResponse<T>;
  }

  makeWithDelay(path: string, delayInMs: number = 5_000) {
    this.delayedCalls.set(path, { delayInMs });
  }

  pathHasBeenCalled(path: string) {
    return Boolean(this.calls.get(path)?.isCalled);
  }
}
