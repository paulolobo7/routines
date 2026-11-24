import type { Task } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"

// Formato de erro da API: { error: { code, message, details?, requestId } }
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Tarefa como a API devolve: datas chegam como string ISO e ha campos que o front nao usa.
interface ApiTask extends Omit<Task, "createdAt"> {
  userId: string
  clientId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTaskPayload {
  title: string
  pomodorosNeeded: number
}

export type UpdateTaskPayload = Partial<
  Pick<Task, "title" | "pomodorosNeeded" | "pomodorosCompleted" | "timeSpentMinutes" | "completed">
>

export interface SyncResult {
  created: number
  skipped: number
  tasks: Task[]
}

function toTask({ userId: _userId, clientId: _clientId, updatedAt: _updatedAt, createdAt, ...rest }: ApiTask): Task {
  return { ...rest, createdAt: new Date(createdAt) }
}

async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: init.method ?? "GET",
      credentials: "include",
      // O Fastify rejeita Content-Type JSON com corpo vazio (ex.: DELETE), entao so envia quando ha corpo.
      headers: init.body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    })
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Nao foi possivel conectar ao servidor")
  }

  if (response.status === 204) return undefined as T

  const json = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      json?.error?.code ?? "UNKNOWN_ERROR",
      json?.error?.message ?? "Erro inesperado",
    )
  }
  return json.data as T
}

export const tasksApi = {
  list: async () => (await request<ApiTask[]>("/tasks")).map(toTask),

  create: async (payload: CreateTaskPayload) =>
    toTask(await request<ApiTask>("/tasks", { method: "POST", body: payload })),

  update: async (id: string, payload: UpdateTaskPayload) =>
    toTask(await request<ApiTask>(`/tasks/${id}`, { method: "PUT", body: payload })),

  remove: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),

  // Importacao do localStorage: o id local vira clientId e a API devolve os ids reais.
  sync: async (tasks: Task[]): Promise<SyncResult> => {
    const result = await request<{ created: number; skipped: number; tasks: ApiTask[] }>("/tasks/sync", {
      method: "POST",
      body: {
        tasks: tasks.map(({ id, createdAt, ...rest }) => ({
          ...rest,
          clientId: id,
          createdAt: new Date(createdAt).toISOString(),
        })),
      },
    })
    return { ...result, tasks: result.tasks.map(toTask) }
  },
}
