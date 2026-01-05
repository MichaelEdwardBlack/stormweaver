"use client";
import { Box, Text } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useColors } from "@/store/colors";
import { useDicePhysics } from "@/lib/hooks/useDicePhysics";
import { prepGeometry } from "@/lib/utils/dieAnimations";

export const DICE_SCALAR = 1;

function FaceText({ geometry, labels }: { geometry: THREE.BufferGeometry; labels: string[] }) {
  const { diceText } = useColors();
  const positions = geometry.attributes.position.array as Float32Array;
  const index = geometry.index ? geometry.index.array : null;
  const faceCenters: { center: THREE.Vector3; normal: THREE.Vector3 }[] = [];

  if (index) {
    for (let i = 0; i < index.length; i += 3) {
      const vA = new THREE.Vector3().fromArray(positions, index[i] * 3);
      const vB = new THREE.Vector3().fromArray(positions, index[i + 1] * 3);
      const vC = new THREE.Vector3().fromArray(positions, index[i + 2] * 3);

      const center = new THREE.Vector3().addVectors(vA, vB).add(vC).divideScalar(3);
      const normal = new THREE.Vector3().subVectors(vB, vA).cross(new THREE.Vector3().subVectors(vC, vA)).normalize();

      faceCenters.push({ center, normal });
    }
  } else {
    for (let i = 0; i < positions.length; i += 9) {
      const vA = new THREE.Vector3().fromArray(positions, i);
      const vB = new THREE.Vector3().fromArray(positions, i + 3);
      const vC = new THREE.Vector3().fromArray(positions, i + 6);

      const center = new THREE.Vector3().addVectors(vA, vB).add(vC).divideScalar(3);
      const normal = new THREE.Vector3().subVectors(vB, vA).cross(new THREE.Vector3().subVectors(vC, vA)).normalize();

      faceCenters.push({ center, normal });
    }
  }

  // Deduplicate
  const unique: { center: THREE.Vector3; normal: THREE.Vector3 }[] = [];
  faceCenters.forEach((f) => {
    if (!unique.some((u) => u.center.distanceTo(f.center) < 0.01)) {
      unique.push(f);
    }
  });

  (geometry as any).userData = (geometry as any).userData || {};
  (geometry as any).userData.faceInfos = unique.map((f, i) => ({
    center: f.center.toArray(),
    normal: f.normal.toArray(),
    value: labels[i % labels.length],
  }));

  return (
    <>
      {unique.map(({ center, normal }, i) => {
        const radius = center.length(); // distance from origin to face center
        const offset = 0.2; // tiny push outward so text isn’t clipping
        const position = center
          .clone()
          .normalize()
          .multiplyScalar(radius + offset);

        return (
          <Text
            key={i}
            position={position}
            fontSize={1 * DICE_SCALAR}
            color={diceText}
            anchorX="center"
            anchorY="middle"
            rotation={new THREE.Euler().setFromQuaternion(
              new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal.clone().normalize())
            )}
          >
            {labels[i % labels.length]}
          </Text>
        );
      })}
    </>
  );
}

