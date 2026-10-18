const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function customInstance<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const fullUrl = `${BASE_URL}${url}`;

  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return { data, status: response.status, headers: response.headers } as T;
}
