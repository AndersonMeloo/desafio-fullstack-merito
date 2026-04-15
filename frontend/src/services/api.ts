import type { ApiResponse } from "../types/dashboard"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  const payload = (await response.json()) as Partial<ApiResponse<T>> & {
    message?: string
  }

  if (!response.ok) {
    throw new Error(payload.message ?? 'Erro ao processar requisicao')
  }

  return (payload.data ?? payload) as T
}
