"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#F8F6E8",
          color: "#463C2E",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 460 }}>
            <p
              style={{
                textTransform: "uppercase",
                letterSpacing: "-0.06em",
                fontSize: 13,
                color: "#F45141",
                marginBottom: 12,
              }}
            >
              Erro
            </p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>
              Algo deu errado.
            </h2>
            <p style={{ marginTop: 12, opacity: 0.6, lineHeight: 1.5 }}>
              Encontramos um problema inesperado. Tente novamente.
            </p>
            <button
              onClick={() => reset()}
              style={{
                marginTop: 28,
                padding: "12px 24px",
                background: "#463C2E",
                color: "#F8F6E8",
                border: "none",
                cursor: "pointer",
                textTransform: "uppercase",
                fontSize: 14,
                letterSpacing: "-0.06em",
              }}
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