function FaceTextCustomGeometry({ geometry, labels }: { geometry: THREE.BufferGeometry; labels: string[] }) {
  const { diceText } = useColors();
  const positions = geometry.attributes.position.array as Float32Array;
  const triangles: {
    center: THREE.Vector3;
    normal: THREE.Vector3;
    verts: THREE.Vector3[]; // triangle vertices
  }[] = [];
  for (let i = 0; i < positions.length; i += 9) {
    const vA = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    const vB = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
    const vC = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);

    const center = new THREE.Vector3()
      .addVectors(vA, vB)
      .add(vC)
      .multiplyScalar(1 / 3);
    const normal = new THREE.Vector3().subVectors(vB, vA).cross(new THREE.Vector3().subVectors(vC, vA)).normalize();

    triangles.push({ center, normal, verts: [vA, vB, vC] });
  }
  // cluster triangles by normal similarity
  const groups: { normal: THREE.Vector3; triangles: typeof triangles }[] = [];
  const dotThreshold = 0.995; // tweak this if you get too many/few groups

  triangles.forEach((t) => {
    let matched = false;
    for (const g of groups) {
      if (g.normal.dot(t.normal) > dotThreshold) {
        g.triangles.push(t);
        // update the group's average normal (simple accumulate then normalize)
        g.normal.add(t.normal).normalize();
        matched = true;
        break;
      }
    }
    if (!matched) {
      groups.push({ normal: t.normal.clone(), triangles: [t] });
    }
  });

  // For each group, gather unique vertices and compute polygon center & normal
  const faces = groups.map((g) => {
    const uniqueVertsMap = new Map<string, THREE.Vector3>();
    g.triangles.forEach((tri) =>
      tri.verts.forEach((v) => {
        const key = `${v.x.toFixed(5)}_${v.y.toFixed(5)}_${v.z.toFixed(5)}`;
        if (!uniqueVertsMap.has(key)) uniqueVertsMap.set(key, v.clone());
      })
    );
    const verts = Array.from(uniqueVertsMap.values());
    const center = verts.reduce((acc, v) => acc.add(v), new THREE.Vector3()).divideScalar(verts.length);
    const normal = g.normal.clone().normalize();

    // ensure normal points outward (so text faces away from center)
    if (center.dot(normal) < 0) normal.negate();

    return { center, normal, verts };
  });

  (geometry as any).userData = (geometry as any).userData || {};
  (geometry as any).userData.faceInfos = faces.map((f) => ({
    center: f.center.toArray(),
    normal: f.normal.toArray(),
  }));

  const offset = 0.2;

  return (
    <>
      {faces.map((f, i) => {
        // position: center nudged along normal a hair to avoid z-fighting
        const position = f.center.clone().add(f.normal.clone().multiplyScalar(offset));

        // rotation: rotate +Z to face normal
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.normal.clone().normalize());
        const euler = new THREE.Euler().setFromQuaternion(q);

        return (
          <Text
            key={i}
            position={position.toArray()}
            rotation={euler.toArray()}
            fontSize={0.6 * DICE_SCALAR}
            anchorX="center"
            anchorY="middle"
            color={diceText}
          >
            {labels[i]}
          </Text>
        );
      })}
    </>
  );
}

export const D4 = (props: any) => {
  const { diceColor } = useColors();
  const radius = 2.2 * DICE_SCALAR;
  const geometry = new THREE.TetrahedronGeometry(radius);
  const physicsGeometry = prepGeometry(geometry);
  const { ref, api } = useDicePhysics(physicsGeometry, props.initialPosition);
  const visualRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [quaternion, setQuaternion] = useState<[number, number, number, number]>([0, 0, 0, 1]);

  useEffect(() => {
    if (!ref.current) return;
    props.onPhysicsReady?.(api, visualRef);
    const unsubscribePosition = api.position.subscribe((p) => setPosition(p));
    const unsubscribeQuaternion = api.quaternion.subscribe((q) => setQuaternion(q));
    return () => {
      unsubscribePosition();
      unsubscribeQuaternion();
    };
  }, [api, ref.current]);

  useFrame(() => {
    if (!visualRef.current) return;
    visualRef.current.position.set(position[0], position[1], position[2]);
    visualRef.current.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
  });

  return (
    <group>
      <mesh ref={visualRef} geometry={geometry} {...props} castShadow receiveShadow>
        <meshStandardMaterial color={diceColor} />
        <FaceText geometry={geometry} labels={["1", "2", "3", "4"]} />
      </mesh>
      <mesh ref={ref} geometry={physicsGeometry} visible={false} />
    </group>
  );
};

