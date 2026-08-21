# Third-party assets

## Body surface model — `public/models/body.glb`

Derived from the **Z-Anatomy** project's `Regions of human body100.fbx`.

- Source: https://github.com/LluisV/Z-Anatomy (`Resources/Models/FBX/`)
- Z-Anatomy's models descend from **BodyParts3D** (DBCLS, Japan)
- Licence: **CC BY-SA 4.0** — https://creativecommons.org/licenses/by-sa/4.0/

### What was changed

`scripts/build-body-model.mjs` merges the 301 separate body-region meshes into
one geometry and quantises positions to 16-bit and normals to 8-bit. No shape
was edited. To rebuild it:

```bash
node scripts/build-body-model.mjs <path-to>/Regions\ of\ human\ body100.fbx public/models/body.glb
```

### Share-alike

CC BY-SA 4.0 is a copyleft licence: `body.glb` is a derivative work and must
stay under CC BY-SA 4.0 wherever it is redistributed, with the attribution
above kept intact. It does not place the rest of this repository under that
licence, but it does travel with any copy of the file.

### Organ placement

The boxes in `app/lib/body-placement.ts` are bounding-box measurements taken
from the same Z-Anatomy release (`VisceralSystem100.fbx` and
`NervousSystem100.fbx`). They are factual measurements rather than copied
geometry, and they are what puts each organ where it belongs.

## Organ models — `public/models/{heart,brain,...}.glb`

Shipped with the upstream `thebuggeddev/anatomy` repository; generated with
Tripo. Not modified here — they are scaled and positioned at runtime.
