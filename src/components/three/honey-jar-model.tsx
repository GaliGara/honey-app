"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group, Mesh as ThreeMesh } from "three";

/* ══════════════════════════════════════════════════════════
   JAR PROFILE
   LatheGeometry spins this 2-D profile 360° around the Y axis.
   Vector2(radius, y) — bottom-closed, open top (neck).

   Shape: squat premium honey jar — wider than tall.
   Total height ≈ 1.84 u  |  Max diameter ≈ 1.76 u
   ══════════════════════════════════════════════════════════ */
const JAR_PROFILE: THREE.Vector2[] = [
  new THREE.Vector2(0.00, -0.92), // bottom centre  ← closes the base as a flat disc
  new THREE.Vector2(0.66, -0.92), // bottom rim
  new THREE.Vector2(0.80, -0.76), // lower curve opens outward
  new THREE.Vector2(0.87, -0.36), // widest — lower
  new THREE.Vector2(0.87,  0.18), // widest — upper  (flat mid section)
  new THREE.Vector2(0.81,  0.52), // upper body narrows
  new THREE.Vector2(0.66,  0.68), // shoulder
  new THREE.Vector2(0.47,  0.80), // neck base
  new THREE.Vector2(0.43,  0.92), // neck top — lid sits here
];

/* ─── Honey drop ─────────────────────────────────────────── */
function HoneyDrop({
  position,
  scale,
  phaseOffset,
}: {
  position: [number, number, number];
  scale: number;
  phaseOffset: number;
}) {
  const ref = useRef<ThreeMesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + phaseOffset;
    ref.current.position.y = position[1] + Math.sin(t * 0.52) * 0.10;
    ref.current.rotation.z = Math.sin(t * 0.28) * 0.12;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[0.052, 12, 12]} />
      <meshStandardMaterial
        color="#D4A820"
        emissive="#6B3800"
        emissiveIntensity={0.25}
        roughness={0.06}
        metalness={0.04}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

/* ─── Floating hexagon ───────────────────────────────────── */
function FloatingHex({
  position,
  scale,
  phaseOffset,
  rotSpeed,
}: {
  position: [number, number, number];
  scale: number;
  phaseOffset: number;
  rotSpeed: number;
}) {
  const ref = useRef<ThreeMesh>(null);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      if (i === 0) s.moveTo(Math.cos(a), Math.sin(a));
      else         s.lineTo(Math.cos(a), Math.sin(a));
    }
    s.closePath();
    return s;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + phaseOffset;
    ref.current.position.y = position[1] + Math.sin(t * 0.36) * 0.08;
    ref.current.rotation.z += rotSpeed * 0.003;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        color="#D4AF37"
        roughness={0.25}
        metalness={0.25}
        transparent
        opacity={0.10}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   PREMIUM HONEY JAR (fully procedural)
   ═══════════════════════════════════════════════════════════ */
