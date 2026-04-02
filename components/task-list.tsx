"use client"

import { useState } from "react"
import { Check, Circle, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const initialTasks = [
  { id: 1, title: "Revisar relatório mensal", pomodoros: 3, completed: 2, done: false },
  { id: 2, title: "Responder emails importantes", pomodoros: 2, completed: 2, done: true },
  { id: 3, title: "Preparar apresentação", pomodoros: 4, completed: 1, done: false },
  { id: 4, title: "Estudar documentação", pomodoros: 2, completed: 0, done: false },
]

export function TaskList() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    ))
  }

  return (
    <Card className="border-none bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Tarefas de Hoje</CardTitle>
        <Button variant="ghost" size="sm" className="gap-2 text-primary">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:bg-muted/50 ${
              task.done ? "opacity-60" : ""
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                task.done
                  ? "border-primary bg-primary"
                  : "border-muted-foreground hover:border-primary"
              }`}
            >
              {task.done ? (
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              ) : (
                <Circle className="h-3.5 w-3.5 opacity-0" />
              )}
            </button>

            <div className="flex-1">
              <p className={`font-medium ${task.done ? "line-through" : ""}`}>
                {task.title}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                {Array.from({ length: task.pomodoros }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i < task.completed ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs text-muted-foreground">
                  {task.completed}/{task.pomodoros}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
