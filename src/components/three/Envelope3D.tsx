"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import * as THREE from "three";

export type EnvelopeStage = "sealed" | "question" | "unlocking" | "loading" | "unlocked";

const WIDTH = 3.5;
const HEIGHT = 2.2;
const paper = { roughness: 0.94, metalness: 0, side: THREE.DoubleSide } as const;

function polygon(points: [number, number][]) {
  const shape = new THREE.Shape();
  shape.moveTo(...points[0]);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();
  return shape;
}

const leftFold = polygon([[-WIDTH / 2, HEIGHT / 2], [-WIDTH / 2, -HEIGHT / 2], [0, -0.12]]);
const rightFold = polygon([[WIDTH / 2, HEIGHT / 2], [0, -0.12], [WIDTH / 2, -HEIGHT / 2]]);
const bottomFold = polygon([[-WIDTH / 2, -HEIGHT / 2], [WIDTH / 2, -HEIGHT / 2], [0, 0.22]]);
const topFold = polygon([[-WIDTH / 2, 0], [WIDTH / 2, 0], [0, -1.38]]);

function makeTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function drawSeal(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return;
  context.clearRect(0, 0, 512, 512);
  context.fillStyle = "#713039";
  context.beginPath();
  context.arc(256, 256, 248, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#b76d70";
  context.lineWidth = 10;
  context.beginPath();
  context.arc(256, 256, 198, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = "#f4d5c4";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "bold 100px Georgia, serif";
  context.fillText("D & H", 256, 264);
}

function drawLetter(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, 1024, 620);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#714044";
  context.font = "italic 64px Georgia, serif";
  context.fillText("Dino & Hishare", 512, 112);
  context.fillStyle = "#9f8979";
  context.font = "28px Arial, sans-serif";
  context.fillText("A LITTLE PIECE OF OUR STORY", 512, 174);
  context.strokeStyle = "#dbc7b5";
  context.lineWidth = 2;
  for (const [from, to, y] of [[170, 854, 212], [245, 779, 460], [300, 724, 510]]) {
    context.beginPath();
    context.moveTo(from, y);
    context.lineTo(to, y);
    context.stroke();
  }
  context.fillStyle = "#713039";
  context.font = "italic 46px Georgia, serif";
  context.fillText("For all our tomorrows", 512, 310);
  context.fillStyle = "#a48a7c";
  context.font = "25px Arial, sans-serif";
  context.fillText("WITH ALL MY LOVE", 512, 385);
  context.fillStyle = "#e4d6c9";
  context.fillRect(245, 423, 534, 7);
}

export function Envelope3D({ stage }: { stage: EnvelopeStage }) {
  const reducedMotion = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const flap = useRef<THREE.Group>(null);
  const card = useRef<THREE.Group>(null);
  const letterFold = useRef<THREE.Group>(null);
  const sealLeft = useRef<THREE.Group>(null);
  const sealRight = useRef<THREE.Group>(null);
  const openingTime = useRef(0);
  const letterCanvas = useRef<HTMLCanvasElement | null>(null);
  const letterTexture = useRef<THREE.CanvasTexture | null>(null);
  const letterMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const sealMaterialLeft = useRef<THREE.MeshStandardMaterial>(null);
  const sealMaterialRight = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    const seal = document.createElement("canvas");
    seal.width = seal.height = 512;
    drawSeal(seal);
    const wax = makeTexture(seal);

    const letter = document.createElement("canvas");
    letter.width = 1024;
    letter.height = 620;
    letterCanvas.current = letter;
    drawLetter(letter);
    const ink = makeTexture(letter);

    letterTexture.current = ink;
    if (letterMaterial.current) {
      letterMaterial.current.map = ink;
      letterMaterial.current.needsUpdate = true;
    }
    for (const material of [sealMaterialLeft.current, sealMaterialRight.current]) {
      if (!material) continue;
      material.map = wax;
      material.needsUpdate = true;
    }
    return () => {
      wax.dispose();
      ink.dispose();
      letterCanvas.current = null;
      letterTexture.current = null;
    };
  }, []);

  useFrame((state, delta) => {
    if (!group.current || !flap.current || !card.current || !letterFold.current || !sealLeft.current || !sealRight.current) return;

    const t = state.clock.elapsedTime;
    group.current.scale.setScalar(Math.min(1, state.viewport.width / 3.95));
    group.current.position.y = reducedMotion ? 0 : Math.sin(t * 0.8) * 0.07;
    group.current.rotation.y = -0.09 + (reducedMotion ? 0 : Math.sin(t * 0.45) * 0.055);
    group.current.rotation.x = 0.06 + (reducedMotion ? 0 : Math.sin(t * 0.35) * 0.018);

    const opening = stage === "unlocking" || stage === "loading" || stage === "unlocked";
    openingTime.current = opening ? (reducedMotion ? 3.2 : Math.min(openingTime.current + delta, 3.2)) : 0;
    const split = THREE.MathUtils.smoothstep(openingTime.current, 0.08, 0.68);
    const fade = THREE.MathUtils.smoothstep(openingTime.current, 0.72, 1.3);
    const lift = THREE.MathUtils.smoothstep(openingTime.current, 0.46, 1.55);
    const reveal = THREE.MathUtils.smoothstep(openingTime.current, 1.2, 2.7);
    const unfold = THREE.MathUtils.smoothstep(openingTime.current, 1.8, 2.85);

    flap.current.rotation.x = 2.72 * lift;
    card.current.position.y = 1.12 * reveal;
    // The letter slides vertically inside the pocket, never through its front folds.
    card.current.position.z = 0;
    letterFold.current.rotation.x = 2.9 * unfold;

    for (const [piece, direction] of [[sealLeft.current, -1], [sealRight.current, 1]] as const) {
      piece.position.set(direction * 0.28 * split, -0.15 - 0.23 * split, 0.29 + 0.12 * split);
      piece.rotation.z = direction * 0.7 * split;
      piece.scale.setScalar(1 - 0.95 * fade);
    }
  });

  return (
    <group ref={group} rotation={[0.06, -0.09, -0.045]}>
      <mesh castShadow receiveShadow position={[0, 0, -0.12]}>
        <boxGeometry args={[WIDTH, HEIGHT, 0.16]} />
        <meshStandardMaterial color="#d4c5af" roughness={0.96} />
      </mesh>
      <mesh position={[0, 0, -0.025]} receiveShadow>
        <planeGeometry args={[WIDTH - 0.035, HEIGHT - 0.035]} />
        <meshStandardMaterial color="#eee3d1" {...paper} />
      </mesh>

      <group ref={card}>
        <mesh castShadow position={[0, 0.04, 0.025]}>
          <boxGeometry args={[2.93, 1.76, 0.055]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.92} />
        </mesh>
        <mesh position={[0, 0.04, 0.057]}>
          <planeGeometry args={[2.86, 1.68]} />
          <meshBasicMaterial ref={letterMaterial} transparent toneMapped={false} />
        </mesh>
        <group ref={letterFold} position={[0, 0.9, 0.085]}>
          <mesh castShadow position={[0, -0.31, 0]}>
            <planeGeometry args={[2.86, 0.62]} />
            <meshStandardMaterial color="#f7f0e5" {...paper} />
          </mesh>
          <mesh position={[0, -0.28, 0.008]}>
            <planeGeometry args={[1.58, 0.012]} />
            <meshStandardMaterial color="#d6bca8" {...paper} />
          </mesh>
          <mesh position={[0, -0.38, 0.008]}>
            <planeGeometry args={[1.14, 0.01]} />
            <meshStandardMaterial color="#dfccba" {...paper} />
          </mesh>
        </group>
      </group>

      <mesh castShadow receiveShadow position={[0, 0, 0.12]}>
        <shapeGeometry args={[leftFold]} />
        <meshStandardMaterial color="#e9dac5" {...paper} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0.135]}>
        <shapeGeometry args={[rightFold]} />
        <meshStandardMaterial color="#e5d4bc" {...paper} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0.16]}>
        <shapeGeometry args={[bottomFold]} />
        <meshStandardMaterial color="#f2e6d4" {...paper} />
      </mesh>

      <group ref={flap} position={[0, HEIGHT / 2, 0.18]}>
        <mesh castShadow receiveShadow>
          <shapeGeometry args={[topFold]} />
          <meshStandardMaterial color="#f6ecdd" {...paper} />
        </mesh>
      </group>

      <group ref={sealLeft} position={[0, -0.15, 0.29]}>
        <mesh position={[0, 0, -0.015]} castShadow>
          <circleGeometry args={[0.29, 48, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#4c1c26" {...paper} />
        </mesh>
        <mesh position={[0, 0, 0.016]}>
          <circleGeometry args={[0.29, 48, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial ref={sealMaterialLeft} color="#ffffff" transparent {...paper} />
        </mesh>
      </group>
      <group ref={sealRight} position={[0, -0.15, 0.29]}>
        <mesh position={[0, 0, -0.015]} castShadow>
          <circleGeometry args={[0.29, 48, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#4c1c26" {...paper} />
        </mesh>
        <mesh position={[0, 0, 0.016]}>
          <circleGeometry args={[0.29, 48, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial ref={sealMaterialRight} color="#ffffff" transparent {...paper} />
        </mesh>
      </group>
    </group>
  );
}
