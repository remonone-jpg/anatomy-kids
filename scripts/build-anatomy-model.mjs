/**
 * Converts a Z-Anatomy FBX into a single GLB the viewer can load.
 *
 *   node scripts/build-anatomy-model.mjs <in.fbx> <out.glb> [--exclude=a,b] [--include=a,b]
 *
 * The source files ship as hundreds of separately named meshes — one per body
 * region, per organ, per vessel. The app never addresses one on its own, so
 * they are merged into a single geometry, which also removes hundreds of draw
 * calls. `--exclude` drops meshes whose name contains any of the given
 * substrings, which is how the context layer avoids shipping a second copy of
 * every organ that is already placed from `body-placement.ts`.
 *
 * Positions are quantised to 16-bit and normals to 8-bit. These layers render
 * as soft translucent surfaces, so they cannot show the precision full floats
 * would cost, and the quantised file is roughly a quarter of the size.
 *
 * Z-Anatomy is CC-BY-SA 4.0; see ATTRIBUTION.md.
 */
import fs from "node:fs";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const [input, output, ...flags] = process.argv.slice(2);
if (!input || !output) {
  console.error("usage: node scripts/build-anatomy-model.mjs <in.fbx> <out.glb> [--exclude=a,b] [--include=a,b]");
  process.exit(1);
}

const listFlag = (name) => {
  const found = flags.find((flag) => flag.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3).split(",").map((t) => t.trim().toLowerCase()).filter(Boolean) : [];
};
const exclude = listFlag("exclude");
const include = listFlag("include");
const wanted = (name) => {
  const lower = name.toLowerCase();
  if (include.length && !include.some((t) => lower.includes(t))) return false;
  return !exclude.some((t) => lower.includes(t));
};

/** `--list` prints what survives the filters and writes nothing — the only
 *  practical way to choose filters for a file with hundreds of parts. */
const listOnly = flags.includes("--list");

const buf = fs.readFileSync(input);
const root = new FBXLoader().parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), "");
root.updateMatrixWorld(true);

/** Collects world-space triangles from every mesh in the file. */
const positions = [];
const normals = [];
let meshCount = 0;

const normalMatrix = new THREE.Matrix3();
const vertex = new THREE.Vector3();
const normal = new THREE.Vector3();

let skipped = 0;
const kept = [];
root.traverse((object) => {
  if (!object.isMesh) return;
  if (!wanted(object.name)) { skipped += 1; return; }
  meshCount += 1;
  const geometry = object.geometry;
  const position = geometry.attributes.position;
  const sourceNormal = geometry.attributes.normal;
  const index = geometry.index;
  normalMatrix.getNormalMatrix(object.matrixWorld);

  const emit = (i) => {
    vertex.fromBufferAttribute(position, i).applyMatrix4(object.matrixWorld);
    positions.push(vertex.x, vertex.y, vertex.z);
    if (sourceNormal) {
      normal.fromBufferAttribute(sourceNormal, i).applyMatrix3(normalMatrix).normalize();
      normals.push(normal.x, normal.y, normal.z);
    } else {
      normals.push(0, 1, 0);
    }
  };

  const before = positions.length;
  if (index) for (let i = 0; i < index.count; i += 1) emit(index.getX(i));
  else for (let i = 0; i < position.count; i += 1) emit(i);
  kept.push({ name: object.name, tris: (positions.length - before) / 9 });
});

if (listOnly) {
  const rows = kept
    .map((entry) => `${String(Math.round(entry.tris)).padStart(7)}  ${entry.name}`)
    .sort((a, b) => Number(b.slice(0, 7)) - Number(a.slice(0, 7)));
  console.log(`kept ${kept.length} meshes (skipped ${skipped}), ${Math.round(rows.reduce((n, r) => n + Number(r.slice(0, 7)), 0))} triangles`);
  for (const row of rows) console.log(row);
  process.exit(0);
}

const vertexCount = positions.length / 3;
console.log(`merged ${meshCount} meshes (skipped ${skipped}) -> ${vertexCount / 3} triangles`);

