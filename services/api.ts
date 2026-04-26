import Constants from "expo-constants";
import { Platform } from "react-native";

export class ApiError extends Error {
  status: number;
  details?: string;

  constructor(message: string, status: number, details?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const hostUri =
  Constants.expoConfig?.hostUri ||
  (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
  (Constants as any).manifest?.debuggerHost;

const lanHost = hostUri?.split(":")[0];

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "web"
    ? "http://localhost:5000/api"
    : lanHost
    ? `http://${lanHost}:5000/api`
    : Platform.OS === "android"
    ? "http://10.0.2.2:5000/api"
    : "http://localhost:5000/api");

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const raw = await response.text();
  if (!raw) {
    return undefined as T;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as T;
  }
}

export async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`[API] ${options?.method || "GET"} ${endpoint}`);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  console.log(`[API] Response status: ${response.status}`);

  if (!response.ok) {
    const errorBody = await response.text();
    let details = errorBody;

    try {
      const json = JSON.parse(errorBody);
      details = json?.message || json?.error || json?.title || errorBody;
    } catch {
      // Keep raw body when response is not JSON.
    }

    throw new ApiError(
      `API hatasi (${response.status})`,
      response.status,
      details || undefined
    );
  }

  const result = await parseResponse<T>(response);
  console.log(`[API] Response data:`, result);
  return result;
}