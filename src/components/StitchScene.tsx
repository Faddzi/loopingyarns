"use client";

/** About page: one crochet chain stitch builds loop by loop as the visitor scrolls, then a bead slides on. */
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function StitchScene({ progress, colour }: { progress: { value: number }; colour: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 40 }} dpr={[1, 1.5]} aria-hidden="true" style={{ touchAction: "pan-y" }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={1.5} />
      <Chain progress={progress} colour={colour} />
    </Canvas>
  );
}

function Chain({ progress, colour }: { progress: { value: number }; colour: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const bead = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const { geo, curve, segs, radial } = useMemo(() => {
    // Five interlocking chain loops along x, each a tilted ellipse.
    const pts: THREE.Vector3[] = [];
    const loops = 5;
    for (let i = 0; i <= loops * 40; i++) {
      const t = i / 40, a = t * Math.PI * 2;
      pts.push(new THREE.Vector3(-1.6 + t * 0.62 + Math.cos(a) * 0.28, Math.sin(a) * 0.45, Math.sin(a + Math.PI / 2) * 0.18));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const segs = 600, radial = 10;
    return { geo: new THREE.TubeGeometry(curve, segs, 0.06, radial, false), curve, segs, radial };
  }, []);
  useFrame(() => {
    const p = Math.min(1, Math.max(0, progress.value));
    const build = Math.min(1, p / 0.8);
    geo.setDrawRange(0, Math.floor(segs * build) * radial * 6);
    const b = Math.max(0, (p - 0.8) / 0.2);
    if (bead.current) {
      bead.current.visible = b > 0;
      bead.current.position.copy(curve.getPointAt(0.98 - 0.25 * (1 - b)));
    }
    if (group.current) group.current.rotation.y = -0.3 + p * 0.6;
  });
  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geo}>
        <meshPhysicalMaterial color={colour} roughness={1} sheen={1} sheenRoughness={0.8} sheenColor="#ffffff" />
      </mesh>
      <mesh ref={bead} visible={false}>
        <torusGeometry args={[0.12, 0.09, 16, 32]} />
        <meshPhysicalMaterial color="#f2c14e" roughness={0.1} clearcoat={1} />
      </mesh>
    </group>
  );
}
