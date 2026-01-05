"use client";
import { usePlane } from "@react-three/cannon";

export function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0], // rotate to be horizontal
    position: [0, -5, 0], // at y=0
    type: "Static",
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} /> {/* make it big enough */}
      <shadowMaterial transparent opacity={0.4} />
    </mesh>
  );
}
