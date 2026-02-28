import type { ApiErrorEnvelope } from "../types/contracts.js";

export interface HttpClient {
  request<T>(
    path: string,
    init?: RequestInit,
    options?: { authToken?: string; isMultipart?: boolean }
  ): Promise<T>;
}

export class FetchHttpClient implements HttpClient {
  constructor(private readonly baseUrl: string) {}

  async request<T>(
    path: string,
    init: RequestInit = {},
    options: { authToken?: string; isMultipart?: boolean } = {}
  ): Promise<T> {
    const headers = new Headers(init.headers ?? {});
    if (!options.isMultipart) {
      headers.set("content-type", "application/json");
    }
    if (options.authToken) {
      headers.set("authorization", `Bearer ${options.authToken}`);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers
    });

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      let code = "HTTP_ERROR";

      try {
        const payload = (await response.json()) as ApiErrorEnvelope;
        message = payload.error.message;
        code = payload.error.code;
      } catch {
        // keep fallback values
      }

      throw new Error(`${code}: ${message}`);
    }

    return (await response.json()) as T;
  }
}
