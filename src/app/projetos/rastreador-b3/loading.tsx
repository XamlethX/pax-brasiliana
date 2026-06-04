export default function Loading() {
  return (
    <div className="min-h-dvh bg-mist">
      <div className="pt-32 px-5 lg:px-10" role="status" aria-label="Carregando rastreador B3">
        <div className="h-10 w-2/3 max-w-[480px] bg-bark/10 animate-pulse mb-6" />
        <div className="h-5 w-1/2 max-w-[360px] bg-bark/10 animate-pulse mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="border-[0.5px] border-bark/20 h-[120px] p-4 flex flex-col justify-between"
            >
              <div className="h-4 w-1/2 bg-bark/10 animate-pulse" />
              <div className="h-8 w-2/3 bg-bark/10 animate-pulse" />
              <div className="h-3 w-1/3 bg-bark/10 animate-pulse" />
            </div>
          ))}
        </div>
        <span className="sr-only">Carregando dados das empresas</span>
      </div>
    </div>
  );
}
