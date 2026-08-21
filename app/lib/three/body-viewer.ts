import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { OrganId } from "../anatomy-data";
import { BODY_HEIGHT_CM, organPlacements, SHELL_ORGAN, type OrganPlacement } from "../body-placement";
import { disposeObject } from "./dispose";

/**
 * The whole body at once: a translucent human shell with every organ inside it,
 * at its real size and in its real place.
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

const CAMERA_FOV = 34;
/** Centred on the organs rather than on the figure: they run from the pelvis
 *  at ~85cm to the crown of the brain at ~172cm. */
const HOME_TARGET = new THREE.Vector3(0, 128, 0);
/** What the opening view should contain, in centimetres. */
const HOME_FRAME = { height: 112, width: 58 };

type PlacedOrgan = { id: OrganId; group: THREE.Group; meshes: THREE.Mesh[] };

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
  private selected: OrganId | null = null;
  private hovered: OrganId | null = null;

  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private pointerDown = { x: 0, y: 0 };
  private dragged = false;

  private frame = 0;
  private dirty = true;
  private disposed = false;
  private resizeObserver: ResizeObserver;
  private width = 1;
  private height = 1;
  /** Suppresses auto-framing once the visitor has taken over the camera. */
  private userMoved = false;

  constructor(container: HTMLElement, callbacks: Callbacks) {
    this.container = container;
    this.callbacks = callbacks;

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
      opacity: 0.17,
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
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    this.scene.add(new THREE.HemisphereLight(0xfff8ee, 0x3a2a2f, 0.8));
    const key = new THREE.DirectionalLight(0xfff3e7, 2.6);
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
    const total = organPlacements.length + 1;
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

    await Promise.all(
      organPlacements.map(async (placement) => {
        try {
          const gltf = await this.loader.loadAsync(`/models/${placement.id}.glb`);
          if (this.disposed) return;
          this.place(placement, gltf.scene);
        } catch {
          // A missing organ should not cost the rest of the body.
        } finally {
          step();
        }
      }),
    );

    this.dirty = true;
  }

  /**
   * Fits one model into its anatomical box: rotate, then scale uniformly so the
   * tightest axis matches, then centre. Uniform scale matters — fitting each
   * axis on its own would stretch the organ into the box's proportions and lose
   * the shape the model is there to show.
   */
  private place(placement: OrganPlacement, model: THREE.Object3D) {
    const target = new THREE.Vector3(...placement.size);

    for (const center of placement.centers) {
      const instance = placement.centers.length > 1 ? model.clone(true) : model;
      const group = new THREE.Group();

      if (placement.rotation) {
        const [rx, ry, rz] = placement.rotation;
        instance.rotation.set(
          THREE.MathUtils.degToRad(rx),
          THREE.MathUtils.degToRad(ry),
          THREE.MathUtils.degToRad(rz),
        );
      }
      instance.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(instance);
      const size = box.getSize(new THREE.Vector3());
      const scale = Math.min(
        target.x / Math.max(size.x, 1e-6),
        target.y / Math.max(size.y, 1e-6),
        target.z / Math.max(size.z, 1e-6),
      );
      group.add(instance);
      group.scale.setScalar(scale);
      group.updateMatrixWorld(true);

      // Re-measure after scaling so the offset cancels the model's own origin,
      // wherever the exporter happened to leave it.
      const scaledBox = new THREE.Box3().setFromObject(group);
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
      group.position.set(
        center[0] - scaledCenter.x,
        center[1] - scaledCenter.y,
        center[2] - scaledCenter.z,
      );

      const meshes: THREE.Mesh[] = [];
      group.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.material = (mesh.material as THREE.Material).clone();
          meshes.push(mesh);
        }
      });

      this.scene.add(group);
      this.organs.push({ id: placement.id, group, meshes });
    }
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
      const opacity = !anySelected ? 1 : isSelected ? 1 : 0.28;
      for (const mesh of organ.meshes) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.transparent = opacity < 1;
        material.opacity = opacity;
        material.depthWrite = opacity > 0.6;
        if (material.emissive) {
          material.emissive.setHex(isSelected || isHovered ? 0x2a0e08 : 0x000000);
        }
        material.needsUpdate = true;
      }
    }
    this.shellMaterial.opacity = this.selected === SHELL_ORGAN ? 0.42 : 0.17;
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
    if (organHit) {
      const found = this.organs.find((organ) => organ.meshes.includes(organHit.object as THREE.Mesh));
      if (found) return found.id;
    }
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
    const byHeight = HOME_FRAME.height / 2 / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);
    const byWidth = HOME_FRAME.width / 2 / Math.tan(hFov / 2);
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
    this.frame = requestAnimationFrame(this.animate);
    const moved = this.controls.update();
    if (moved || this.dirty) {
      this.renderer.render(this.scene, this.camera);
      this.dirty = false;
    }
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    this.controls.dispose();
    disposeObject(this.scene);
    this.shellMaterial.dispose();
    this.renderer.dispose();
    canvas.remove();
  }
}

export { BODY_HEIGHT_CM };
