import React from "react";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

/**
 * Marca Pax Brasiliana — o Cruzeiro do Sul.
 * Estrela central de quatro pontas construída em barras horizontais densas,
 * com uma estrela em negativo recortada no centro, cercada pelas demais
 * estrelas do Cruzeiro. Geometria extraída 1:1 do desenho original,
 * redesenhada como vetor limpo (fill: currentColor) — nítida em qualquer
 * tamanho e recolorível via CSS (`text-bark`, `text-mist`, ...).
 */

const BAR_H = 9;

// Cada linha da estrela central: [cy, x1, x2] ou, quando a barra é dividida
// pelo recorte central, [cy, x1, x2, x3, x4] (segmento esquerdo + direito).
const ROWS: number[][] = [
  [11.8, 281, 284],
  [28.4, 279.8, 285.1],
  [47, 276, 289.5],
  [66.5, 270, 294],
  [86.5, 267.4, 298.6],
  [105, 260, 306.5],
  [124.5, 252.5, 314.5],
  [144.5, 241.1, 276.2, 289, 325],
  [162, 230.2, 271, 293.6, 338.1],
  [180.5, 212, 266, 299, 355.8],
  [199, 179, 255, 310, 386],
  [218.3, 112, 234, 330.4, 446.8],
  [238.3, 7.9, 187, 378.5, 553],
  [259, 111, 233.8, 330, 452],
  [277.9, 178.6, 256.2, 314.7, 384.5],
  [298.4, 213, 266, 299.7, 352],
  [317.5, 232, 272, 294.1, 334],
  [337, 245.8, 275.8, 289, 318.5],
  [356.6, 254, 310.5],
  [376.5, 262, 301.9],
  [396.5, 268.5, 296.5],
  [416.5, 272, 292],
  [438, 277.7, 287],
  [457.8, 281, 283.6],
];

// Estrelas de quatro pontas (côncavas): [cx, cy, rx, ry]
const SPARKLES: [number, number, number, number][] = [
  [416.7, 71, 26.5, 33.5],
  [86.7, 179.5, 27, 29],
  [508, 321, 27.5, 30.5],
  [372.5, 433, 22.5, 26],
];

function sparklePath(rx: number, ry: number): string {
  const cx = 0.3;
  const cy = 0.12;
  return [
    `M 0 ${-ry}`,
    `C ${rx * cy} ${-ry * cx}, ${rx * cx} ${-ry * cy}, ${rx} 0`,
    `C ${rx * cx} ${ry * cy}, ${rx * cy} ${ry * cx}, 0 ${ry}`,
    `C ${-rx * cy} ${ry * cx}, ${-rx * cx} ${ry * cy}, ${-rx} 0`,
    `C ${-rx * cx} ${-ry * cy}, ${-rx * cy} ${-ry * cx}, 0 ${-ry}`,
    "Z",
  ].join(" ");
}

export default function Logo({
  className = "",
  style,
  width,
  height,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 560 470"
      fill="none"
      className={className}
      style={style}
      width={width}
      height={height}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel ? "img" : undefined}
    >
      <g fill="currentColor">
        {ROWS.map(([cy, ...xs]) => {
          const y = cy - BAR_H / 2;
          const rects = [];
          for (let i = 0; i < xs.length; i += 2) {
            rects.push(
              <rect key={`${cy}-${xs[i]}`} x={xs[i]} y={y} width={xs[i + 1] - xs[i]} height={BAR_H} />
            );
          }
          return rects;
        })}
        {SPARKLES.map(([cx, cy, rx, ry]) => (
          <path key={`${cx}-${cy}`} transform={`translate(${cx}, ${cy})`} d={sparklePath(rx, ry)} />
        ))}
      </g>
    </svg>
  );
}
