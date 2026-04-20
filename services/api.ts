import Constants from "expo-constants";
import { Platform } from "react-native";

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

export async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API hatası: ${response.status}`);
  }

  return response.json();
}