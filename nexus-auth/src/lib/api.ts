import { NextResponse } from 'next/server';

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError      = { success: false; message: string; errors?: Record<string, string[]> };

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data }, { status });
}

export function err(message: string, status = 400, errors?: Record<string, string[]>) {
  return NextResponse.json<ApiError>({ success: false, message, errors }, { status });
}

export function zodErrors(zodError: { errors: { path: (string | number)[]; message: string }[] }) {
  const map: Record<string, string[]> = {};
  zodError.errors.forEach(({ path, message }) => {
    const key = String(path[0] ?? 'root');
    (map[key] ??= []).push(message);
  });
  return map;
}
