import { NextResponse } from "next/server";

interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  result?: T;
  errors?: unknown;
}

export function ApiResponse<T>({
  success,
  statusCode,
  message,
  result,
  errors,
}: ApiResponse<T>) {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      result,
      errors,
    },
    {
      status: statusCode,
    },
  );
}
