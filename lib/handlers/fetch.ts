import logger from "../logger";
import handleError from "./error";
import { RequestError } from "@/lib/http-errors";

// RequestInit jest to wbudowany interfejs w TypeScript, który definiuje opcje konfiguracyjne dla funkcji fetch. Obejmuje on takie właściwości jak method, headers, body, mode, credentials, cache, redirect, referrer, referrerPolicy, integrity i keepalive. W tym przypadku rozszerzamy go o dodatkową właściwość timeout, która pozwala określić maksymalny czas oczekiwania na odpowiedź z serwera.
interface FetchOptions extends RequestInit {
  timeout?: number;
}

// To jest nasza pomocnicza funkcja, ktora bedzie sprawdzała czy mamy do czynienia z errorer
const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export async function fetchHandler<T>(url: string, options: FetchOptions = {}): Promise<ActionResponse<T>> {
  const { timeout = 5000, headers: customHeaders = {}, ...restOptions } = options;

  //   AbortController jest wbudowaną klasą w JavaScript, która pozwala na anulowanie operacji asynchronicznych, takich jak fetch. Tworzymy nowy obiekt AbortController, który będzie używany do anulowania żądania fetch po upływie określonego czasu.
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = {
    ...defaultHeaders,
    ...customHeaders,
  };

  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    // Jeśli odpowiedz nie dotrze do nas w określonym czasie, wywołamy metodę abort() na naszym obiekcie AbortController, co spowoduje przerwanie żądania fetch i rzucenie wyjątku typu AbortError. W bloku catch obsłużymy ten wyjątek i zalogujemy odpowiedni komunikat. Jeśli jednak odpowiedź dotrze to wyczyscimy nasz timeout, aby uniknąć niepotrzebnego wywołania abort() po zakończeniu żądania.
    clearTimeout(id);

    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error occurred");
    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out after ${timeout}ms`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }

    return handleError(error) as ActionResponse<T>;
  }
}
