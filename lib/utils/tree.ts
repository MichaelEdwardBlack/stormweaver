import type { TalentNode } from "../data/tree";

var alternatingDetour: "right" | "left" = "right";

export function getSmartPath(
  from: CategorizedTalentNode,
  to: CategorizedTalentNode,
  nodes: CategorizedTalentNode[]
): string {
  const nodeWidth = 256;
  const nodeHeight = 192;
  const gapX = 300;
  const gapY = 200;
  const manualXAdjuster = 0;

  const fx = from.x * gapX + nodeWidth / 2 + manualXAdjuster;
  const fy = from.y * gapY + nodeHeight / 2;
  const tx = to.x * gapX + nodeWidth / 2 + manualXAdjuster;
  const ty = to.y * gapY + nodeHeight / 2;

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // ---- vertical edges ----
  if (dx === 0) {
    if (Math.abs(dy) <= 1) {
      // simple straight down
      return `M ${fx} ${fy} V ${ty}`;
    } else if (Math.abs(dy) > 1 && !to.isSubclass) {
      // detour around middle node
      const midY = (from.y + to.y) / 2;
      const midNode = nodes.find((n) => n.x === from.x && n.y === midY);
      if (midNode) {
        const detourOffset = 15;
        // const goRight = fx > containerWidth / 2;
        // -3 -0.5 3 | -2 0.5 3
        const goRight = from.detourDirection === "right";
        const hx = goRight ? fx + nodeWidth / 2 + detourOffset : fx - nodeWidth / 2 - detourOffset;
        return `
          M ${fx} ${fy}
          H ${hx}
          V ${ty}
          H ${tx}
        `;
      }
    } else {
      let hx = fx;
      if (alternatingDetour === "right") {
        alternatingDetour = "left";
        hx += gapX;
      } else {
        alternatingDetour = "right";
        hx -= gapX;
      }
      return `
          M ${fx} ${fy}
          H ${hx}
          V ${ty}
          H ${tx}
      `;
    }
  }

  // ---- horizontal edges ----
  if (dy === 0 && Math.abs(dx) <= 1) {
    return `M ${fx} ${fy}
            H ${tx}`;
  }

  // ---- diagonal edges ----
  if (Math.abs(dx) >= 0.5 && Math.abs(dy) < 2 && Math.abs(dy) > 0.5) {
    const midY = fy + (ty - fy) / 2;
    const txOffset = to.txDiagonalOffset ? to.txDiagonalOffset : 0;
    return `
      M ${fx} ${fy}
      V ${midY}
      H ${tx + txOffset}
      V ${ty}
    `;
  }

  if ((from.id === "shard_training" && to.id === "bloodstance") || from.id.includes("third_ideal")) {
    return `
      M ${fx} ${fy}
      H ${fx + gapX / 2}
      V ${ty}
      H ${tx}
    `;
  }
  // fallback: straight line center-to-center
  return `M ${fx} ${fy} L ${tx} ${ty}`;
}

type TransformerOptions = {
  isKeyTalent: boolean;
  collapsedSubclasses: {
    subclass1: boolean;
    subclass2: boolean;
    subclass3: boolean;
  };
  isStacked: boolean;
};

type CategorizedTalentNode = TalentNode & {
  subclassIndex?: number;
  isKeyTalent?: boolean;
};

export const categorizeTalentNode = (node: TalentNode, options: TransformerOptions): CategorizedTalentNode => {
  const n: CategorizedTalentNode = Object.assign({}, node);
  if (options.isKeyTalent) {
    n.isKeyTalent = true;
    return n;
  } else {
    n.isKeyTalent = false;
  }
  if (n.x < -1) {
    if (options.isStacked) {
      n.x += 2;
    }
    n.subclassIndex = 0;
  } else if (n.x <= 1) {
    if (options.isStacked) {
      if (options.collapsedSubclasses.subclass1) {
        n.y += 0.75;
      } else {
        n.y += 4.5;
      }
    }
    n.subclassIndex = 1;
  } else {
    if (options.isStacked) {
      n.x -= 2;
      if (options.collapsedSubclasses.subclass1 && options.collapsedSubclasses.subclass2) {
        n.y += 1.5;
      } else if (options.collapsedSubclasses.subclass1 || options.collapsedSubclasses.subclass2) {
        n.y += 5.25;
      } else {
        n.y += 9;
      }
    }
    n.subclassIndex = 2;
  }
  return n;
};