// Bounds drive both the quantisation window and the accessor min/max glTF requires.
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < positions.length; i += 3) {
  for (let a = 0; a < 3; a += 1) {
    min[a] = Math.min(min[a], positions[i + a]);
    max[a] = Math.max(max[a], positions[i + a]);
  }
}
console.log("bounds min", min.map((n) => +n.toFixed(2)), "max", max.map((n) => +n.toFixed(2)));

// Map the bounding box onto the full signed 16-bit range, then undo it with the
// node scale/translation so the mesh keeps its original centimetre coordinates.
const extent = [0, 1, 2].map((a) => Math.max(max[a] - min[a], 1e-6));
const scale = extent.map((e) => e / 65534);
const offset = [0, 1, 2].map((a) => min[a] + extent[a] / 2);

const quantPositions = new Int16Array(vertexCount * 3);
for (let i = 0; i < vertexCount; i += 1) {
  for (let a = 0; a < 3; a += 1) {
    const centred = positions[i * 3 + a] - offset[a];
    quantPositions[i * 3 + a] = Math.max(-32767, Math.min(32767, Math.round(centred / scale[a])));
  }
}

// Normals as normalised signed bytes, padded to a 4-byte stride per glTF rules.
const quantNormals = new Int8Array(vertexCount * 4);
for (let i = 0; i < vertexCount; i += 1) {
  for (let a = 0; a < 3; a += 1) {
    quantNormals[i * 4 + a] = Math.max(-127, Math.min(127, Math.round(normals[i * 3 + a] * 127)));
  }
  quantNormals[i * 4 + 3] = 0;
}

const align4 = (n) => (n + 3) & ~3;
const posBytes = quantPositions.byteLength;
const normOffset = align4(posBytes);
const binLength = align4(normOffset + quantNormals.byteLength);
const bin = new Uint8Array(binLength);
bin.set(new Uint8Array(quantPositions.buffer), 0);
bin.set(new Uint8Array(quantNormals.buffer), normOffset);

const quantMin = [0, 1, 2].map((a) => Math.round((min[a] - offset[a]) / scale[a]));
const quantMax = [0, 1, 2].map((a) => Math.round((max[a] - offset[a]) / scale[a]));

const gltf = {
  asset: { version: "2.0", generator: "build-anatomy-model.mjs" },
  extensionsUsed: ["KHR_mesh_quantization"],
  extensionsRequired: ["KHR_mesh_quantization"],
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, scale, translation: offset, name: "AnatomyLayer" }],
  meshes: [{ name: "AnatomyLayer", primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, material: 0 }] }],
  materials: [{ name: "AnatomyLayer", pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], metallicFactor: 0, roughnessFactor: 1 }, doubleSided: true }],
  accessors: [
    { bufferView: 0, componentType: 5122, normalized: false, count: vertexCount, type: "VEC3", min: quantMin, max: quantMax },
    { bufferView: 1, componentType: 5120, normalized: true, count: vertexCount, type: "VEC3" },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: posBytes, byteStride: 6, target: 34962 },
    { buffer: 0, byteOffset: normOffset, byteLength: quantNormals.byteLength, byteStride: 4, target: 34962 },
  ],
  buffers: [{ byteLength: binLength }],
};

const jsonBytes = Buffer.from(JSON.stringify(gltf), "utf8");
const jsonPadded = Buffer.alloc(align4(jsonBytes.length), 0x20);
jsonBytes.copy(jsonPadded);

const header = Buffer.alloc(12);
header.write("glTF", 0, "ascii");
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + binLength, 8);

const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonPadded.length, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4); // "JSON"

const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(binLength, 0);
binHeader.writeUInt32LE(0x004e4942, 4); // "BIN"

fs.writeFileSync(output, Buffer.concat([header, jsonHeader, jsonPadded, binHeader, Buffer.from(bin)]));
console.log(`wrote ${output} — ${(fs.statSync(output).size / 1048576).toFixed(1)} MB`);
