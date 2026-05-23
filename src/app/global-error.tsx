"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6E8", padding: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", color: "#463C2E" }}>Algo deu errado.</h2>
            <button
              onClick={() => reset()}
              style={{ marginTop: "32px", padding: "12px 24px", background: "#463C2E", color: "#F8F6E8", border: "none", cursor: "pointer", textTransform: "uppercase", fontSize: "14px", letterSpacing: "-0.06em" }}
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
