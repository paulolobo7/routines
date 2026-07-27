"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Clock, Edit2, ListChecks, MoreHorizontal, Plus, Target, Timer, Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActiveTask } from "@/hooks/useActiveTask"
import { useStorage } from "@/hooks/useStorage"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Task } from "@/types"

const TASK_LIMITS = {
  minPomodoros: 1,
  maxPomodoros: 12,
} as const

function clampPomodoros(value: number): number {
  if (!Number.isFinite(value)) return TASK_LIMITS.minPomodoros
  return Math.min(TASK_LIMITS.maxPomodoros, Math.max(TASK_LIMITS.minPomodoros, Math.round(value)))
}

function formatTime(minutes: number): string {
  if (!minutes) return "0m"
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`
}

export function TaskList() {
  const [tasks, setTasks, isClient] = useStorage<Task[]>({
    key: LOCAL_STORAGE_KEYS.tasks,
    initialValue: [],
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [didSubmit, setDidSubmit] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    pomodorosNeeded: 1,
  })

  const { activeTaskId, setActiveTask } = useActiveTask()
  const currentTasks = useMemo(() => tasks ?? [], [tasks])

  const summary = useMemo(() => {
    const completedTasks = currentTasks.filter((task) => task.completed).length
    const totalPomodoros = currentTasks.reduce((sum, task) => sum + task.pomodorosCompleted, 0)
    const totalPlanned = currentTasks.reduce((sum, task) => sum + task.pomodorosNeeded, 0)
    const totalMinutes = currentTasks.reduce((sum, task) => sum + (task.timeSpentMinutes || 0), 0)

    return {
      completedTasks,
      totalTasks: currentTasks.length,
      totalPomodoros,
      totalPlanned,
      totalMinutes,
      allDone: currentTasks.length > 0 && completedTasks === currentTasks.length,
    }
  }, [currentTasks])

  const titleError = didSubmit && formData.title.trim().length === 0
  const isFormValid = formData.title.trim().length > 0

  const resetForm = () => {
    setFormData({ title: "", pomodorosNeeded: 1 })
    setEditingTask(null)
    setDidSubmit(false)
    setIsDialogOpen(false)
  }

  const openCreateDialog = () => {
    setEditingTask(null)
    setFormData({ title: "", pomodorosNeeded: 1 })
    setDidSubmit(false)
  }

  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      pomodorosNeeded: clampPomodoros(task.pomodorosNeeded),
    })
    setDidSubmit(false)
    setIsDialogOpen(true)
  }

  const createTask = () => {
    setDidSubmit(true)
    if (!isFormValid) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      pomodorosNeeded: clampPomodoros(formData.pomodorosNeeded),
      pomodorosCompleted: 0,
      completed: false,
      timeSpentMinutes: 0,
      createdAt: new Date(),
    }

    setTasks((prev) => [...(prev || []), newTask])
    resetForm()
  }

  const updateTask = () => {
    setDidSubmit(true)
    if (!editingTask || !isFormValid) return

    setTasks((prev) =>
      prev?.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: formData.title.trim(),
              pomodorosNeeded: clampPomodoros(formData.pomodorosNeeded),
            }
          : task
      ) || []
    )
    resetForm()
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev?.filter((task) => task.id !== taskId) || [])
    if (activeTaskId === taskId) {
      setActiveTask(null)
    }
  }

  const toggleTask = (id: string) => {
    const taskToToggle = currentTasks.find((task) => task.id === id)
    const shouldClearActiveTask = taskToToggle ? !taskToToggle.completed && activeTaskId === id : false

    setTasks((prev) =>
      prev?.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ) || []
    )

    if (shouldClearActiveTask) {
      setActiveTask(null)
    }
  }

  const incrementPomodoro = (taskId: string) => {
    setTasks((prev) =>
      prev?.map((task) => {
        if (task.id !== taskId) return task

        const pomodorosCompleted = Math.min(task.pomodorosCompleted + 1, task.pomodorosNeeded)
        return {
          ...task,
          pomodorosCompleted,
          completed: pomodorosCompleted >= task.pomodorosNeeded,
        }
      }) || []
    )
  }

  return (
    <>
      <Card className="animate-fade-in-up border-border/70 bg-surface-elevated py-0 shadow-[var(--shadow-soft)]">
        <CardHeader className="gap-4 p-4 pb-3 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-primary">
                Planejamento
              </p>
              <CardTitle id="tasks-title" className="mt-1 text-xl">
                Tarefas de hoje
              </CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                {summary.completedTasks}/{summary.totalTasks} concluidas, {summary.totalPomodoros}/{summary.totalPlanned || 0} pomodoros
              </p>
            </div>

            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) resetForm()
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="min-h-10 w-full rounded-lg whitespace-normal sm:w-auto" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Nova
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingTask ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
                  <DialogDescription>
                    Defina um objetivo pequeno o suficiente para caber em ciclos de foco.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Titulo da tarefa</Label>
                    <Input
                      id="task-title"
                      placeholder="Ex: Revisar proposta"
                      value={formData.title}
                      onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                      aria-invalid={titleError}
                      aria-describedby={titleError ? "task-title-error" : undefined}
                    />
                    {titleError && (
                      <p id="task-title-error" className="text-sm text-destructive">
                        Informe um titulo para continuar.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pomodoros-needed">Pomodoros planejados</Label>
                    <Input
                      id="pomodoros-needed"
                      type="number"
                      inputMode="numeric"
                      min={TASK_LIMITS.minPomodoros}
                      max={TASK_LIMITS.maxPomodoros}
                      value={formData.pomodorosNeeded}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          pomodorosNeeded: clampPomodoros(Number(event.target.value)),
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Use entre {TASK_LIMITS.minPomodoros} e {TASK_LIMITS.maxPomodoros} pomodoros.
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button onClick={editingTask ? updateTask : createTask}>
                    {editingTask ? "Salvar" : "Criar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {summary.totalTasks > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border/70 bg-surface p-3">
                <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  Tempo dedicado
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{formatTime(summary.totalMinutes)}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-surface p-3">
                <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                  Status
                </p>
                <p className="mt-1 text-lg font-semibold">{summary.allDone ? "Concluido" : "Em progresso"}</p>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
          {!isClient && (
            <div className="space-y-3" aria-label="Carregando tarefas">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          )}

          {isClient && currentTasks.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-surface p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <ListChecks className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-4 font-semibold text-foreground">Nenhuma tarefa criada</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Crie uma tarefa para vincular sua proxima sessao de foco.
              </p>
            </div>
          )}

          {isClient && summary.allDone && (
            <div className="rounded-lg border border-success/25 bg-break-soft p-3 text-sm font-medium text-success">
              Todas as tarefas foram concluidas. Voce pode planejar a proxima rodada quando quiser.
            </div>
          )}

          {isClient &&
            currentTasks.map((task) => {
              const isActive = activeTaskId === task.id
              const progress = task.pomodorosNeeded > 0
                ? Math.min(100, (task.pomodorosCompleted / task.pomodorosNeeded) * 100)
                : 0

              return (
                <article
                  key={task.id}
                  className={cn(
                    "rounded-lg border p-3 transition-colors duration-200",
                    task.completed
                      ? "border-border/70 bg-surface text-muted-foreground"
                      : isActive
                        ? "border-primary/45 bg-focus-soft/70"
                        : "border-border/70 bg-card hover:bg-surface"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1 h-5 w-5 rounded-full"
                      aria-label={task.completed ? `Marcar ${task.title} como pendente` : `Marcar ${task.title} como concluida`}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3
                            className={cn(
                              "truncate text-sm font-semibold text-foreground",
                              task.completed && "text-muted-foreground line-through"
                            )}
                          >
                            {task.title}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Target className="h-3.5 w-3.5" aria-hidden="true" />
                              {task.pomodorosCompleted}/{task.pomodorosNeeded}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              {formatTime(task.timeSpentMinutes || 0)}
                            </span>
                            {isActive && (
                              <span className="rounded-md bg-primary px-2 py-0.5 font-medium text-primary-foreground">
                                Ativa
                              </span>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="h-9 w-9 shrink-0"
                              aria-label={`Abrir acoes da tarefa ${task.title}`}
                            >
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(task)}>
                              <Edit2 className="mr-2 h-4 w-4" aria-hidden="true" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setTaskToDelete(task.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                        <div
                          className={cn("h-full rounded-full", task.completed ? "bg-success" : "bg-primary")}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <Button
                          type="button"
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveTask(isActive ? null : task.id)}
                          disabled={task.completed}
                          aria-pressed={isActive}
                          className="min-h-10 min-w-0 rounded-lg whitespace-normal"
                        >
                          <Target className="h-4 w-4" aria-hidden="true" />
                          {isActive ? "Remover foco" : "Focar"}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => incrementPomodoro(task.id)}
                          disabled={task.completed || task.pomodorosCompleted >= task.pomodorosNeeded}
                          className="min-h-10 min-w-0 rounded-lg whitespace-normal"
                        >
                          <Timer className="h-4 w-4" aria-hidden="true" />
                          Registrar ciclo
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
        </CardContent>
      </Card>

      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa acao remove a tarefa e o tempo dedicado vinculado a ela. O historico de sessoes ja registradas sera mantido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (taskToDelete) {
                  deleteTask(taskToDelete)
                  setTaskToDelete(null)
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
