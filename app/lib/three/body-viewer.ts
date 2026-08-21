import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { organStructures, type OrganId } from "../anatomy-data";
import { disposeObject } from "./dispose";

/**
 * The whole body at once: a translucent human shell with every organ inside it,
 * at its real size and in its real place — and actually joined to each other.
 *
 * The organs here are not the ones the single-organ viewer shows. Those were
 * each generated on their own, so however carefully they are positioned their
 * stumps never meet: the heart's great vessels stop short of the aorta, the
 * lungs never reach the trachea. These come from one segmentation of one body
 * (Z-Anatomy, CC-BY-SA 4.0), already sharing the shell's coordinate space, so
 * the oesophagus really does run into the stomach and the stomach into the
 * duodenum. They need no placement at all — only a tint.
 *
 * Separate from `AnatomyViewer`, which exists to show one organ large with
 * labelled hotspots. Almost nothing is shared between the two — different
 * camera framing, different materials, different units — so folding this in
 * would have meant two viewers wearing one class.
 *
 * The scene works in centimetres, matching `body-placement.ts`.
 */

type Callbacks = {
  onLoading: (loading: boolean, progress: number) => void;
  onPick: (id: OrganId) => void;
  onHover: (id: OrganId | null) => void;
};

type Options = { compact?: boolean };

/** The organ the shell itself stands for — it is the boundary, not a part. */
const SHELL_ORGAN: OrganId = "skin";

/** Every organ that exists as an atlas model. Skin is the shell. */
const ATLAS_ORGANS: OrganId[] = [
  "brain", "eyeball", "lungs", "heart", "liver", "pancreas", "kidneys", "intestine",
];

/**
 * Tissue colours, not UI colours. The accents in `anatomy-data` are chosen to
 * read as small chips beside a label; used as paint on a whole organ they turn
 * the body into one salmon-coloured mass. These are the shades the tissues
 * actually have, which is also what tells them apart on screen.
 *
 * `opacity` below 1 is for organs that would otherwise hide something the child
 * came to see — the lungs sit in front of the heart.
 */
const TISSUE: Record<string, { color: number; opacity: number }> = {
  brain: { color: 0xd3b3ad, opacity: 1 },
  eyeball: { color: 0xece5db, opacity: 1 },
  lungs: { color: 0xd98f8a, opacity: 0.62 },
  heart: { color: 0xa8413a, opacity: 1 },
  liver: { color: 0x8d5044, opacity: 1 },
  pancreas: { color: 0xcfae7c, opacity: 1 },
  kidneys: { color: 0x94473f, opacity: 1 },
  intestine: { color: 0xd39c7e, opacity: 1 },
};

const tissueOf = (id: OrganId) =>
  TISSUE[id] ?? { color: new THREE.Color(organStructures.find((o) => o.id === id)?.accent ?? "#e0ac97").getHex(), opacity: 1 };

const CAMERA_FOV = 34;
/** Centred on the organs rather than on the figure: they run from the pelvis
 *  at ~85cm to the crown of the brain at ~172cm. */
const HOME_TARGET = new THREE.Vector3(0, 128, 0);
/**
 * What the opening view should contain, in centimetres. The side panel is a
 * narrow column, where fitting the full span would leave the figure tiny — so
 * it opens tighter, on the organs rather than on the whole torso.
 */
const HOME_FRAME = { height: 112, width: 58 };
const HOME_FRAME_COMPACT = { height: 96, width: 44 };

type PlacedOrgan = { id: OrganId; group: THREE.Group; meshes: THREE.Mesh[]; material: THREE.MeshStandardMaterial };

/**
 * Structures that are not one of the nine, but without which the nine look
 * like objects floating in a person rather than parts of one body: the tube
 * from throat to stomach, the ducts leaving the liver and kidneys, and the
 * great vessels the heart actually connects to.
 *
 * They come from the same Z-Anatomy release as the shell, already in its
 * coordinate space, so they need no placement of their own.
 */
