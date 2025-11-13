type TBaseOptionsParameters<T> = {
  options?: RequestInit;
  body?: T;
};

class Api {
  private baseApiUrl: string;

  constructor() {
    this.baseApiUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  }

  private async baseOptions<T>(
    gOptions: TBaseOptionsParameters<T>
  ): Promise<RequestInit> {
    const headers: Record<string, string> = {
      ...(gOptions.options?.headers as Record<string, string> ?? {}),
    };

    let body: BodyInit | undefined;

    if (gOptions?.body instanceof FormData) {
      body = gOptions.body;
    } else if (gOptions?.body !== undefined && gOptions?.body !== null) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(gOptions.body);
    }

    return {
      ...gOptions.options,
      headers,
      body,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T | null> {
    if (response.status === 204) return null;

    const contentType = response.headers.get("Content-Type") ?? "";

    if (response.ok) {
      if (contentType.includes("application/json")) {
        return (await response.json()) as T;
      }
      return null as T;
    }

    try {
      const err = contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };
      throw new Error(err.Message || err.message || "Ocurrió un error");
    } catch {
      throw new Error("Ocurrió un error desconocido");
    }
  }

  public async get<T>(shortUrl: string, options?: RequestInit): Promise<T | null> {
    const response = await fetch(
      `${this.baseApiUrl}/${shortUrl}`,
      await this.baseOptions({ options })
    );
    return this.handleResponse<T>(response);
  }

  public async post<T, K>(
    shortUrl: string,
    body: K,
    options?: RequestInit
  ): Promise<T | null> {
    const response = await fetch(`${this.baseApiUrl}/${shortUrl}`, {
      method: "POST",
      ...(await this.baseOptions({ options, body })),
    });
    return this.handleResponse<T>(response);
  }

  public async put<K>(
    shortUrl: string,
    body: K,
    options?: RequestInit
  ): Promise<void | Error | null> {
    const response = await fetch(`${this.baseApiUrl}/${shortUrl}`, {
      method: "PUT",
      ...(await this.baseOptions({ options, body })),
    });
    return this.handleResponse<void>(response);
  }

  public async delete<T>(
    shortUrl: string,
    options?: RequestInit
  ): Promise<T | null> {
    const response = await fetch(`${this.baseApiUrl}/${shortUrl}`, {
      method: "DELETE",
      ...(await this.baseOptions({ options })),
    });
    return this.handleResponse<T>(response);
  }

  public async getDownloadFile(
    shortUrl: string,
    options?: RequestInit
  ): Promise<Response> {
    return fetch(`${this.baseApiUrl}/${shortUrl}`, await this.baseOptions({ options }));
  }

}

const api = new Api();
export const apiClient = api;
