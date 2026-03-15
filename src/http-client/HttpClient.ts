export interface HttpClient {
  get<T = any>(path: string): Promise<HttpResponse<T>>;
}

export interface HttpResponse<T> {
  data: T;
  headers: Record<string, string>;
  status: number;
}
