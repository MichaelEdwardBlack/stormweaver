"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MotionButton } from "../ui/buttons/MotionButton";
import { ColorPicker } from "../ColorPicker";
import { DiceManager } from "./DiceManager";
import { Button } from "../ui/buttons/Button";

type DieRollerInputProps = {
  dice: string; // 2d4 or 3d6 or 1d12 etc
  onChange: (value: number) => void;
  initialValue: number;
};
export const DieRollerInput = ({ dice, onChange, initialValue }: DieRollerInputProps) => {
  const [results, setResults] = useState<Map<number, number>>(new Map());
  const [rollCount, setRollCount] = useState(0);
  const [value, setValue] = useState<number>(initialValue);
  const [diceToRoll, setDiceToRoll] = useState<{ sides: number }[]>([]);
  const resultsRef = useRef<Map<number, number>>(new Map());

  // We'll accumulate partial results in a ref and only update React state
  // when all dice have reported back to avoid N re-renders for N dice.
  // `handleRollEnd` is defined after parsing `numberOfDice` below so it can
  // reference the correct count.

  if (!dice.match(/(\d\d*)d(\d\d*)/)) {
    console.warn("Invalid dice format", dice);
    return;
  }
  const [sNumberOfDice, sDie] = dice.split("d");
  const numberOfDice = Number.parseInt(sNumberOfDice);
  const sidesOfDie = Number.parseInt(sDie);
  const min = numberOfDice;
  const max = numberOfDice * sidesOfDie;

  const handleRollEnd = useCallback(
    (index: number, val: number) => {
      resultsRef.current.set(index, val);
      // If all dice reported, copy into state and compute sum once
      if (resultsRef.current.size === numberOfDice) {
        const snapshot = new Map(resultsRef.current);
        setResults(snapshot);
        let sum = 0;
        snapshot.forEach((r) => (sum += r));
        setValue(sum);
        onChange(sum);
      }
    },
    [numberOfDice, onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number.parseInt(e.target.value);
    setValue(num);
  };

  // stable props passed to DiceManager to avoid rerenders when parent updates
  const camera = useMemo(() => ({ position: [0, 75, 12], fov: 45 } as const), []);
  const onRollCompleteCallback = useCallback(
    (value: number, index: number) => {
      handleRollEnd(index, value);
    },
    [handleRollEnd]
  );

  const validate = () => {
    const num = value;
    if (num < min) {
      window.alert("Value must be greater than " + (min - 1));
      return;
    }
    if (num > max) {
      window.alert("Value must be less than " + (max + 1));
      return;
    }
    onChange(num);
  };

  const roll = () => {
    const diceToRoll = Array.from(Array(numberOfDice)).map((_) => ({ sides: sidesOfDie }));
    // reset refs + state for a fresh roll
    resultsRef.current = new Map();
    setResults(new Map());
    setDiceToRoll(diceToRoll);
    setRollCount((c) => c + 1); // increment trigger → causes dice reroll
  };

  // Clear the ref when the diceToRoll array changes (new roll or cleared)
  useEffect(() => {
    resultsRef.current = new Map();
  }, [diceToRoll]);

  const getLeftHandEquation = () => {
    let equation = " = ";
    equation += results.get(0) ?? "?";
    for (let i = 1; i < results.size; i++) {
      equation += " + " + (results.get(i) ?? "?");
    }
    return equation;
  };

  return (
    <>
      <label>Enter an appropriate value for {dice}, or use the button to roll a value for you</label>
      <div className="flex gap-2">
        <input
          type="number"
          onChange={handleChange}
          onBlur={validate}
          value={value}
          min={min}
          max={max}
          className="p-2 border border-gray-300 rounded w-full max-w-3xs text-center"
        />
        {results.size > 0 && <pre className="flex items-center">{getLeftHandEquation()}</pre>}
      </div>
      <div className="flex gap-2">
        <MotionButton
          className="bg-primary-600 hover:bg-accent-600 px-4 py-2 rounded w-full max-w-3xs font-semibold text-white"
          onClick={() => roll()}
        >
          Roll {dice} Dice
        </MotionButton>
        <ColorPicker />
      </div>
      {/** Memoize camera and onRollComplete to keep prop identities stable */}
      <DiceManager camera={camera} rolls={diceToRoll} triggerRoll={rollCount} onRollComplete={onRollCompleteCallback} />
      {diceToRoll.length > 0 && (
        <div className="bottom-2 right-2 fixed">
          <Button
            color="accent"
            onClick={() => {
              setDiceToRoll([]);
            }}
          >
            Clear Dice
          </Button>
        </div>
      )}
    </>
  );
};
