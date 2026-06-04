import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pax Brasiliana — Imaginar e construir o futuro brasileiro.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#463C2E",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#F8F6E8",
            fontSize: 28,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: "#F45141",
              marginRight: 18,
            }}
          />
          Pax Brasiliana
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#F8F6E8",
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            Imaginar e construir
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.05em",
              color: "#417CE5",
            }}
          >
            o futuro brasileiro.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: "#F8F6E8",
            fontSize: 26,
            opacity: 0.7,
            letterSpacing: "-0.02em",
          }}
        >
          É hora de construir o Brasil.
        </div>
      </div>
    ),
    { ...size }
  );
}
