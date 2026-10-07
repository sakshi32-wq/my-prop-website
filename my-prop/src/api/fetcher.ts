// Orval mutator: every generated request goes through customFetch.

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "/api"

const TOKEN_STORAGE_KEY = "myprop.token"

export class ApiError<TBody = unknown> extends Error {
  readonly status: number
  readonly body: TBody

  constructor(status: number, body: TBody) {
    super(errorMessage(body) ?? `Request failed with status ${status}`)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

/** Orval uses this as the error type of every generated hook. */
export type ErrorType<TBody> = ApiError<TBody>

function errorMessage(body: unknown) {
  if (typeof body === "object" && body !== null && "message" in body) {
    const { message } = body
    if (typeof message === "string" && message) return message
  }
  return undefined
}

/** Stores (or with null, clears) the session token sent with every request. */
export function setAuthToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token)
    else localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // Storage is blocked; the session just won't survive a reload.
  }
}

function readToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    // No storage on the server, or it's blocked in the browser.
    return null
  }
}

function resolveUrl(path: string) {
  const url = `${API_BASE_URL}${path}`
  // Node's fetch rejects relative URLs, and MSW can't intercept them in Vitest.
  if (typeof window === "undefined") return url
  return new URL(url, window.location.origin).toString()
}

async function parseBody(response: Response) {
  if (response.status === 204) return undefined
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

export async function customFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers)
  const token = readToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (!headers.has("Accept")) headers.set("Accept", "application/json")

  const response = await fetch(resolveUrl(path), { ...options, headers })
  const body = await parseBody(response)
  if (!response.ok) throw new ApiError(response.status, body)
  return body as T
}
