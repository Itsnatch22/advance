/**
 * Standard API response envelope for all routes
 * Ensures consistent response format across the application
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  meta?: Record<string, unknown>;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta && { meta }),
  };
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string,
  meta?: Record<string, unknown>
): ApiErrorResponse {
  return {
    success: false,
    error,
    ...(meta && { meta }),
  };
}

/**
 * Normalize legacy responses to the new standard envelope
 * Accepts a variety of legacy shapes and converts them into { success, data?, error?, meta? }
 */
export function normalizeResponse<T = unknown>(
  response: unknown,
  overrides?: Partial<ApiResponse>
): ApiResponse<T> {
  // Already a standard ApiResponse-like object
  if (
    response &&
    typeof response === "object" &&
    "success" in (response as Record<string, unknown>) &&
    typeof (response as Record<string, unknown>).success === "boolean"
  ) {
    return response as ApiResponse<T>;
  }

  // Legacy shapes: { data }, { resources }, { items }, { message, status }, plain arrays/objects, or strings
  if (response && typeof response === "object") {
    const r = response as Record<string, unknown>;
    if ("data" in r) return ({ success: true, data: r.data as unknown as T, ...overrides } as ApiResponse<T>);
    if ("resources" in r) return ({ success: true, data: r.resources as unknown as T, ...overrides } as ApiResponse<T>);
    if ("items" in r) return ({ success: true, data: r.items as unknown as T, ...overrides } as ApiResponse<T>);
    if ("message" in r && ("status" in r || "code" in r)) {
      return ({ success: false, error: String(r.message), ...overrides } as ApiResponse<T>);
    }
    // Fallback: wrap whole object as data
    return ({ success: true, data: r as unknown as T, ...overrides } as ApiResponse<T>);
  }

  // String or primitive -> treat as message/error
  if (typeof response === "string") {
    return ({ success: false, error: response, ...overrides } as ApiResponse<T>);
  }

  // Default: unknown -> empty success with no data
  return ({ success: true, data: (null as unknown) as T, ...overrides } as ApiResponse<T>);
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  meta?: Record<string, unknown>
) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return {
    success: true,
    data: {
      items,
      pagination: {
        total,
        page,
        pageSize,
        pages,
        hasMore: page < pages,
      },
    },
    ...(meta && { meta }),
  };
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in (error as Record<string, unknown>)) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred";
}

import { NextResponse } from "next/server";

/**
 * Send a standardized Next.js response for success
 */
export function sendSuccess<T>(
  data: T,
  status = 200,
  meta?: Record<string, unknown>,
  extraHeaders?: Record<string, string>
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    {
      status,
      headers: extraHeaders,
    }
  );
}

/**
 * Send a standardized Next.js response for errors
 */
export function sendError(
  error: string,
  status = 500,
  meta?: Record<string, unknown>,
  extraHeaders?: Record<string, string>
) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(meta && { meta }),
    },
    {
      status,
      headers: extraHeaders,
    }
  );
}