export const D6 = (props: any) => {
  const { diceColor, diceText } = useColors();
  const radius = 2.5 * DICE_SCALAR;
  const fontSize = 0.8 * DICE_SCALAR;
  const geometry = new THREE.BoxGeometry(radius, radius, radius);
  const physicsGeometry = prepGeometry(geometry);
  const { ref, api } = useDicePhysics(physicsGeometry, props.initialPosition);
  const visualRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [quaternion, setQuaternion] = useState<[number, number, number, number]>([0, 0, 0, 1]);

  useEffect(() => {
    if (!ref.current) return;
    props.onPhysicsReady?.(api, visualRef);
    const unsubscribePosition = api.position.subscribe((p) => setPosition(p));
    const unsubscribeQuaternion = api.quaternion.subscribe((q) => setQuaternion(q));
    return () => {
      unsubscribePosition();
      unsubscribeQuaternion();
    };
  }, [api, ref.current]);

  useFrame(() => {
    if (!visualRef.current) return;
    visualRef.current.position.set(position[0], position[1], position[2]);
    visualRef.current.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
  });

  return (
    <group>
      <Box ref={visualRef} args={[radius, radius, radius]} {...props} castShadow receiveShadow>
        {Array.from(Array(6)).map((_, i) => (
          <meshPhongMaterial key={i} attach={`material-${i}`} color={diceColor} />
        ))}
        {/* Numbers on each face */}
        {/* Front (z+) */}
        <Text position={[0, 0, radius / 2 + 0.01]} fontSize={fontSize} color={diceText}>
          1
        </Text>

        {/* Back (z-) */}
        <Text position={[0, 0, -radius / 2 - 0.01]} rotation={[0, Math.PI, 0]} fontSize={fontSize} color={diceText}>
          6
        </Text>

        {/* Right (x+) */}
        <Text position={[radius / 2 + 0.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={fontSize} color={diceText}>
          2
        </Text>

        {/* Left (x-) */}
        <Text position={[-radius / 2 - 0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={fontSize} color={diceText}>
          5
        </Text>

        {/* Top (y+) */}
        <Text position={[0, radius / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={fontSize} color={diceText}>
          3
        </Text>

        {/* Bottom (y-) */}
        <Text position={[0, -radius / 2 - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} fontSize={fontSize} color={diceText}>
          4
        </Text>
      </Box>
      <mesh ref={ref} geometry={physicsGeometry} visible={false} />
    </group>
  );
};

export const D8 = (props: any) => {
  const { diceColor } = useColors();
  const radius = 2.3 * DICE_SCALAR;
  const geometry = new THREE.OctahedronGeometry(radius);
  const physicsGeometry = prepGeometry(geometry);
  const { ref, api } = useDicePhysics(physicsGeometry, props.initialPosition);
  const visualRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [quaternion, setQuaternion] = useState<[number, number, number, number]>([0, 0, 0, 1]);

  useEffect(() => {
    if (!ref.current) return;
    props.onPhysicsReady?.(api, visualRef);
    const unsubscribePosition = api.position.subscribe((p) => setPosition(p));
    const unsubscribeQuaternion = api.quaternion.subscribe((q) => setQuaternion(q));
    return () => {
      unsubscribePosition();
      unsubscribeQuaternion();
    };
  }, [api, ref.current]);

  useFrame(() => {
    if (!visualRef.current) return;
    visualRef.current.position.set(position[0], position[1], position[2]);
    visualRef.current.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
  });

  return (
    <group>
      <mesh ref={visualRef} geometry={geometry} {...props} castShadow receiveShadow>
        <meshStandardMaterial color={diceColor} />
        <FaceText geometry={geometry} labels={["1", "2", "3", "4", "5", "6", "7", "8"]} />
      </mesh>
      <mesh ref={ref} geometry={physicsGeometry} visible={false} />
    </group>
  );
};

export const D10 = (props: any) => {
  const { diceColor } = useColors();
  const sides = 10;
  const radius = 2.2 * DICE_SCALAR;
  const vertices = [
    [0, 0, 1],
    [0, 0, -1],
  ].flat();

  // https://github.com/byWulf/threejs-dice/blob/master/lib/dice.js#L499
  for (let i = 0; i < sides; ++i) {
    const b = (i * Math.PI * 2) / sides;
    vertices.push(-Math.cos(b), -Math.sin(b), 0.105 * (i % 2 ? 1 : -1));
  }

  const faces = [
    [0, 11, 2],
    [0, 2, 3],
    [0, 3, 4],
    [0, 4, 5],
    [0, 5, 6],
    [0, 6, 7],
    [0, 7, 8],
    [0, 8, 9],
    [0, 9, 10],
    [0, 10, 11],
    [1, 3, 2],
    [1, 4, 3],
    [1, 5, 4],
    [1, 6, 5],
    [1, 7, 6],
    [1, 8, 7],
    [1, 9, 8],
    [1, 10, 9],
    [1, 11, 10],
    [1, 2, 11],
  ].flat();
  const geometry = new THREE.PolyhedronGeometry(vertices, faces, radius, 0);
  const physicsGeometry = prepGeometry(geometry);
  const { ref, api } = useDicePhysics(physicsGeometry, props.initialPosition);
  const visualRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [quaternion, setQuaternion] = useState<[number, number, number, number]>([0, 0, 0, 1]);

  useEffect(() => {
    if (!ref.current) return;
    props.onPhysicsReady?.(api, visualRef);
    const unsubscribePosition = api.position.subscribe((p) => setPosition(p));
    const unsubscribeQuaternion = api.quaternion.subscribe((q) => setQuaternion(q));
    return () => {
      unsubscribePosition();
      unsubscribeQuaternion();
    };
  }, [api, ref.current]);

  useFrame(() => {
    if (!visualRef.current) return;
    visualRef.current.position.set(position[0], position[1], position[2]);
    visualRef.current.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
  });

  return (
    <group>
      <mesh ref={visualRef} geometry={geometry} {...props} castShadow receiveShadow>
        <meshStandardMaterial color={diceColor} />
        <FaceTextCustomGeometry geometry={geometry} labels={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]} />
      </mesh>
      <mesh ref={ref} geometry={physicsGeometry} visible={false} />
    </group>
  );
};

export const D12 = (props: any) => {
  const { diceColor } = useColors();
  const radius = 1.8 * DICE_SCALAR;
  const geometry = new THREE.DodecahedronGeometry(radius);
  const physicsGeometry = prepGeometry(geometry);
  const { ref, api } = useDicePhysics(physicsGeometry, props.initialPosition);
  const visualRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [quaternion, setQuaternion] = useState<[number, number, number, number]>([0, 0, 0, 1]);

  useEffect(() => {
    if (!ref.current) return;
    props.onPhysicsReady?.(api, visualRef);
    const unsubscribePosition = api.position.subscribe((p) => setPosition(p));
    const unsubscribeQuaternion = api.quaternion.subscribe((q) => setQuaternion(q));
    return () => {
      unsubscribePosition();
      unsubscribeQuaternion();
    };
  }, [api, ref.current]);

  useFrame(() => {
    if (!visualRef.current) return;
    visualRef.current.position.set(position[0], position[1], position[2]);
    visualRef.current.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
  });

  return (
    <group>
      <mesh ref={visualRef} geometry={geometry} {...props} castShadow receiveShadow>
        <meshStandardMaterial color={diceColor} />
        <FaceTextCustomGeometry
          geometry={geometry}
          labels={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
        />
      </mesh>
      <mesh ref={ref} geometry={physicsGeometry} visible={false}></mesh>
    </group>
  );
};

export const D20 = (props: any) => {
  const { diceColor } = useColors();
  const r = 2.5 * DICE_SCALAR;
  const geometry = new THREE.IcosahedronGeometry(r);
  const physicsGeometry = prepGeometry(geometry);
  const { ref, api } = useDicePhysics(physicsGeometry, props.initialPosition);
  const visualRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [quaternion, setQuaternion] = useState<[number, number, number, number]>([0, 0, 0, 1]);

  useEffect(() => {
    if (!ref.current) return;
    props.onPhysicsReady?.(api, visualRef);
    const unsubscribePosition = api.position.subscribe((p) => setPosition(p));
    const unsubscribeQuaternion = api.quaternion.subscribe((q) => setQuaternion(q));
    return () => {
      unsubscribePosition();
      unsubscribeQuaternion();
    };
  }, [api, ref.current]);

  useFrame(() => {
    if (!visualRef.current) return;
    visualRef.current.position.set(position[0], position[1], position[2]);
    visualRef.current.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
  });

  return (
    <group>
      <mesh ref={visualRef} geometry={geometry} {...props} castShadow receiveShadow>
        <meshStandardMaterial color={diceColor} />
        <FaceText
          geometry={geometry}
          labels={[
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
          ]}
        />
      </mesh>
      <mesh ref={ref} geometry={physicsGeometry} visible={false}></mesh>
    </group>
  );
};

export function getDiceGeometry(sides: number, props?: any) {
  switch (sides) {
    case 4:
      return <D4 {...props} />;
    case 6:
      return <D6 {...props} />;
    case 8:
      return <D8 {...props} />;
    case 10:
      return <D10 {...props} />;
    case 12:
      return <D12 {...props} />;
    case 20:
      return <D20 {...props} />;
    default:
      return <D6 {...props} />;
  }
}
