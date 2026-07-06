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
 * Estrela central construída em linhas horizontais + quatro estrelas de
 * quatro pontas. Vetor geométrico puro (stroke: currentColor), nítido em
 * qualquer tamanho e recolorível via CSS — use `text-bark`, `text-mist` etc.
 */
export default function Logo({
  className = "",
  style,
  width,
  height,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: LogoProps) {
  const star = (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="0" y1="-12" x2="0" y2="12" strokeWidth="10" />
      <line x1="-12" y1="0" x2="12" y2="0" strokeWidth="10" />
    </g>
  );

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
      <g stroke="currentColor" strokeWidth="14" strokeLinecap="round">
        {/* Estrela central — pirâmide superior */}
        <line x1="280" y1="40" x2="280" y2="60" />
        <line x1="260" y1="80" x2="300" y2="80" />
        <line x1="240" y1="110" x2="320" y2="110" />
        <line x1="240" y1="125" x2="320" y2="125" />
        <line x1="220" y1="150" x2="340" y2="150" />
        <line x1="220" y1="165" x2="340" y2="165" />
        {/* Braços */}
        <line x1="80" y1="200" x2="220" y2="200" />
        <line x1="40" y1="235" x2="520" y2="235" />
        <line x1="340" y1="270" x2="480" y2="270" />
        {/* Pirâmide inferior */}
        <line x1="220" y1="305" x2="340" y2="305" />
        <line x1="220" y1="320" x2="340" y2="320" />
        <line x1="240" y1="345" x2="320" y2="345" />
        <line x1="240" y1="360" x2="320" y2="360" />
        <line x1="260" y1="390" x2="300" y2="390" />
        <line x1="280" y1="410" x2="280" y2="430" />
        {/* As demais estrelas do Cruzeiro do Sul */}
        {star(420, 150)}
        {star(140, 250)}
        {star(400, 340)}
        {star(160, 380)}
      </g>
    </svg>
  );
}
