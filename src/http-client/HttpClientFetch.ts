import { HttpClient, HttpResponse } from "./HttpClient";

type HttpClientFetchProps = {
  baseUrl: string;
};

type HttpClientFetchCreateProps = {
  baseUrl?: string;
};

export class HttpClientFetch implements HttpClient {
  private readonly baseUrl: string;

  private constructor({ baseUrl }: HttpClientFetchProps) {
    this.baseUrl = baseUrl;
  }

  static create(options: HttpClientFetchCreateProps = {}) {
    return new HttpClientFetch({
      baseUrl: "",
      ...options,
    });
  }

  async get<T>(path: string) {
    const url = this.baseUrl + path;

    const response = await fetch(url);

    const headers: Record<string, string> = {};

    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const data: T = headers["content-type"]?.includes("json")
      ? await response.json()
      : await response.text();

    return {
      data,
      headers,
      status: response.status,
    };
  }
}
