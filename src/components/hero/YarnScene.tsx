"use client";

/**
 * The 3D hero: a soft-shaded yarn ball the visitor can drag to spin, and physics beads that roll
 * away from the cursor or finger. The scroll-linked unravel, bead threading and resolve-to-product
 * sequence (PRD section 6) lands in milestone 3 on top of this scene.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, BallCollider, type RapierRigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { beadColours } from "./palette";

function YarnBall({ colour }: { colour: string }) {
  const group = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, x: 0, y: 0, vx: 0.003, vy: 0 });

  // Many great-circle windings, each a thin tube, give the ball its wound-yarn look.
  const geometry = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    const rand = mulberry32(7);
    for (let i = 0; i < 70; i++) {
      const axis = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
      const start = new THREE.Vector3().randomDirection().cross(axis).normalize();
      const r = 1 + rand() * 0.04;
      const pts: THREE.Vector3[] = [];
      for (let t = 0; t <= 64; t++) pts.push(start.clone().applyAxisAngle(axis, (t / 64) * Math.PI * 2).multiplyScalar(r));
      geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 96, 0.045, 6, true));
    }
    return mergeGeometries(geos);
  }, []);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const d = drag.current;
    if (!d.active) { d.vx *= 0.96; d.vy *= 0.96; d.vx += (0.003 - d.vx) * 0.02; }
    g.rotation.y += d.vx;
    g.rotation.x += d.vy;
  });

  return (
    <group ref={group}
      onPointerDown={(e) => { e.stopPropagation(); (e.target as Element)?.setPointerCapture?.(e.pointerId); drag.current = { ...drag.current, active: true, x: e.clientX, y: e.clientY }; }}
      onPointerMove={(e) => { const d = drag.current; if (!d.active) return; d.vx = (e.clientX - d.x) * 0.004; d.vy = (e.clientY - d.y) * 0.004; d.x = e.clientX; d.y = e.clientY; }}
      onPointerUp={() => (drag.current.active = false)}
      onPointerLeave={() => (drag.current.active = false)}>
      <mesh>
        <sphereGeometry args={[0.97, 48, 48]} />
        <meshStandardMaterial color={colour} roughness={1} />
      </mesh>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color={colour} roughness={0.95} sheen={1} sheenRoughness={0.8} sheenColor={new THREE.Color(colour).lerp(new THREE.Color("#ffffff"), 0.5)} />
      </mesh>
    </group>
  );
}

function Beads() {
  const beads = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    colour: beadColours[i % beadColours.length],
    position: [(i % 7) * 0.45 - 1.4, -0.9 + Math.floor(i / 7) * 0.4, 0.6 + (i % 3) * 0.2] as [number, number, number],
  })), []);
  return (
    <>
      {beads.map((b, i) => (
        <RigidBody key={i} colliders={false} position={b.position} restitution={0.4} friction={0.6} linearDamping={0.6} angularDamping={0.5}>
          <BallCollider args={[0.14]} />
          <mesh castShadow>
            <sphereGeometry args={[0.14, 32, 32]} />
            <meshPhysicalMaterial color={b.colour} roughness={0.08} clearcoat={1} clearcoatRoughness={0.05} />
          </mesh>
        </RigidBody>
      ))}
      {/* Floor and walls keep the beads in frame. */}
      <CuboidCollider args={[4, 0.1, 2]} position={[0, -1.45, 0.6]} />
      <CuboidCollider args={[0.1, 2, 2]} position={[-2.6, 0, 0.6]} />
      <CuboidCollider args={[0.1, 2, 2]} position={[2.6, 0, 0.6]} />
      <CuboidCollider args={[4, 2, 0.1]} position={[0, 0, -0.2]} />
      <CuboidCollider args={[4, 2, 0.1]} position={[0, 0, 1.5]} />
    </>
  );
}

/** An invisible kinematic ball that follows the pointer so beads roll away from it. */
function Pointer() {
  const body = useRef<RapierRigidBody>(null);
  const { viewport } = useThree();
  useFrame(({ pointer }) => {
    body.current?.setNextKinematicTranslation({ x: (pointer.x * viewport.width) / 2, y: (pointer.y * viewport.height) / 2, z: 0.8 });
  });
  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false}>
      <BallCollider args={[0.25]} />
    </RigidBody>
  );
}

export default function YarnScene({ colour }: { colour: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: "high-performance" }}
            aria-hidden="true" style={{ touchAction: "pan-y" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      {/* Local light rig for bead reflections, so nothing is fetched from a CDN. */}
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={3} position={[0, 3, 2]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} />
        <Lightformer form="circle" intensity={1.5} position={[3, 1, 3]} scale={1.5} />
      </Environment>
      <YarnBall colour={colour} />
      <Physics gravity={[0, -9.8, 0]}>
        <Beads />
        <Pointer />
      </Physics>
    </Canvas>
  );
}

function mulberry32(a: number) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function mergeGeometries(geos: THREE.BufferGeometry[]) {
  // Small local merge so we avoid pulling in three/examples just for this.
  let vCount = 0, iCount = 0;
  for (const g of geos) { vCount += g.attributes.position.count; iCount += g.index!.count; }
  const pos = new Float32Array(vCount * 3), nor = new Float32Array(vCount * 3), idx = new Uint32Array(iCount);
  let vo = 0, io = 0;
  for (const g of geos) {
    pos.set(g.attributes.position.array as Float32Array, vo * 3);
    nor.set(g.attributes.normal.array as Float32Array, vo * 3);
    const gi = g.index!.array;
    for (let i = 0; i < gi.length; i++) idx[io + i] = gi[i] + vo;
    vo += g.attributes.position.count; io += gi.length;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}
