"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWaveSpeed;
  uniform float uWaveIntensity;
  varying vec2 vUv;
  varying float vDisplacement;

  vec2 r2(vec2 s){
    s = vec2(dot(s, vec2(127.1, 311.7)), dot(s, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(s) * 43758.5453);
  }

  float ns(vec2 s){
    vec2 i = floor(s), f = fract(s);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(r2(i),               f),
          dot(r2(i + vec2(1, 0)),  f - vec2(1, 0)), u.x),
      mix(dot(r2(i + vec2(0, 1)),  f - vec2(0, 1)),
          dot(r2(i + vec2(1, 1)),  f - vec2(1, 1)), u.x),
      u.y
    );
  }

  mat2 rot(float a){ return mat2(cos(a), -sin(a), sin(a), cos(a)); }

  void main(){
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);

    vec2 rxy = rot(1.5) * wp.xy * 1.5;
    float d = ns(rxy * 0.75 + vec2(uTime * uWaveSpeed));
    d *= uWaveIntensity;

    float pin = smoothstep(0.0, 0.35, uv.x);
    d *= pin;

    vDisplacement = d;
    wp.z += d;

    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uShadowStrength;
  varying vec2 vUv;
  varying float vDisplacement;

  void main(){
    vec4 col = texture2D(uTexture, vUv);
    col.rgb += vec3(vDisplacement * uShadowStrength);
    gl_FragColor = vec4(col.rgb, 1.0);
  }
`;

export interface WebGLFlagProps {
  src: string;
  width?: string;
  height?: string;
  waveSpeed?: number;
  waveIntensity?: number;
  shadowStrength?: number;
  aspectRatioWidth?: number;
  aspectRatioHeight?: number;
  cameraZ?: number;
  backgroundColor?: string;
}

export default function WebGLFlag({
  src,
  width = "100%",
  height = "100%",
  waveSpeed = 1.2,
  waveIntensity = 1.2,
  shadowStrength = 0.3,
  aspectRatioWidth = 3.55,
  aspectRatioHeight = 2.0,
  cameraZ = 4.5,
  backgroundColor,
}: WebGLFlagProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const scene = new THREE.Scene();

    const size = {
      width: container.clientWidth,
      height: container.clientHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      30,
      size.width / size.height,
      0.1,
      100
    );
    camera.position.set(0, 0, cameraZ);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: !backgroundColor,
    });
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NoToneMapping;
    if (backgroundColor) {
      renderer.setClearColor(new THREE.Color(backgroundColor), 1);
    }

    const texture = new THREE.TextureLoader().load(src);
    texture.minFilter = THREE.LinearFilter;

    const uniforms = {
      uTime:           { value: 0 },
      uTexture:        { value: texture },
      uWaveSpeed:      { value: waveSpeed },
      uWaveIntensity:  { value: waveIntensity },
      uShadowStrength: { value: shadowStrength },
    };

    const geometry = new THREE.PlaneGeometry(
      aspectRatioWidth,
      aspectRatioHeight,
      128,
      128
    );
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.95, 0.85, 1);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let raf: number;

    const tick = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      size.width = container.clientWidth;
      size.height = container.clientHeight;
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [
    src,
    waveSpeed,
    waveIntensity,
    shadowStrength,
    aspectRatioWidth,
    aspectRatioHeight,
    cameraZ,
    backgroundColor,
  ]);

  return (
    <div ref={containerRef} style={{ width, height, position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
