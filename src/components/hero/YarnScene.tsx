"use client";

/**
 * The 3D hero, "one loop becomes everything" (PRD section 6).
 * Idle: a fuzzy yarn ball the visitor can drag to spin, with physics beads that roll away from the pointer.
 * On scroll: a strand unravels from the ball, beads thread onto it, the strand closes into the round badge
 * from the logo, and the HTML overlay shows a real piece inside it.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, BallCollider, type RapierRigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { beadColours } from "./palette";
import { heroProgress, stage, STAGES } from "./progress";

export type HeroLayout = { cx: number; cy: number; r: number }; // CSS pixels within the canvas

/** Where the ball sits and how big the badge loop is, for the current viewport. */
function useStageLayout() {
  const { viewport, size } = useThree();
  const wide = size.width >= size.height;
  const ball = new THREE.Vector3(wide ? viewport.width * 0.24 : 0, wide ? -0.05 : -viewport.height * 0.12, 0);
  const ringR = Math.min(1.2, viewport.width * 0.32, viewport.height * 0.26);
  const ballR = Math.min(0.95, viewport.width * 0.26);
  return { ball, ringR, ballR, viewport, size };
}

// ---------- Yarn ball ----------

const shellVertex = /* glsl */ `
  uniform float uH;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 p = position + normal * uH * 0.09;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const shellFragment = /* glsl */ `
  uniform float uH;
  uniform vec3 uColor;
  uniform float uLight;
  varying vec2 vUv;
  varying vec3 vNormal;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 cell = floor(vUv * vec2(420.0, 210.0));
    float h = hash(cell);
    if (h < uH * 0.95 + 0.05) discard;
    float lambert = max(dot(vNormal, normalize(vec3(0.4, 0.6, 0.7))), 0.0);
    float ao = mix(0.55, 1.0, uH);
    vec3 c = uColor * ao * (0.45 + 0.75 * lambert * uLight);
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`;

const SHELLS = 10;

function YarnBall({ colour }: { colour: string }) {
  const group = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, x: 0, y: 0, vx: 0.003, vy: 0 });
  const { ball, ballR } = useStageLayout();
  const col = useMemo(() => new THREE.Color(colour), [colour]);

  const windings = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    const rand = mulberry32(7);
    for (let i = 0; i < 90; i++) {
      const axis = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
      const start = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).cross(axis).normalize();
      const r = 1 + rand() * 0.03;
      const pts: THREE.Vector3[] = [];
      for (let t = 0; t < 48; t++) pts.push(start.clone().applyAxisAngle(axis, (t / 48) * Math.PI * 2).multiplyScalar(r));
      geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 72, 0.03, 5, true));
    }
    return mergeGeometries(geos);
  }, []);

  const shellMats = useMemo(() => Array.from({ length: SHELLS }, (_, i) => new THREE.ShaderMaterial({
    vertexShader: shellVertex, fragmentShader: shellFragment,
    uniforms: { uH: { value: (i + 1) / SHELLS }, uColor: { value: new THREE.Color() }, uLight: { value: 1 } },
  })), []);
  useEffect(() => {
    shellMats.forEach((m) => { m.uniforms.uColor.value.copy(col); m.uniforms.uLight.value = 1.1; });
  }, [col, shellMats]);
  useEffect(() => () => { shellMats.forEach((m) => m.dispose()); windings.dispose(); }, [shellMats, windings]);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const d = drag.current;
    if (!d.active) { d.vx += (0.003 - d.vx) * 0.03; d.vy *= 0.94; }
    const p = heroProgress.value;
    const unravel = stage(p, ...STAGES.unravel);
    const stitch = stage(p, ...STAGES.stitch);
    g.rotation.y += d.vx + unravel * 0.02 * (1 - stitch);
    g.rotation.x += d.vy;
    const s = ballR * (1 - unravel * 0.55) * (1 - stitch);
    g.scale.setScalar(Math.max(s, 0.0001));
    g.visible = s > 0.01;
    g.position.copy(ball);
  });

  return (
    <group ref={group}
      onPointerDown={(e) => { e.stopPropagation(); drag.current = { ...drag.current, active: true, x: e.clientX, y: e.clientY }; (e.target as unknown as Element)?.setPointerCapture?.(e.pointerId); }}
      onPointerMove={(e) => { const d = drag.current; if (!d.active) return; d.vx = (e.clientX - d.x) * 0.006; d.vy = (e.clientY - d.y) * 0.003; d.x = e.clientX; d.y = e.clientY; }}
      onPointerUp={() => (drag.current.active = false)}
      onPointerCancel={() => (drag.current.active = false)}>
      <mesh>
        <sphereGeometry args={[0.96, 64, 48]} />
        <meshStandardMaterial color={col} roughness={1} />
      </mesh>
      <mesh geometry={windings}>
        <meshPhysicalMaterial color={col} roughness={1} sheen={1} sheenRoughness={0.9} sheenColor={col.clone().lerp(new THREE.Color("#ffffff"), 0.45)} />
      </mesh>
      {shellMats.map((m, i) => (
        <mesh key={i} material={m}>
          <sphereGeometry args={[1.0, 64, 48]} />
        </mesh>
      ))}
    </group>
  );
}

// ---------- Strand and threaded beads ----------

const STRAND_POINTS = 160;
const THREADED = 9;

function Strand({ colour }: { colour: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const beads = useRef<THREE.InstancedMesh>(null);
  const { ball, ringR, ballR } = useStageLayout();
  const col = useMemo(() => new THREE.Color(colour), [colour]);
  const last = useRef(-1);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const beadCols = useMemo(() => beadColours.map((c) => new THREE.Color(c)), []);

  // Path 1: a loose, looping line that runs from the ball across the stage.
  // Path 2: the round badge from the logo, centred where the ball was.
  const { free, ring } = useMemo(() => {
    const free: THREE.Vector3[] = [], ring: THREE.Vector3[] = [];
    // The free strand orbits the ball in loose loops, so it never crosses the heading on the left.
    const orbit = ringR * 1.3;
    for (let i = 0; i < STRAND_POINTS; i++) {
      const u = i / (STRAND_POINTS - 1);
      const a = -Math.PI / 4 + u * Math.PI * 2 * 0.95;
      const r = ballR * 0.9 + (orbit - ballR * 0.9) * Math.min(1, u * 3);
      const loop = 0.2 * Math.min(1, u * 4);
      free.push(new THREE.Vector3(
        ball.x + Math.cos(a) * r + loop * Math.cos(u * Math.PI * 14),
        ball.y + Math.sin(a) * r * 0.9 + loop * Math.sin(u * Math.PI * 14),
        0.4 * Math.sin(u * Math.PI * 3),
      ));
      const b = Math.PI / 2 + u * Math.PI * 2 * 1.08;
      const wobble = 0.03 * Math.sin(u * Math.PI * 40);
      ring.push(new THREE.Vector3(ball.x + Math.cos(b) * (ringR + wobble), ball.y + Math.sin(b) * (ringR + wobble), 0.15 * Math.sin(u * Math.PI * 2)));
    }
    return { free, ring };
  }, [ball.x, ball.y, ballR, ringR]);

  useEffect(() => { last.current = -1; }, [free, ring]);

  useFrame(() => {
    const p = heroProgress.value;
    if (Math.abs(p - last.current) < 0.0005 || !mesh.current) return;
    last.current = p;
    const unravel = stage(p, ...STAGES.unravel);
    const thread = stage(p, ...STAGES.thread);
    const stitch = stage(p, ...STAGES.stitch);

    mesh.current.visible = unravel > 0.001;
    beads.current!.visible = thread > 0.001;
    if (!mesh.current.visible) return;

    const pts = free.map((f, i) => f.clone().lerp(ring[i], stitch));
    // The strand's start stays on the shrinking ball surface until the ball is gone.
    pts[0].lerp(ball, 0.6 * (1 - stitch));
    const curve = new THREE.CatmullRomCurve3(pts);
    const segs = 360, radial = 8;
    const geo = new THREE.TubeGeometry(curve, segs, 0.032, radial, false);
    geo.setDrawRange(0, Math.floor(segs * unravel) * radial * 6);
    mesh.current.geometry.dispose();
    mesh.current.geometry = geo;

    for (let i = 0; i < THREADED; i++) {
      const target = 0.18 + (i / (THREADED - 1)) * 0.64;
      const u = Math.min(target * thread, unravel * 0.98);
      tmp.position.copy(curve.getPointAt(u));
      tmp.lookAt(tmp.position.clone().add(curve.getTangentAt(u)));
      tmp.scale.setScalar(thread > 0.001 ? 1 : 0);
      tmp.updateMatrix();
      beads.current!.setMatrixAt(i, tmp.matrix);
      beads.current!.setColorAt(i, beadCols[i % beadCols.length]);
    }
    beads.current!.instanceMatrix.needsUpdate = true;
    if (beads.current!.instanceColor) beads.current!.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <mesh ref={mesh} visible={false}>
        <bufferGeometry />
        <meshPhysicalMaterial color={col} roughness={1} sheen={1} sheenRoughness={0.85} sheenColor={col.clone().lerp(new THREE.Color("#ffffff"), 0.5)} />
      </mesh>
      <instancedMesh ref={beads} args={[undefined, undefined, THREADED]} visible={false}>
        <torusGeometry args={[0.075, 0.055, 16, 32]} />
        <meshPhysicalMaterial roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
      </instancedMesh>
    </>
  );
}

// ---------- Loose physics beads (idle state) ----------

function LooseBeads() {
  const { ball, viewport, size } = useStageLayout();
  const floorY = Math.max(ball.y - 1.35, -viewport.height / 2 + (size.width >= size.height ? 0.25 : 1.0));
  const halfW = viewport.width / 2 - 0.15;
  const beads = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    colour: beadColours[i % beadColours.length],
    position: [ball.x + ((i % 7) - 3) * 0.3, floorY + 0.4 + Math.floor(i / 7) * 0.35, 0.5 + (i % 3) * 0.15] as [number, number, number],
  })), [ball.x, floorY]);
  return (
    <>
      {beads.map((b, i) => (
        <RigidBody key={i} colliders={false} position={b.position} restitution={0.45} friction={0.5} linearDamping={0.5} angularDamping={0.4}>
          <BallCollider args={[0.12]} />
          <mesh>
            <sphereGeometry args={[0.12, 32, 24]} />
            <meshPhysicalMaterial color={b.colour} roughness={0.08} clearcoat={1} clearcoatRoughness={0.04} />
          </mesh>
        </RigidBody>
      ))}
      <CuboidCollider args={[halfW + 1, 0.1, 2]} position={[0, floorY - 0.1, 0.6]} />
      <CuboidCollider args={[0.1, 3, 2]} position={[-halfW, 0, 0.6]} />
      <CuboidCollider args={[0.1, 3, 2]} position={[halfW, 0, 0.6]} />
      <CuboidCollider args={[halfW + 1, 3, 0.1]} position={[0, 0, 0.2]} />
      <CuboidCollider args={[halfW + 1, 3, 0.1]} position={[0, 0, 1.2]} />
    </>
  );
}

/** An invisible kinematic ball that follows the pointer so beads roll away from it. */
function Pointer() {
  const body = useRef<RapierRigidBody>(null);
  const { viewport } = useThree();
  useFrame(({ pointer }) => {
    body.current?.setNextKinematicTranslation({ x: (pointer.x * viewport.width) / 2, y: (pointer.y * viewport.height) / 2, z: 0.7 });
  });
  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false}>
      <BallCollider args={[0.22]} />
    </RigidBody>
  );
}

/** Physics runs only while the loose beads are on screen. */
function IdlePhysics() {
  const [on, setOn] = useState(true);
  useFrame(() => {
    const want = heroProgress.value < STAGES.thread[0];
    if (want !== on) setOn(want);
  });
  if (!on) return null;
  return (
    <Physics gravity={[0, -9.8, 0]}>
      <LooseBeads />
      <Pointer />
    </Physics>
  );
}

function LayoutReporter({ onLayout }: { onLayout?: (l: HeroLayout) => void }) {
  const { ball, ringR, viewport, size } = useStageLayout();
  useEffect(() => {
    const k = size.height / viewport.height;
    onLayout?.({ cx: size.width / 2 + ball.x * k, cy: size.height / 2 - ball.y * k, r: ringR * k });
  }, [ball.x, ball.y, ringR, viewport.height, size.width, size.height, onLayout]);
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} />
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={3} position={[0, 3, 2]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} />
        <Lightformer form="circle" intensity={1.5} position={[3, 1, 3]} scale={1.5} />
      </Environment>
    </>
  );
}

export default function YarnScene({ colour, onLayout }: { colour: string; onLayout?: (l: HeroLayout) => void }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: "high-performance" }}
            aria-hidden="true" style={{ touchAction: "pan-y" }}>
      <Lights />
      <YarnBall colour={colour} />
      <Strand colour={colour} />
      <IdlePhysics />
      <LayoutReporter onLayout={onLayout} />
    </Canvas>
  );
}

function mulberry32(a: number) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function mergeGeometries(geos: THREE.BufferGeometry[]) {
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
