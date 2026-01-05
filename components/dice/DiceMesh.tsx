"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getDiceGeometry } from "./NoPhysicsDiceGeometry";
import { computeFaceInfosFromGeometry } from "@/lib/utils/dieAnimations";

type DiceProps = {
  sides: number; // 4, 6, 8, 10, 12, 20
  onRollEnd: (value: number) => void;
  triggerRoll: number; // signal for when to roll the dice
  position?:
    | number
    | THREE.Vector3
    | [x: number, y: number, z: number]
    | readonly [x: number, y: number, z: number]
    | Readonly<THREE.Vector3>
    | undefined;
};

export function DiceMesh({ sides, onRollEnd, triggerRoll, position }: DiceProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const [targetQuat, setTargetQuat] = useState<THREE.Quaternion | null>(null);
  const { camera } = useThree();
  const rollDuration = 1400; // ms

  // spin + slerp
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    // find the first mesh under the group (our actual die mesh)
    const dieMesh = group.children.find((c) => (c as any).isMesh) as THREE.Mesh | undefined;
    if (!dieMesh) return;

    if (rolling) {
      dieMesh.rotation.x += delta * 12;
      dieMesh.rotation.y += delta * 10;
      dieMesh.rotation.z += delta * 8;
    } else if (targetQuat) {
      // slerp toward target quaternion
      dieMesh.quaternion.slerp(targetQuat, 0.12);

      // check difference to stop
      // robust angle diff:
      const diff = dieMesh.quaternion.clone().conjugate().multiply(targetQuat);
      const w = Math.min(Math.max(diff.w, -1), 1);
      const angle = 2 * Math.acos(w); // angle in radians

      const stopAngle = 0.03; // ~1.7 degrees
      if (angle < stopAngle) {
        // snap to exact target and finish
        dieMesh.quaternion.copy(targetQuat);
        setTargetQuat(null);
        setRolling(false);
        if (value !== null) onRollEnd(value);
      }
    }
  });

  // trigger roll when triggerRoll changes
  useEffect(() => {
    if (triggerRoll === 0) return;

    const group = groupRef.current;
    if (!group) return;

    // find the actual mesh child
    const dieMesh = group.children.find((c) => (c as any).isMesh) as THREE.Mesh | undefined;
    if (!dieMesh) {
      console.warn("No mesh found inside groupRef; cannot roll.");
      return;
    }

    setTargetQuat(null);
    setRolling(true);

    const rolledValue = Math.floor(Math.random() * sides) + 1;
    setValue(rolledValue);

    const timer = setTimeout(() => {
      // compute/obtain faceInfos from geometry.userData or compute if missing
      const geometry = dieMesh.geometry as THREE.BufferGeometry;
      let faceInfos = (geometry as any).userData?.faceInfos as { center: number[]; normal: number[] }[] | undefined;

      if (!faceInfos || faceInfos.length === 0) {
        // compute heuristically now
        const computed = computeFaceInfosFromGeometry(geometry);
        faceInfos = computed.map((f) => ({ center: f.center.toArray(), normal: f.normal.toArray() }));
        (geometry as any).userData = (geometry as any).userData || {};
        (geometry as any).userData.faceInfos = faceInfos;
      }

      // make sure we have at least one face
      if (!faceInfos || faceInfos.length === 0) {
        console.error("No face infos available to orient die.");
        setRolling(false);
        setTargetQuat(null);
        onRollEnd(rolledValue);
        return;
      }

      // Map rolled value (1..sides) -> index in faceInfos.
      // Important: if your geometry.userData.faceInfos was created by the die component
      // in the same label order (1..N), this direct map is correct:
      const faceIndex = (rolledValue - 1) % faceInfos.length;
      const face = faceInfos[faceIndex];

      const faceNormalLocal = new THREE.Vector3().fromArray(face.normal).normalize();

      // find dieMesh current quaternion and compute current world normal
      const currentNormalWorld = faceNormalLocal.clone().applyQuaternion(dieMesh.quaternion).normalize();

      // target direction from die center to camera (so the face points toward the camera)
      const dieWorldPos = new THREE.Vector3();
      dieMesh.getWorldPosition(dieWorldPos);
      const targetDir = camera.position.clone().sub(dieWorldPos).normalize();

      // rotation that rotates current world normal to targetDir
      const rotNeeded = new THREE.Quaternion().setFromUnitVectors(currentNormalWorld, targetDir);

      // final quaternion in world space = rotNeeded * currentQuat
      const targetWorldQuat = rotNeeded.clone().multiply(dieMesh.quaternion.clone());

      // convert world quaternion → local quaternion (if mesh has parent)
      if (dieMesh.parent) {
        const parentInv = dieMesh.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
        const targetLocalQuat = targetWorldQuat.clone().premultiply(parentInv);
        setTargetQuat(targetLocalQuat);
      } else {
        setTargetQuat(targetWorldQuat);
      }

      // keep rolling false (we already stopped random spin) but animation will slerp toward target
      setRolling(false);
    }, rollDuration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRoll]);

  return (
    <group ref={groupRef} position={position}>
      {/* render the die inside the group so groupRef.children[0] is the actual mesh */}
      {getDiceGeometry(sides)}
    </group>
  );
}
