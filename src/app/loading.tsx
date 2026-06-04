export default function Loading() {
  return (
    <div className="min-h-dvh bg-mist grid-lines flex items-center justify-center px-5">
      <div className="flex flex-col items-center gap-5">
        <div
          className="w-8 h-8 border-2 border-bark/20 border-t-bark animate-spin"
          aria-hidden="true"
        />
        <p className="font-mono text-accents uppercase text-bark/50">
          Carregando…
        </p>
        <span className="sr-only" role="status">
          Carregando conteúdo
        </span>
      </div>
    </div>
  );
}
