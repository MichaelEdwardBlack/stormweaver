import { useConvexPolyhedron } from "@react-three/cannon";
import * as THREE from "three";

export function useDicePhysics(geometry: THREE.BufferGeometry, initialPosition: [number, number, number] = [0, 0, 0]) {
  const vertices = geometry.attributes.position.array;
  const index = geometry.index?.array;

  // Convert BufferGeometry → Cannon convex polyhedron
  const points: [number, number, number][] = [];
  for (let i = 0; i < vertices.length; i += 3) {
    points.push([vertices[i], vertices[i + 1], vertices[i + 2]]);
  }

  const faces: number[][] = [];
  if (index) {
    for (let i = 0; i < index.length; i += 3) {
      faces.push([index[i], index[i + 1], index[i + 2]]);
    }
  }

  const [ref, api] = useConvexPolyhedron(() => ({
    mass: 1,
    args: [points, faces],
    position: initialPosition,
    angularDamping: 0.4,
    linearDamping: 0.6,
  }));

  return { ref, api };
}
