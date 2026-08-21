# Third-party assets

## Body models — `public/models/{body,viscera,vessels}.glb`

Derived from the **Z-Anatomy** project:

| File | Source FBX | Contents |
| --- | --- | --- |
| `body.glb` | `Regions of human body100.fbx` | the translucent outer shell |
| `viscera.glb` | `VisceralSystem100.fbx` | oesophagus, stomach, trachea, larynx, thyroid, gallbladder and bile duct, ureters, bladder, adrenals |
| `vessels.glb` | `CardioVascular41.fbx` | the great vessels — aorta, venae cavae, pulmonary, carotid, jugular, subclavian, iliac, portal, renal, mesenteric |

- Source: https://github.com/LluisV/Z-Anatomy (`Resources/Models/FBX/`)
- Z-Anatomy's models descend from **BodyParts3D** (DBCLS, Japan)
- Licence: **CC BY-SA 4.0** — https://creativecommons.org/licenses/by-sa/4.0/

### What was changed

`scripts/build-anatomy-model.mjs` merges the separately named meshes of each
file into one geometry and quantises positions to 16-bit and normals to 8-bit.
No shape was edited. The two smaller layers are also filtered by name: the
context is there to connect the nine placed organs, so it deliberately ships
neither a second copy of them nor the structures that would hide them (the
pleura and the greater omentum drape over everything behind them).

```bash
FBX=<path-to>/Resources/Models/FBX

node scripts/build-anatomy-model.mjs "$FBX/Regions of human body100.fbx" public/models/body.glb

node scripts/build-anatomy-model.mjs "$FBX/VisceralSystem100.fbx" public/models/viscera.glb \
  --include=oesophag,stomach,trachea,larynx,epiglottis,thyroid_gland,gallbladder,bile_duct,ureter,renal_pelvis,urinary_bladder,suprarenal_gland

node scripts/build-anatomy-model.mjs "$FBX/CardioVascular41.fbx" public/models/vessels.glb \
  --exclude=intrarenal \
  --include=aorta,vena_cava,pulmonary_trunk,pulmonary_artery,pulmonary_vein,common_carotid,internal_jugular,subclavian,common_iliac,external_iliac,hepatic_portal,portal_vein,renal_artery,renal_vein,brachiocephalic,coeliac,superior_mesenteric,inferior_mesenteric
```

`--list` prints what survives the filters without writing anything, which is
how those lists were chosen.

### Share-alike

CC BY-SA 4.0 is a copyleft licence: these three files are derivative works and
must stay under CC BY-SA 4.0 wherever it is redistributed, with the attribution
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
