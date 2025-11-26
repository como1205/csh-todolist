function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <p className="rounded-full bg-brand-muted px-5 py-2 text-sm font-semibold text-brand-dark">
        csh-TodoList · frontend bootstrap
      </p>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          React + Tailwind starter ready to build on
        </h1>
        <p className="text-base text-slate-600">
          Task 1.2 requirements are installed (Vite, React Router, Axios, Zustand,
          Tailwind). Replace this placeholder view with the actual UI when the
          API contracts are ready.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
        <span className="rounded-full border border-slate-200 px-4 py-2">
          React 18
        </span>
        <span className="rounded-full border border-slate-200 px-4 py-2">
          TypeScript
        </span>
        <span className="rounded-full border border-slate-200 px-4 py-2">
          Tailwind CSS
        </span>
      </div>
    </main>
  )
}

export default App
