import * as THREE from "three";

export function computeFaceInfosFromGeometry(geo: THREE.BufferGeometry) {
  // similar clustering approach as D12 — returns array of {center: Vector3, normal: Vector3}
  const posAttr = geo.attributes.position;
  if (!posAttr) return [];

  // If geo has an index, iterate indexed triangles; otherwise iterate sequential triplets
  const triangles: { center: THREE.Vector3; normal: THREE.Vector3; verts: THREE.Vector3[] }[] = [];
  if (geo.index) {
    const idx = geo.index.array as Uint16Array | Uint32Array;
    for (let i = 0; i < idx.length; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(posAttr, idx[i]);
      const b = new THREE.Vector3().fromBufferAttribute(posAttr, idx[i + 1]);
      const c = new THREE.Vector3().fromBufferAttribute(posAttr, idx[i + 2]);
      const center = new THREE.Vector3()
        .addVectors(a, b)
        .add(c)
        .multiplyScalar(1 / 3);
      const normal = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
      triangles.push({ center, normal, verts: [a, b, c] });
    }
  } else {
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < arr.length; i += 9) {
      const a = new THREE.Vector3(arr[i], arr[i + 1], arr[i + 2]);
      const b = new THREE.Vector3(arr[i + 3], arr[i + 4], arr[i + 5]);
      const c = new THREE.Vector3(arr[i + 6], arr[i + 7], arr[i + 8]);
      const center = new THREE.Vector3()
        .addVectors(a, b)
        .add(c)
        .multiplyScalar(1 / 3);
      const normal = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
      triangles.push({ center, normal, verts: [a, b, c] });
    }
  }

  // cluster triangles by normal
  const groups: { normal: THREE.Vector3; triangles: typeof triangles }[] = [];
  const dotThreshold = 0.995;
  triangles.forEach((t) => {
    let matched = false;
    for (const g of groups) {
      if (g.normal.dot(t.normal) > dotThreshold) {
        g.triangles.push(t);
        g.normal.add(t.normal).normalize();
        matched = true;
        break;
      }
    }
    if (!matched) groups.push({ normal: t.normal.clone(), triangles: [t] });
  });

  // collapse to polygon faces
  const faces = groups.map((g) => {
    const unique = new Map<string, THREE.Vector3>();
    g.triangles.forEach((tri) =>
      tri.verts.forEach((v) => {
        const key = `${v.x.toFixed(5)}_${v.y.toFixed(5)}_${v.z.toFixed(5)}`;
        if (!unique.has(key)) unique.set(key, v.clone());
      })
    );
    const verts = Array.from(unique.values());
    const center = verts.reduce((acc, v) => acc.add(v), new THREE.Vector3()).divideScalar(verts.length);
    const normal = g.normal.clone().normalize();
    if (center.dot(normal) < 0) normal.negate();
    return { center, normal };
  });

  return faces;
}

export const getDieImpulse = (sides: number) => {
  switch (sides) {
    case 4:
      return { force: 8, torque: 1000 }; // d4 needs less force
    case 20:
      return { force: 12, torque: 1000 }; // d20 needs more force
    default:
      return { force: 10, torque: 1000 }; // default values
  }
};

export function prepGeometry(geometry: THREE.BufferGeometry, tolerance = 1e-4) {
  tolerance = Math.max(tolerance, Number.EPSILON);
  tolerance *= tolerance;

  const indices = geometry.getIndex();
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  const colors = geometry.getAttribute("color");
  const uvs = geometry.getAttribute("uv");

  const vertexCount = indices ? indices.count : positions.count;

  const newVertices: {
    x: number;
    y: number;
    z: number;
    index: number;
    normal?: THREE.Vector3;
    color?: THREE.Color;
    uv?: [number, number];
  }[] = [];

  const newIndices: number[] = [];

  for (let i = 0; i < vertexCount; i++) {
    const idx = indices ? indices.getX(i) : i;

    const pos = {
      x: positions.getX(idx),
      y: positions.getY(idx),
      z: positions.getZ(idx),
      index: newVertices.length,
      normal: normals ? new THREE.Vector3(normals.getX(idx), normals.getY(idx), normals.getZ(idx)) : undefined,
      color: colors ? new THREE.Color(colors.getX(idx), colors.getY(idx), colors.getZ(idx)) : undefined,
      uv: uvs ? ([uvs.getX(idx), uvs.getY(idx)] as [number, number]) : undefined,
    };

    let found = false;
    for (const v of newVertices) {
      if (distanceToSquared(v, pos) < tolerance) {
        newIndices.push(v.index);
        found = true;
        break;
      }
    }

    if (!found) {
      newVertices.push(pos);
      newIndices.push(pos.index);
    }
  }

  const result = new THREE.BufferGeometry();

  // positions
  const verticesArray: number[] = [];
  newVertices.forEach((v) => {
    verticesArray.push(v.x, v.y, v.z);
  });
  result.setAttribute("position", new THREE.Float32BufferAttribute(verticesArray, 3));

  // normals
  if (normals) {
    const normalArray: number[] = [];
    newVertices.forEach((v) => {
      if (v.normal) normalArray.push(v.normal.x, v.normal.y, v.normal.z);
    });
    result.setAttribute("normal", new THREE.Float32BufferAttribute(normalArray, 3));
  } else {
    result.computeVertexNormals();
  }

  // colors
  if (colors) {
    const colorArray: number[] = [];
    newVertices.forEach((v) => {
      if (v.color) colorArray.push(v.color.r, v.color.g, v.color.b);
    });
    result.setAttribute("color", new THREE.Float32BufferAttribute(colorArray, 3));
  }

  // uvs
  if (uvs) {
    const uvArray: number[] = [];
    newVertices.forEach((v) => {
      if (v.uv) uvArray.push(v.uv[0], v.uv[1]);
    });
    result.setAttribute("uv", new THREE.Float32BufferAttribute(uvArray, 2));
  }

  result.setIndex(newIndices);
  result.scale(1.01, 1.01, 1.01);

  return result;
}

function distanceToSquared(p1: { x: number; y: number; z: number }, p2: { x: number; y: number; z: number }) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return dx * dx + dy * dy + dz * dz;
}
