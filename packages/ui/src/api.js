export class CuraisAPIError extends Error {
  constructor({ code = "unknown_error", message, requestId = "", status = 0, details = [] }) {
    super(message || "Something went wrong. Please try again.");
    this.name = "CuraisAPIError";
    this.code = code;
    this.requestId = requestId;
    this.status = status;
    this.details = details;
  }
}

export async function readApiResponse(response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const apiError = payload?.error;
    throw new CuraisAPIError({
      code: apiError?.code || "invalid_api_response",
      message: apiError?.message || `The request failed with status ${response.status}.`,
      requestId: apiError?.requestId || response.headers.get("x-request-id") || "",
      status: response.status,
      details: apiError?.details || [],
    });
  }
  if (response.status === 204) return null;
  if (payload === null) {
    throw new CuraisAPIError({ code: "invalid_api_response", message: "The server returned an unreadable response.", status: response.status });
  }
  return payload;
}

export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  const message = error.message || fallback;
  return error.requestId && !message.includes(error.requestId) ? `${message} Reference: ${error.requestId}` : message;
}
