# ☕ Routines

> Aplicativo de produtividade com **Timer Pomodoro** e **Gerenciamento de Tarefas** — projetado para quem quer manter o foco e organizar sua rotina.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss" alt="Tailwind" />
</p>

---

## ✨ Features

- **⏱ Timer Pomodoro** — Sessões de foco, pausa curta e pausa longa com progresso visual circular
- **🔄 Transição automática** — Ao terminar uma sessão, o timer muda automaticamente para o próximo modo
- **📋 Gerenciamento de Tarefas** — Criar, editar, deletar e vincular tarefas aos ciclos de pomodoro
- **📊 Estatísticas** — Tempo focado, sessões completadas, streak de dias e gráfico dos últimos 7 dias
- **⌨️ Atalhos de teclado** — `Espaço` (play/pause), `R` (reset), `1/2/3` (trocar modo)
- **🌙 Dark Mode** — Alternância automática (sistema) ou manual entre temas claro e escuro
- **📱 Responsivo** — Layout adaptado para desktop e mobile com bottom navigation
- **🔔 Notificações** — Alertas sonoros e push notifications ao completar sessões
- **💾 Persistência local** — Todos os dados salvos no `localStorage` — funciona offline

---

## 🛠 Stack Tecnológica

| Tecnologia | Uso |
|------------|-----|
| **Next.js 16** | Framework React com SSR, routing e otimizações |
| **React 19** | UI declarativa com hooks customizados |
| **TypeScript** | Tipagem estática em todo o projeto |
| **Tailwind CSS 4** | Estilização utility-first com design tokens customizados |
| **Radix UI** | Componentes acessíveis (Dialog, Dropdown, Progress) |
| **Recharts** | Gráficos de estatísticas |
| **Vercel Analytics** | Monitoramento de uso em produção |

---

## 🏗 Arquitetura

```
app/
├── page.tsx              # Página principal (composição dos componentes)
├── layout.tsx            # Layout raiz com tema e fontes
└── globals.css           # Design tokens (cores, animações)

components/
├── pomodoro-timer.tsx    # Timer circular com glow animado
├── task-list.tsx         # CRUD de tarefas com vinculação ao Pomodoro
├── stats-card.tsx        # Dashboard de estatísticas
├── settings-modal.tsx    # Configuração de durações
├── theme-toggle.tsx      # Alternância de tema
└── ui/                   # Componentes base (shadcn/ui)

hooks/
├── useTimer.ts           # Lógica do timer com transição automática de modos
├── useStats.ts           # Cálculo de estatísticas (streak, média, gráfico)
├── useSettings.ts        # Configurações persistidas do timer
├── useStorage.ts         # Abstração genérica do localStorage com sync
├── useActiveTask.ts      # Tarefa vinculada ao timer atual
└── useNotification.ts    # Web Notifications + Audio API
```

---

## 🧠 Decisões Técnicas

### Custom Hook `useStorage` com sincronização
Em vez de usar Context API ou bibliotecas como Zustand para estado global, optei por um hook customizado `useStorage` que abstrai o `localStorage` e usa `CustomEvent` para sincronizar entre componentes. Isso mantém o código simples, sem providers, e demonstra domínio de patterns do React.

### Timer com `useRef` para callbacks
O `onComplete` callback é armazenado em um `useRef` atualizado a cada render, evitando que o `useEffect` do timer seja recriado desnecessariamente. Isso é um pattern importante para performance em hooks que lidam com intervals.

### Separação de responsabilidades nos hooks
Cada hook tem uma responsabilidade única: `useTimer` não sabe sobre estatísticas, `useStats` não sabe sobre UI, e a composição acontece na página. Isso facilita testes unitários e manutenção.

---

## 🚀 Rodando localmente

```bash
# Instalar dependências
pnpm install

# Rodar em modo de desenvolvimento
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📦 Deploy

O projeto está configurado para deploy automático na [Vercel](https://vercel.com). Cada push para `main` gera um novo deploy.

---

## 📄 Licença

MIT © [Paulo Lobo](https://paulolobo.dev)
