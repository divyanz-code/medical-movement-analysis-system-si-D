import type { ApiErrorEnvelope } from "../types/contracts";
import { debug, error as logError, warn } from "../debug/logger";

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
    const startedAt = Date.now();
    const url = `${this.baseUrl}${path}`;
    const headers = new Headers(init.headers ?? {});
    if (!options.isMultipart) {
      headers.set("content-type", "application/json");
    }
    if (options.authToken) {
      headers.set("authorization", `Bearer ${options.authToken}`);
    }

    debug("http", "request:start", {
      method: init.method ?? "GET",
      url,
      isMultipart: options.isMultipart ?? false
    });

    let response: Response;
    try {
      response = await fetch(url, {
        ...init,
        headers
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown network failure";
      logError("http", "request:network-failure", {
        method: init.method ?? "GET",
        url,
        message
      });
      throw new Error(
        `NETWORK_ERROR: Request to ${url} failed. Check EXPO_PUBLIC_API_BASE_URL, backend status, and iPhone/Mac same Wi-Fi.`
      );
    }

    const durationMs = Date.now() - startedAt;
    debug("http", "request:complete", {
      method: init.method ?? "GET",
      url,
      status: response.status,
      durationMs
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
        warn("http", "response:error-non-json", { url, status: response.status });
      }

      throw new Error(`${code}: ${message}`);
    }

    return (await response.json()) as T;
  }
}
