import { useColors } from "../store/colors";
// helper: determine best contrast text color (black or white)
function getContrastColor(hex: string): string {
  // remove #
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;

  // luminance (perceived brightness)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > 186 ? "black" : "white";
}

export const ColorPicker = () => {
  const { diceColor, setDiceColor, setDiceText } = useColors();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setDiceColor(color);
    setDiceText(getContrastColor(color));
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="die-color" className="font-medium text-sm">
        Pick Die Color:
      </label>
      <input
        id="die-color"
        type="color"
        value={diceColor}
        onChange={handleChange}
        className="border border-gray-300 rounded w-10 h-10 cursor-pointer"
      />
      <div
        className="px-3 py-1 rounded text-sm"
        style={{ backgroundColor: diceColor, color: getContrastColor(diceColor) }}
      >
        {diceColor.toUpperCase()}
      </div>
    </div>
  );
};
