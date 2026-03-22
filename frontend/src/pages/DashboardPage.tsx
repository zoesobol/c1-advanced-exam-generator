import { useAuth } from "@/features/auth/AuthContext";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-500">Protected area</p>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-zinc-600">
              Logged in as{" "}
              <span className="font-medium text-zinc-950">{user?.email}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-zinc-900 hover:text-zinc-950"
          >
            Log out
          </button>
        </header>

        <section className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold">
            Your exam workspace is almost ready
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            This is the first protected page. Next up: exam creation and Part 1
            generation.
          </p>
        </section>
      </div>
    </main>
  );
}
