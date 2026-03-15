import { HttpClient, HttpResponse } from "./http-client/HttpClient";

// Given an array of URLs and a MAX_CONCURRENCY integer, implement a
// function that will asynchronously fetch each URL, not requesting
// more than MAX_CONCURRENCY URLs at the same time. The URLs should be
// fetched as soon as possible. The function should return an array of
// responses for each URL.

// How would you write a test for such a function?

export const retrieveInfo = async (
  urls: string[],
  maxConcurrency: number,
  httpClient: HttpClient,
): Promise<HttpResponse<any>[]> => {
  const results: HttpResponse<any>[] = [];
  let currentIndex = 0;

  const worker = async () => {
    while (currentIndex < urls.length) {
      const index = currentIndex++;
      const url = urls[index];
      const response = await httpClient.get(url);
      results.push(response);
    }
  };

  const workers = Array.from(
    { length: Math.min(maxConcurrency, urls.length) },
    worker,
  );

  await Promise.all(workers);

  return results;
};
