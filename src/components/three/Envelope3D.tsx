"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Envelope3D({ stage }: { stage: "sealed" | "question" | "unlocking" | "unlocked" }) {
  const group = useRef<THREE.Group>(null);
  const flap = useRef<THREE.Mesh>(null);
  const card = useRef<THREE.Mesh>(null);
  const seal = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current || !flap.current || !card.current || !seal.current) return;

    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.8) * 0.08;
    group.current.rotation.y = Math.sin(t * 0.45) * 0.08;
    group.current.rotation.x = Math.sin(t * 0.35) * 0.025;

    const opened = stage !== "sealed";
    const fullyOpened = stage === "unlocking" || stage === "unlocked";

    flap.current.rotation.x = THREE.MathUtils.damp(
      flap.current.rotation.x,
      opened ? (fullyOpened ? -2.55 : -1.72) : 0.18,
      4,
      delta,
    );
    card.current.position.y = THREE.MathUtils.damp(
      card.current.position.y,
      fullyOpened ? 1.45 : opened ? 0.78 : 0.12,
      4,
      delta,
    );
    card.current.position.z = THREE.MathUtils.damp(
      card.current.position.z,
      fullyOpened ? 0.35 : opened ? 0.22 : 0.02,
      4,
      delta,
    );
    seal.current.scale.setScalar(
      THREE.MathUtils.damp(seal.current.scale.x, opened ? 0 : 1, 6, delta),
    );
  });

  return (
    <group ref={group} rotation={[0.08, -0.08, -0.05]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.5, 2.15, 0.16]} />
        <meshStandardMaterial color="#e7e2d8" roughness={0.82} />
      </mesh>

      <mesh ref={flap} position={[0, 0.55, 0.12]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[3.15, 1.15, 0.06]} />
        <meshStandardMaterial color="#f2eee6" roughness={0.9} />
      </mesh>

      <mesh ref={card} position={[0, 0.12, 0.02]}>
        <boxGeometry args={[2.9, 1.62, 0.06]} />
        <meshStandardMaterial color="#faf9f5" roughness={0.95} />
      </mesh>

      <mesh ref={seal} position={[0, -0.04, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.09, 48]} />
        <meshStandardMaterial color="#5d2528" roughness={0.55} metalness={0.06} />
      </mesh>
    </group>
  );
}
