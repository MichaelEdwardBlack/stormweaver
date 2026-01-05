"use client";
import { useFrame } from "@react-three/fiber";
import { type PublicApi } from "@react-three/cannon";
import * as THREE from "three";
import { useState, useEffect, useRef } from "react";
import { getDiceGeometry } from "./DiceGeometry";
import { computeFaceInfosFromGeometry, getDieImpulse } from "@/lib/utils/dieAnimations";

type DiceProps = {
  sides: number; // 4, 6, 8, 10, 12, or 20
  onRollComplete?: (value: number) => void;
  triggerRoll: number; // signal for when to roll the dice
  initialPosition?: [number, number, number];
};

export const PhysicsDie = ({ sides, onRollComplete, triggerRoll, initialPosition = [0, 0, 0] }: DiceProps) => {
  const [rolling, setRolling] = useState(false);
  const [api, setApi] = useState<PublicApi>();
  const visualRef = useRef<any>(null);
  const hasStartedMoving = useRef(false);
  const stableFrameCount = useRef(0);
  const currentVelocity = useRef<number[]>([0, 0, 0]);
  const currentAngularVelocity = useRef<number[]>([0, 0, 0]);

  // Set up velocity subscriptions when api is available
  useEffect(() => {
    if (!api) return;

    const unsubVelocity = api.velocity.subscribe((v) => {
      currentVelocity.current = v;
    });

    const unsubAngular = api.angularVelocity.subscribe((av) => {
      currentAngularVelocity.current = av;
    });

    // Cleanup subscriptions
    return () => {
      unsubVelocity();
      unsubAngular();
    };
  }, [api]);

  useEffect(() => {
    roll();
  }, [triggerRoll, api]);

  // Modify the useFrame to use the ref values
  useFrame(() => {
    if (!rolling) return;

    const velocity = currentVelocity.current;
    const angularVelocity = currentAngularVelocity.current;

    const speed = Math.sqrt(velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2);
    const spin = Math.sqrt(angularVelocity[0] ** 2 + angularVelocity[1] ** 2 + angularVelocity[2] ** 2);

    // Check if die has started moving significantly
    if (!hasStartedMoving.current && (speed > 1 || spin > 1)) {
      hasStartedMoving.current = true;
      stableFrameCount.current = 0;
    }

    // Only check for stopping after die has started moving
    if (hasStartedMoving.current) {
      if (speed < 0.1 && spin < 0.1) {
        stableFrameCount.current++;

        // Wait for 10 stable frames to ensure die has truly stopped
        if (stableFrameCount.current >= 10) {
          const dieMesh = visualRef.current;
          if (dieMesh && rolling) {
            setRolling(false);
            hasStartedMoving.current = false;
            stableFrameCount.current = 0;
            const face = getTopFace(dieMesh);
            onRollComplete?.(face);
          }
        }
      } else {
        stableFrameCount.current = 0;
      }
    }
  });

  // Apply roll
  const roll = () => {
    const { force, torque } = getDieImpulse(sides);
    setRolling(true);

    // Start near the "bottom" of the screen (closer to the camera on Z)
    // Start near the bottom of the screen
    const startX = initialPosition[0];
    const startY = initialPosition[1]; // above the ground slightly
    const startZ = initialPosition[2]; // coming toward center (Z=0)

    api?.position.set(startX, startY, startZ);
    const euler = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const quaternion = new THREE.Quaternion().setFromEuler(euler);
    api?.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

    // Reset motion
    api?.velocity.set(0, 0, 0);
    api?.angularVelocity.set(0, 0, 0);

    // Random orientation (Euler angles)
    const randomRot = [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2];
    api?.rotation.set(randomRot[0], randomRot[1], randomRot[2]);

    // Apply a world-space impulse
    const forward = -force * (2 + Math.random() * 1.8); // push toward center
    const upward = -force * 0.3 + Math.random() * 0.5; // small bounce
    const sideways = (Math.random() - 0.5) * force * 0.5; // side variation

    // This impulse is now world-space and won't rotate unpredictably
    api?.applyImpulse([sideways, upward, forward], [0, 0, 0]);

    // Add random spin
    const spin = torque * 2;
    api?.applyTorque([(Math.random() - 0.5) * spin, (Math.random() - 0.5) * spin, (Math.random() - 0.5) * spin]);
  };

  return (
    <group>
      {getDiceGeometry(sides, {
        onPhysicsReady: (api: PublicApi, ref: any) => {
          setApi(api);
          visualRef.current = ref.current;
        },
        initialPosition,
      })}
    </group>
  );
};

/**
 * Calculate the top-facing value of a cube/die
 * For cubes, use the worldUp vector; for others, approximate using normals
 */
function getTopFace(mesh: THREE.Mesh): number {
  const up = new THREE.Vector3(0, 1, 0);
  const geometry = mesh.geometry;
  let faceInfos = (geometry as any).userData?.faceInfos as { center: number[]; normal: number[] }[] | undefined;

  if (!faceInfos || faceInfos.length === 0) {
    // compute heuristically now
    const computed = computeFaceInfosFromGeometry(geometry);
    faceInfos = computed.map((f) => ({ center: f.center.toArray(), normal: f.normal.toArray() }));
    (geometry as any).userData = (geometry as any).userData || {};
    (geometry as any).userData.faceInfos = faceInfos;
  }

  if (faceInfos && faceInfos.length > 0) {
    let bestDot = -Infinity;
    let bestFace = 1;
    const matrix = mesh.matrix;
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);

    for (let i = 0; i < faceInfos.length; i++) {
      const localNormal = new THREE.Vector3().fromArray(faceInfos[i].normal);

      // Convert to world space (applies rotation, ignores translation)
      const worldNormal = localNormal.clone().applyMatrix3(normalMatrix).normalize();
      const dot = worldNormal.dot(up);
      if (dot > bestDot) {
        bestDot = dot;
        bestFace = i + 1;
      }
    }
    return bestFace;
  } else {
    console.warn("Face infos missing or incomplete; cannot determine top face accurately.");
    return 1; // fallback
  }
}
