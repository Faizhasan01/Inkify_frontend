const API_URL = import.meta.env.VITE_API_URL || "";

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(errorData.error || "Request failed");
  }

  return response.json();
}

export function getApiUrl() {
  return API_URL;
}

export function getWsUrl() {
  const apiUrl = API_URL || window.location.origin;
  const url = new URL(apiUrl);
  const protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${url.host}/ws`;
}
