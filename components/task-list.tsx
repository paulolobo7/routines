"use client"

import { useState } from "react"
import { Check, Circle, Plus, Edit2, Trash2, Timer, MoreHorizontal, ListChecks } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStorage } from "@/hooks/useStorage"
import { Task } from "@/types"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"
import { useActiveTask } from "@/hooks/useActiveTask"

export function TaskList() {
  const [tasks, setTasks] = useStorage<Task[]>({
    key: LOCAL_STORAGE_KEYS.tasks,
    initialValue: []
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    pomodorosNeeded: 1
  })

  const { activeTaskId, setActiveTask } = useActiveTask()

  const formatTime = (minutes: number) => {
    if (!minutes || minutes === 0) return null
    if (minutes < 60) return `${minutes}m`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m === 0 ? `${h}h` : `${h}h ${m}m`
  }


  // Criar nova tarefa
  const createTask = () => {
    if (!formData.title.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      pomodorosNeeded: Math.max(1, formData.pomodorosNeeded),
      pomodorosCompleted: 0,
      completed: false,
      timeSpentMinutes: 0,
      createdAt: new Date()
    }

    setTasks(prev => [...(prev || []), newTask])
    resetForm()
  }

  // Editar tarefa existente
  const updateTask = () => {
    if (!editingTask || !formData.title.trim()) return

    setTasks(prev => prev?.map(task =>
      task.id === editingTask.id
        ? {
          ...task,
          title: formData.title.trim(),
          pomodorosNeeded: Math.max(1, formData.pomodorosNeeded)
        }
        : task
    ) || [])
    resetForm()
  }

  // Deletar tarefa
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev?.filter(task => task.id !== taskId) || [])
  }

  // Toggle conclusão da tarefa
  const toggleTask = (id: string) => {
    if (!tasks) return
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  // Incrementar pomodoro completado


  const incrementPomodoro = (taskId: string) => {
    setTasks(prev => prev?.map(task =>
      task.id === taskId
        ? {
          ...task,
          pomodorosCompleted: Math.min(task.pomodorosCompleted + 1, task.pomodorosNeeded),
          completed: task.pomodorosCompleted + 1 >= task.pomodorosNeeded
        }
        : task
    ) || [])
  }

  // Resetar formulário
  const resetForm = () => {
    setFormData({ title: "", pomodorosNeeded: 1 })
    setEditingTask(null)
    setIsDialogOpen(false)
  }

  // Abrir modal para edição
  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      pomodorosNeeded: task.pomodorosNeeded
    })
    setIsDialogOpen(true)
  }

  // Estatísticas
  const completedTasks = tasks?.filter(task => task.completed).length || 0
  const totalTasks = tasks?.length || 0
  const totalPomodoros = tasks?.reduce((sum, task) => sum + task.pomodorosCompleted, 0) || 0

  return (
    <Card className="border-none bg-card shadow-sm animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Tarefas de Hoje</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {completedTasks}/{totalTasks} concluídas • {totalPomodoros} pomodoros
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-primary"
              onClick={() => {
                setEditingTask(null)
                setFormData({ title: "", pomodorosNeeded: 1 })
              }}
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Editar Tarefa" : "Nova Tarefa"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Título da tarefa</Label>
                <Input
                  id="task-title"
                  placeholder="Ex: Revisar relatório mensal"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pomodoros-needed">Pomodoros necessários</Label>
                <Input
                  id="pomodoros-needed"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.pomodorosNeeded}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pomodorosNeeded: parseInt(e.target.value) || 1
                  }))}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={editingTask ? updateTask : createTask}
                  className="flex-1"
                >
                  {editingTask ? "Salvar" : "Criar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-3">
        {tasks && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="mb-4 rounded-full bg-muted p-4">
              <ListChecks className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Nenhuma tarefa ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie sua primeira tarefa para organizar o dia
            </p>
          </div>
        )}

        {tasks?.map((task) => (
          <div
            key={task.id}
            className={`group flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:bg-muted/50 ${task.completed ? "opacity-60" : ""
              }`}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleTask(task.id)}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${task.completed
                  ? "border-primary bg-primary"
                  : "border-muted-foreground hover:border-primary"
                }`}
            >
              {task.completed ? (
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              ) : (
                <Circle className="h-3.5 w-3.5 opacity-0" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${task.completed ? "line-through" : ""}`}>
                {task.title}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                {Array.from({ length: task.pomodorosNeeded }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-colors ${i < task.pomodorosCompleted ? "bg-primary" : "bg-muted"
                      }`}
                  />
                ))}
                
                <span className="ml-1 text-xs text-muted-foreground">
                  {task.pomodorosCompleted}/{task.pomodorosNeeded}
                </span>
              </div>
              {task.timeSpentMinutes > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    ⏱{formatTime(task.timeSpentMinutes)} dedicados
                  </p>)}
            </div>

            {/* Actions — sempre visível em mobile, hover em desktop */}
            <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">

              {!task.completed && (
                <Button
                size="sm"
                variant={activeTaskId === task.id ? "default" : "ghost"}
                onClick={() => setActiveTask(activeTaskId === task.id ? null : task.id)}
                className="h-8 px-2 text-xs "
                >
                  {activeTaskId === task.id ? "Ativa" : "Focar"}
                </Button>
              )}



              {!task.completed && task.pomodorosCompleted < task.pomodorosNeeded && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => incrementPomodoro(task.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <Timer className="h-4 w-4" />
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditDialog(task)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
