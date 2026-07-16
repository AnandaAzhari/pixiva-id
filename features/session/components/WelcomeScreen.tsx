interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-amber-50 px-6 py-10 text-slate-900 sm:px-10">
      <section className="w-full max-w-xl rounded-[2rem] bg-white px-8 py-12 text-center shadow-xl shadow-amber-950/10 sm:px-12 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Risol MamQi presents
        </p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
          Pixiva.ID
        </h1>
        <p className="mt-4 text-xl font-medium text-amber-800 sm:text-2xl">
          Every Moment Deserves a Frame.
        </p>

        <div className="mt-10 space-y-3 text-base leading-7 text-slate-600 sm:text-lg">
          <p className="font-semibold text-slate-800">Welcome to the photobooth!</p>
          <p>
            Capture a memory to take home and share. This experience is brought
            to you as a promotion by Risol MamQi.
          </p>
        </div>

        <button
          className="mt-10 min-h-16 w-full rounded-2xl bg-amber-600 px-6 py-4 text-xl font-bold text-white shadow-lg shadow-amber-900/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 active:bg-amber-800 sm:text-2xl"
          onClick={onStart}
          type="button"
        >
          Start
        </button>
      </section>
    </main>
  );
}