const CONTEXT_LAYERS = [
  { url: "/models/viscera.glb", color: 0xe0ac97, opacity: 0.72 },
  { url: "/models/vessels.glb", color: 0xc25f52, opacity: 0.85 },
];

export class BodyViewer {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 1, 2000);
  private controls: OrbitControls;
  private loader: GLTFLoader;
  private callbacks: Callbacks;
  private container: HTMLElement;

  private shell: THREE.Mesh | null = null;
  private shellMaterial: THREE.MeshPhysicalMaterial;
  private organs: PlacedOrgan[] = [];
  private contextMeshes: THREE.Mesh[] = [];
  private contextMaterials: THREE.MeshStandardMaterial[] = [];
  private selected: OrganId | null = null;
  private hovered: OrganId | null = null;

  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private pointerDown = { x: 0, y: 0 };
  private dragged = false;

  private frame: { height: number; width: number };
  private raf = 0;
  private dirty = true;
  private disposed = false;
  private resizeObserver: ResizeObserver;
  private width = 1;
  private height = 1;
  /** Suppresses auto-framing once the visitor has taken over the camera. */
  private userMoved = false;

  constructor(container: HTMLElement, callbacks: Callbacks, options: Options = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.frame = options.compact ? HOME_FRAME_COMPACT : HOME_FRAME;

    const lowPower = window.matchMedia("(max-width: 780px)").matches || (navigator.hardwareConcurrency ?? 8) < 6;
    this.renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.02;
    this.renderer.domElement.setAttribute("aria-label", "3D body");
    this.renderer.domElement.tabIndex = 0;
    container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, HOME_TARGET.y, 210);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enablePan = false;
    this.controls.minDistance = 60;
    this.controls.maxDistance = 400;
    this.controls.autoRotate = false;
    this.controls.target.copy(HOME_TARGET);

    // The shell is a soft glass envelope: visible enough to read as a body,
    // clear enough to leave the organs legible through it.
    this.shellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffe6d8,
      transparent: true,
      // Every organ is seen through this, so each point of opacity is paid for
      // twice: once in how well the body reads, once in how muddy the organs get.
      opacity: 0.12,
      roughness: 0.55,
      metalness: 0,
      transmission: 0,
      side: THREE.FrontSide,
      depthWrite: false,
    });

    this.loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    this.buildLights();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.controls.addEventListener("change", () => (this.dirty = true));
    this.controls.addEventListener("start", () => (this.userMoved = true));

    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointermove", this.onPointerMove);

    this.resize();
    this.animate();
  }

  private buildLights() {
    // Kept low on purpose: flat fill is what washed the tissue colours out and
    // left every organ reading as the same pale salmon. The key light carries
    // the form instead.
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    this.scene.add(new THREE.HemisphereLight(0xfff8ee, 0x3a2a2f, 0.5));
    const key = new THREE.DirectionalLight(0xfff3e7, 2.9);
    key.position.set(90, 240, 200);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xe6ecff, 1.0);
    fill.position.set(-140, 120, 160);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffb7a5, 1.3);
    rim.position.set(-80, 150, -180);
    this.scene.add(rim);
  }

  /**
   * Loads the shell and every organ. Progress is reported as a share of the
   * models finished rather than of bytes: the files differ enough in size that
   * a byte count would stall and then leap.
   */
  async load() {
    this.callbacks.onLoading(true, 0);
    const total = ATLAS_ORGANS.length + 1 + CONTEXT_LAYERS.length;
    let done = 0;
    const step = () => {
      done += 1;
      if (!this.disposed) this.callbacks.onLoading(done < total, done / total);
    };

    try {
      const shellGltf = await this.loader.loadAsync("/models/body.glb");
      if (this.disposed) return;
      shellGltf.scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.material = this.shellMaterial;
          // Drawn last so the organs behind it are already in the buffer;
          // with depthWrite off, this is what keeps the glass from erasing them.
          mesh.renderOrder = 10;
          this.shell = mesh;
        }
      });
      this.scene.add(shellGltf.scene);
      step();
    } catch {
      step();
    }

    await Promise.all([
      ...CONTEXT_LAYERS.map(async (layer) => {
        try {
          const gltf = await this.loader.loadAsync(layer.url);
          if (this.disposed) return;
          const material = new THREE.MeshStandardMaterial({
            color: layer.color,
            roughness: 0.62,
            metalness: 0,
            transparent: true,
            opacity: layer.opacity,
          });
          this.contextMaterials.push(material);
          gltf.scene.traverse((object) => {
            if (!(object as THREE.Mesh).isMesh) return;
            const mesh = object as THREE.Mesh;
            mesh.material = material;
            this.contextMeshes.push(mesh);
          });
          this.scene.add(gltf.scene);
        } catch {
          // Context is a nicety; the organs still stand without it.
        } finally {
          step();
        }
      }),
      ...ATLAS_ORGANS.map(async (id) => {
        try {
          const gltf = await this.loader.loadAsync(`/models/atlas/${id}.glb`);
          if (this.disposed) return;
          this.add(id, gltf.scene);
        } catch {
          // A missing organ should not cost the rest of the body.
        } finally {
          step();
        }
      }),
    ]);

    this.applyEmphasis();
    this.dirty = true;
  }

  /**
   * Adds one atlas organ. No scaling and no positioning: the file is already
   * in the shell's coordinate space, and moving it would be the one thing that
   * could break the joins it comes with.
   */
  private add(id: OrganId, model: THREE.Object3D) {
    const group = new THREE.Group();
    group.add(model);

    const tissue = tissueOf(id);
    const material = new THREE.MeshStandardMaterial({
      color: tissue.color,
      roughness: 0.58,
      metalness: 0,
      transparent: tissue.opacity < 1,
      opacity: tissue.opacity,
      depthWrite: tissue.opacity > 0.6,
    });

    const meshes: THREE.Mesh[] = [];
    group.traverse((object) => {
      if (!(object as THREE.Mesh).isMesh) return;
      const mesh = object as THREE.Mesh;
      mesh.material = material;
      meshes.push(mesh);
    });

    this.scene.add(group);
    this.organs.push({ id, group, meshes, material });
    this.applyEmphasis();
  }

  setSelected(id: OrganId | null) {
    if (this.selected === id) return;
    this.selected = id;
    this.applyEmphasis();
    this.dirty = true;
  }

  /**
   * Everything stays visible — seeing the whole set at once is the point — so
   * emphasis is carried by opacity and a lift in emissive rather than by hiding.
   */
  private applyEmphasis() {
    const anySelected = this.selected !== null && this.selected !== SHELL_ORGAN;
    for (const organ of this.organs) {
      const isSelected = organ.id === this.selected;
      const isHovered = organ.id === this.hovered;
      const base = tissueOf(organ.id).opacity;
      const opacity = !anySelected ? base : isSelected ? 1 : base * 0.3;
      organ.material.transparent = opacity < 1;
      organ.material.opacity = opacity;
      organ.material.depthWrite = opacity > 0.6;
      organ.material.emissive.setHex(isSelected || isHovered ? 0x2a0e08 : 0x000000);
      organ.material.needsUpdate = true;
    }
    // Context recedes as soon as one organ is the subject, so it frames the
    // body without competing with whatever the child just tapped.
    for (const [index, material] of this.contextMaterials.entries()) {
      const base = CONTEXT_LAYERS[index]?.opacity ?? 0.7;
      material.opacity = anySelected ? base * 0.34 : base;
    }
    this.shellMaterial.opacity = this.selected === SHELL_ORGAN ? 0.4 : 0.12;
    this.shellMaterial.color.setHex(this.selected === SHELL_ORGAN ? 0xffb9a3 : 0xffe6d8);
  }

  private hit(event: PointerEvent): OrganId | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const meshes = this.organs.flatMap((organ) => organ.meshes);
    const organHit = this.raycaster.intersectObjects(meshes, false)[0];
    const contextHit = this.raycaster.intersectObjects(this.contextMeshes, false)[0];
    if (organHit && (!contextHit || organHit.distance <= contextHit.distance)) {
      const found = this.organs.find((organ) => organ.meshes.includes(organHit.object as THREE.Mesh));
      if (found) return found.id;
    }
    // A tap that lands on the stomach or the aorta selects nothing rather than
    // falling through to the skin behind it, which would be a lie about what
    // was pressed.
    if (contextHit) return null;
    // Falling through to the shell makes the skin selectable by tapping an arm
    // or a leg, which is the one place it is not competing with an organ.
    if (this.shell && this.raycaster.intersectObject(this.shell, false).length > 0) return SHELL_ORGAN;
    return null;
  }

  private onPointerDown = (event: PointerEvent) => {
    this.pointerDown = { x: event.clientX, y: event.clientY };
    this.dragged = false;
  };

  private onPointerMove = (event: PointerEvent) => {
    if (event.buttons > 0) return;
    const id = this.hit(event);
    if (id === this.hovered) return;
    this.hovered = id;
    this.renderer.domElement.style.cursor = id ? "pointer" : "grab";
    this.callbacks.onHover(id);
    this.applyEmphasis();
    this.dirty = true;
  };

  private onPointerUp = (event: PointerEvent) => {
    const moved = Math.hypot(event.clientX - this.pointerDown.x, event.clientY - this.pointerDown.y);
    // Orbiting always ends on a pointerup somewhere over the body; without this
    // every rotation would also count as a tap.
    if (moved > 6) this.dragged = true;
    if (this.dragged) return;
    const id = this.hit(event);
    if (id) this.callbacks.onPick(id);
  };

  /**
   * Distance that fits `HOME_FRAME` in the panel it has been given. The panel
   * is tall and narrow on a desktop and short and wide on a phone, so a fixed
   * distance would crop the body on one and strand it in space on the other.
   */
  private homeDistance() {
    const vFov = THREE.MathUtils.degToRad(CAMERA_FOV);
    const byHeight = this.frame.height / 2 / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);
    const byWidth = this.frame.width / 2 / Math.tan(hFov / 2);
    return Math.max(byHeight, byWidth);
  }

  reset() {
    this.controls.target.copy(HOME_TARGET);
    this.camera.position.set(0, HOME_TARGET.y, this.homeDistance());
    this.controls.update();
    this.dirty = true;
  }

  /** Frames the selected organ instead of the whole body. */
  focus(id: OrganId) {
    const organ = this.organs.find((entry) => entry.id === id);
    if (!organ) return this.reset();
    const box = new THREE.Box3().setFromObject(organ.group);
    const center = box.getCenter(new THREE.Vector3());
    const radius = box.getSize(new THREE.Vector3()).length() / 2;
    const distance = Math.max(45, (radius / Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2))) * 2.1);
    this.controls.target.copy(center);
    this.camera.position.set(center.x, center.y + radius * 0.3, center.z + distance);
    this.controls.update();
    this.dirty = true;
  }

  private resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    if (!this.userMoved) this.reset();
    this.dirty = true;
  }

  private animate = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.animate);
    const moved = this.controls.update();
    if (moved || this.dirty) {
      this.renderer.render(this.scene, this.camera);
      this.dirty = false;
    }
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    this.controls.dispose();
    disposeObject(this.scene);
    this.shellMaterial.dispose();
    for (const material of this.contextMaterials) material.dispose();
    for (const organ of this.organs) organ.material.dispose();
    this.renderer.dispose();
    canvas.remove();
  }
}

