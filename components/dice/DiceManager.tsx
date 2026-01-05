"use client";

import { Canvas, type CameraProps } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Ground } from "./Ground";
import { PhysicsDie } from "./PhysicsDie";
import { Physics } from "@react-three/cannon";
import { Attribute, Skill } from "@/lib/generated/prisma/enums";

type DiceManagerProps = {
  rolls: { sides: number; attribute?: Attribute; skill?: Skill; label?: string }[];
  triggerRoll: number;
  camera?: CameraProps;
  onRollComplete?: (value: number, index: number) => void;
  supressFirstRoll?: boolean;
};

export function DiceManager({
  rolls,
  triggerRoll,
  camera = { position: [0, 10, 12], fov: 45 },
  onRollComplete,
}: DiceManagerProps) {
  const handleRollEnd = (index: number, value: number) => {
    // const roll = rolls[index];

    onRollComplete?.(value, index);
    // toast({
    //   title: `Die Result${rolls.length > 1 ? ` for ${roll.label ?? ""}` : ""}`,
    //   message: `Rolled a ${value} on a d${roll.sides}`,
    //   variant: "info",
    //   // roll: value,
    //   // attribute: roll.attribute,
    //   // skill: roll.skill,
    //   // label: roll.label,
    // });
  };

  const physicsKey = useMemo(() => {
    // include triggerRoll and a lightweight signature of rolls so changes cause remount
    const signature = rolls.map((r) => `${r.sides}:${r.attribute ?? ""}:${r.skill ?? ""}`).join("|");
    return `physics-${triggerRoll}-${rolls.length}-${signature}`;
  }, [rolls, triggerRoll]);

  const y = camera.position && Array.isArray(camera.position) && camera.position[1] ? camera.position[1] : 40;

  return (
    <div className="z-20 fixed inset-0 pointer-events-none">
      <Canvas shadows camera={camera} style={{ pointerEvents: "none" }}>
        <ambientLight intensity={0.6} />
        {/* Strong directional sunlight */}
        <directionalLight
          position={[20, y, 20]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={100}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
          shadow-bias={-0.0005}
        />
        {/* Optional: softer fill light from opposite side */}
        <directionalLight position={[-20, y / 2, -20]} intensity={0.3} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <Ground />
            {rolls.map((roll, i) => {
              // create a stable per-die key that changes when we want the die to be recreated
              const dieKey = `${physicsKey}-die-${i}-${roll.sides}-${roll.attribute ?? ""}-${roll.skill ?? ""}`;
              return (
                <PhysicsDie
                  key={dieKey}
                  sides={roll.sides}
                  triggerRoll={triggerRoll}
                  onRollComplete={(val) => handleRollEnd(i, val)}
                  initialPosition={[
                    i * 6 - (rolls.length / 2) * 6 + 2,
                    0.5 + Math.random() * 2,
                    20 + (Math.random() - 0.5) * 4,
                  ]}
                />
              );
            })}
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