export default function HoneyJarModel() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.46) * 0.075;
    groupRef.current.rotation.y = Math.sin(t * 0.20) * 0.15;
  });

  return (
    <group ref={groupRef}>

      {/* ── 1. GLASS JAR BODY (LatheGeometry — organic curves) ── */}
      <mesh>
        <latheGeometry args={[JAR_PROFILE, 52]} />
        {/*
          MeshPhysicalMaterial: clearcoat adds a second specular layer
          that gives glass its characteristic sheen without heavy HDRI.
          No transmission — keeps rendering simple and safe.
        */}
        <meshPhysicalMaterial
          color="#F5EED8"
          transparent
          opacity={0.24}
          roughness={0.04}
          metalness={0.00}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── 2. HONEY BODY — deep amber fill ── */}
      {/*
        Cylinder sits inside the jar from the base up to ~65% fill.
        Center y = base(-0.86) + half-height(0.50) = -0.36
        Top of honey at y = -0.86 + 1.00 = +0.14
      */}
      <mesh position={[0, -0.36, 0]}>
        <cylinderGeometry args={[0.78, 0.74, 1.00, 44]} />
        <meshStandardMaterial
          color="#B07008"
          emissive="#6B3800"
          emissiveIntensity={0.20}
          roughness={0.05}
          metalness={0.06}
        />
      </mesh>

      {/* Honey upper gradient layer — lighter, brighter amber near surface */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.26, 44]} />
        <meshStandardMaterial
          color="#D4900C"
          emissive="#8B5000"
          emissiveIntensity={0.28}
          roughness={0.04}
          metalness={0.05}
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* Honey surface (meniscus disc) — brightest, most luminous */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.78, 44]} />
        <meshStandardMaterial
          color="#E5A820"
          emissive="#9B6000"
          emissiveIntensity={0.32}
          roughness={0.02}
          metalness={0.06}
        />
      </mesh>

      {/* ── 3. GLASS HIGHLIGHT — vertical reflection stripe (left) ── */}
      <mesh position={[-0.44, 0.04, 0.72]} rotation={[0, 0.48, 0]}>
        <planeGeometry args={[0.07, 1.08]} />
        <meshBasicMaterial
          color="#FFF8EE"
          transparent
          opacity={0.17}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary thinner highlight (right edge) */}
      <mesh position={[0.60, 0.15, 0.60]} rotation={[0, -0.60, 0]}>
        <planeGeometry args={[0.035, 0.52]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.09}
          depthWrite={false}
        />
      </mesh>

      {/* ── 4. FRONT LABEL ── */}
      {/* Cream backing plate — sits just proud of the glass surface */}
      <mesh position={[0, -0.04, 0.876]}>
        <planeGeometry args={[0.94, 0.75]} />
        <meshStandardMaterial
          color="#F5EFE2"
          roughness={0.60}
          metalness={0.00}
        />
      </mesh>

      {/* Label — top gold border */}
      <mesh position={[0, 0.333, 0.878]}>
        <planeGeometry args={[0.92, 0.024]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.10}
          metalness={0.65}
        />
      </mesh>

      {/* Label — bottom gold border */}
      <mesh position={[0, -0.413, 0.878]}>
        <planeGeometry args={[0.92, 0.024]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.10}
          metalness={0.65}
        />
      </mesh>

      {/* Label — centre decorative line */}
      <mesh position={[0, -0.04, 0.879]}>
        <planeGeometry args={[0.62, 0.009]} />
        <meshStandardMaterial
          color="#C8A428"
          roughness={0.14}
          metalness={0.50}
        />
      </mesh>

      {/* Label — small oval ring above centre line (brand mark) */}
      <mesh position={[0, 0.09, 0.879]}>
        <torusGeometry args={[0.055, 0.007, 8, 28]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.12}
          metalness={0.58}
        />
      </mesh>

      {/* ── 5. NECK COLLAR ── */}
      {/* Thin gold ring at the base of the lid — bridges jar & lid */}
      <mesh position={[0, 0.95, 0]}>
        <torusGeometry args={[0.44, 0.026, 10, 48]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.08}
          metalness={0.72}
        />
      </mesh>

      {/* ── 6. LID ── */}
      {/* Main lid cylinder — warm dark wood brown */}
      <mesh position={[0, 1.115, 0]}>
        <cylinderGeometry args={[0.465, 0.445, 0.35, 48]} />
        <meshStandardMaterial
          color="#5C3A1A"
          roughness={0.22}
          metalness={0.14}
        />
      </mesh>

      {/* Lid bevel ring — slightly lighter for depth */}
      <mesh position={[0, 1.285, 0]}>
        <cylinderGeometry args={[0.465, 0.468, 0.022, 48]} />
        <meshStandardMaterial
          color="#7A5028"
          roughness={0.18}
          metalness={0.16}
        />
      </mesh>

      {/* Lid top disc */}
      <mesh position={[0, 1.297, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.465, 48]} />
        <meshStandardMaterial
          color="#6B4422"
          roughness={0.20}
          metalness={0.14}
        />
      </mesh>

      {/* Lid top — small decorative gold centre disc */}
      <mesh position={[0, 1.298, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.14, 32]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.10}
          metalness={0.68}
        />
      </mesh>

      {/* ── 7. AMBIENT GLOW PLANE (behind jar) — adds warmth to scene ── */}
      <mesh position={[0, 0, -0.6]}>
        <planeGeometry args={[3.0, 3.0]} />
        <meshBasicMaterial
          color="#E5A020"
          transparent
          opacity={0.04}
          depthWrite={false}
        />
      </mesh>

      {/* ── 8. FLOATING HEXAGONS ── */}
      <FloatingHex position={[-1.65, 0.70, -0.95]} scale={0.21} phaseOffset={0.0}  rotSpeed={ 1.0} />
      <FloatingHex position={[ 1.70, 0.20, -1.10]} scale={0.16} phaseOffset={1.4}  rotSpeed={-1.0} />
      <FloatingHex position={[-1.20,-0.90, -0.65]} scale={0.12} phaseOffset={2.8}  rotSpeed={ 0.8} />
      <FloatingHex position={[ 1.20, 1.20, -0.90]} scale={0.09} phaseOffset={0.7}  rotSpeed={-0.6} />

      {/* ── 9. HONEY DROPS ── */}
      <HoneyDrop position={[ 0.90,  0.50, 0.28]} scale={1.10} phaseOffset={0.0} />
      <HoneyDrop position={[-1.00, -0.22, 0.20]} scale={0.80} phaseOffset={1.7} />
      <HoneyDrop position={[ 0.48, -1.00, 0.48]} scale={0.62} phaseOffset={3.1} />

    </group>
  );
}
