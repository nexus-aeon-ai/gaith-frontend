import env from "@/env.mjs";

import { getAuthToken } from "./functions";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL as string;

interface FetchOptions extends RequestInit {
  token?: string;
  responseType?: "json" | "blob";
}

export async function fetchInstance<T>(
  url: string,
  options: FetchOptions = {}
): Promise<{ status: number; data: T | null }> {
  const headers = new Headers(options.headers);

  const token = await getAuthToken();
  console.log(token);
  if (token) {
    console.log("token");
    headers.set("Authorization", `Bearer ${token}`);
  }
  console.log(headers, options);

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers, // pass the Headers object directly
  });

  if (response.status === 204) {
    return {
      status: response.status,
      data: null,
    };
  }

  const responseType = options.responseType || "json";

  const data =
    responseType === "blob" ? ((await response.blob()) as T) : ((await response.json()) as T);

  return {
    status: response.status,
    data,
  };
}
