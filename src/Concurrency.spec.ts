import { beforeEach, describe, expect, it } from "vitest";
import { HttpClientFake } from "./http-client/HttpClientFake";
import { retrieveInfo } from "./Concurrency";
import { sleep } from "./sleep";

const firstUrl = "https://api.example.com/1";
const secondUrl = "https://api.example.com/2";
const thirdUrl = "https://api.example.com/3";
const fourthUrl = "https://api.example.com/4";
const fifthUrl = "https://api.example.com/5";

describe("Concurrency", () => {
  let httpClient: HttpClientFake;

  beforeEach(() => {
    httpClient = HttpClientFake.create();
  });

  it("checks it works correctly", async () => {
    const urls = [firstUrl, secondUrl, thirdUrl];

    await retrieveInfo(urls, 3, httpClient);

    urls.forEach((u) => expect(httpClient.pathHasBeenCalled(u)).toBeTruthy());
  });

  it("should respect max concurrency limit", async () => {
    const maxConcurrency = 2;
    const urls = [firstUrl, secondUrl, thirdUrl, fourthUrl];
    httpClient.makeWithDelay(firstUrl, 100);
    httpClient.makeWithDelay(secondUrl, 100);

    const promise = retrieveInfo(urls, 2, httpClient);

    await sleep(50);
    expect(httpClient.pathHasBeenCalled(firstUrl)).toBeTruthy();
    expect(httpClient.pathHasBeenCalled(secondUrl)).toBeTruthy();
    expect(httpClient.pathHasBeenCalled(thirdUrl)).toBeFalsy();
    expect(httpClient.pathHasBeenCalled(fourthUrl)).toBeFalsy();
    await promise;
    expect(httpClient.pathHasBeenCalled(thirdUrl)).toBeTruthy();
    expect(httpClient.pathHasBeenCalled(fourthUrl)).toBeTruthy();
  });

  it("should start new request as soon as one finishes", async () => {
    const maxConcurrency = 2;
    const urls = [firstUrl, secondUrl, thirdUrl, fourthUrl, fifthUrl];
    httpClient.makeWithDelay(firstUrl, 100);
    httpClient.makeWithDelay(secondUrl, 200);
    httpClient.makeWithDelay(thirdUrl, 100);

    const promise = retrieveInfo(urls, maxConcurrency, httpClient);

    await sleep(50);
    expect(httpClient.pathHasBeenCalled(firstUrl)).toBeTruthy();
    expect(httpClient.pathHasBeenCalled(secondUrl)).toBeTruthy();
    expect(httpClient.pathHasBeenCalled(thirdUrl)).toBeFalsy();

    await sleep(100);
    expect(httpClient.pathHasBeenCalled(thirdUrl)).toBeTruthy();
    expect(httpClient.pathHasBeenCalled(fourthUrl)).toBeFalsy();

    await promise;
    expect(httpClient.pathHasBeenCalled(fourthUrl)).toBeTruthy();
    expect(httpClient.pathHasBeenCalled(fifthUrl)).toBeTruthy();
  });
});
