export default function Loading() {
  return (
    <div className="min-h-dvh bg-mist">
      <div
        className="pt-32 px-5 lg:px-10"
        role="status"
        aria-label="Carregando base de produtos"
      >
        <div className="h-10 w-2/3 max-w-[520px] bg-bark/10 animate-pulse mb-6" />
        <div className="h-5 w-1/2 max-w-[400px] bg-bark/10 animate-pulse mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="border-[0.5px] border-bark/20 h-[200px] p-5 flex flex-col gap-4"
            >
              <div className="h-4 w-1/3 bg-bark/10 animate-pulse" />
              <div className="h-6 w-2/3 bg-bark/10 animate-pulse" />
              <div className="h-3 w-full bg-bark/10 animate-pulse" />
              <div className="h-3 w-5/6 bg-bark/10 animate-pulse" />
            </div>
          ))}
        </div>
        <span className="sr-only">Carregando produtos</span>
      </div>
    </div>
  );
}
