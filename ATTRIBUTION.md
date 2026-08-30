# Third-party assets

## Body models — `public/models/{body,viscera,vessels}.glb`

Derived from the **Z-Anatomy** project:

| File | Source FBX | Contents |
| --- | --- | --- |
| `body.glb` | `Regions of human body100.fbx` | the translucent outer shell |
| `viscera.glb` | `VisceralSystem100.fbx` | oesophagus, stomach, trachea, larynx, thyroid, gallbladder and bile duct, ureters, bladder, adrenals |
| `vessels.glb` | `CardioVascular41.fbx` | the great vessels — aorta, venae cavae, pulmonary, carotid, jugular, subclavian, iliac, portal, renal, mesenteric |
| `atlas/*.glb` | `VisceralSystem100.fbx`, `CardioVascular41.fbx`, `NervousSystem100.fbx` | the eight organs shown inside the body: brain, eyeballs, lungs, heart, liver, pancreas, kidneys, intestine |

Everything above comes from one segmentation of one body, so the parts are
already joined to each other and already share a coordinate space. That is the
whole reason the body view uses them: the organ models in `public/models/*.glb`
were each generated separately, and no amount of positioning makes their stumps
meet.

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

### Rebuilding the organ set

```bash
node scripts/build-anatomy-model.mjs "$FBX/CardioVascular41.fbx"   public/models/atlas/heart.glb     --include=heart,ventricle,atrium,myocard,pericard,cardiac,coronary
node scripts/build-anatomy-model.mjs "$FBX/VisceralSystem100.fbx"  public/models/atlas/lungs.glb     --include=lung,bronch
node scripts/build-anatomy-model.mjs "$FBX/VisceralSystem100.fbx"  public/models/atlas/liver.glb     --include=liver
node scripts/build-anatomy-model.mjs "$FBX/VisceralSystem100.fbx"  public/models/atlas/kidneys.glb   --include=kidney
node scripts/build-anatomy-model.mjs "$FBX/VisceralSystem100.fbx"  public/models/atlas/pancreas.glb  --include=pancrea
node scripts/build-anatomy-model.mjs "$FBX/VisceralSystem100.fbx"  public/models/atlas/intestine.glb --exclude=omentum --include=intestin,colon,cecum,caecum,ileum,jejunum,duoden,rectum,appendix,taenia,mesocolon,mesenter
node scripts/build-anatomy-model.mjs "$FBX/NervousSystem100.fbx"   public/models/atlas/brain.glb     --include=cerebrum,cerebral_hemisphere,cerebellum,frontal_lobe,parietal_lobe,temporal_lobe,occipital_lobe,brainstem,midbrain,pons,medulla_oblongata,corpus_callosum,gyrus,sulcus
node scripts/build-anatomy-model.mjs "$FBX/NervousSystem100.fbx"   public/models/atlas/eyeball.glb   --include=eyeball,bulbus_oculi
```

### The stomach, and why it is built differently

```bash
# Geometry. The label anchors are excluded, and the cutaway window is capped.
node scripts/build-anatomy-model.mjs "$FBX/VisceralSystem100.fbx" public/models/atlas/stomach.glb \
  --color=#d98a5c --fill-holes=0.20 --include=stomach --exclude=stomachj,mucosa

# Hotspot coordinates, from the same filter plus the four label anchors. The
# bounding box has to match the geometry build or the positions land elsewhere.
node scripts/build-anatomy-model.mjs "$FBX/VisceralSystem100.fbx" /tmp/anchors.glb --parts \
  --fill-holes=0.20 --include=stomach,cardiaj,fundus_of_stomachj,body_of_stomachj,pyloric_partj \
  --exclude=greater_curvature,lesser_curvature,anterior_wall,posterior_wall,mucosa
```

**The `--fill-holes` is not optional here, and rebuilding without it produces a
stomach with a hole in its front wall.** Z-Anatomy's `Stomach` is an open
surface with three boundary loops. Two of them are the anatomy — the stomach is
a tube, open where the oesophagus arrives and where the duodenum leaves, and
sealing those would be wrong. The third is a 7 cm cutaway window in the
anterior wall, there for the atlas to show `Mucosa_of_stomach` through; that
object exists in this file but carries no geometry, so the window renders as a
hole. `--fill-holes=0.20` caps loops wider than a fifth of the mesh's diagonal,
which is the window and neither opening.

`--exclude=stomachj` drops the `j`-suffixed label anchors from the geometry.
They are markers, not anatomy, and merging them leaves stray facets on the
organ. They are still read in the second pass, where only their centres matter.

The viewer renders front faces only (`loaders.ts`), so the cap has to be wound
to face outwards; the script checks it against the surrounding surface normal.

The filters are chosen so the sets do not overlap: `viscera.glb` carries the
trachea while `atlas/lungs.glb` carries the bronchi below it, `viscera.glb`
carries the stomach while `atlas/intestine.glb` starts at the duodenum. Colours
are applied at runtime in `body-viewer.ts` — the source meshes are untextured.

## System diagrams — `public/anatomy/systems/`

Illustrations for the school layer's organ-system pages, all from Wikimedia
Commons and all in the public domain. Originals and the relabelling script are
kept in `docs/content/images-source/` so these can be rebuilt.

| File | Source | Author | Licence | Changes made |
|---|---|---|---|---|
| `digestion.svg` | [Digestive system diagram edit.svg](https://commons.wikimedia.org/wiki/File:Digestive_system_diagram_edit.svg) | Mariana Ruiz, edited by Joaquim Alves Gaspar, Jmarchn | Public domain | **All 26 labels replaced with Korean**; **a subtitle "(큰창자)" added** beside 잘록창자, which the original does not have; `data-organ` attributes added to every label. Artwork and leader lines untouched. |
| `circulation-ko.svg` | [Circulatory System en.svg](https://commons.wikimedia.org/wiki/File:Circulatory_System_en.svg) | LadyofHats, Mariana Ruiz Villarreal | Public domain | **All 51 labels replaced with Korean**; `data-organ` attributes added to every label; **the "Text to path" layer deleted and the "Text" layer un-hidden** — the original carries its labels twice, and the baked-in outline copy was the one that painted. Artwork and leader lines untouched. The `-ko` suffix keeps the relabelled file from ever being confused with the English original. |
| `movement.svg` | [Human skeleton front en.svg](https://commons.wikimedia.org/wiki/File:Human_skeleton_front_en.svg) | LadyofHats, Mariana Ruiz Villarreal | Public domain | **All 28 labels replaced with Korean**; the roman numerals in the three vertebrae labels dropped, which also brought each onto one line; font set to the Hangul stack at 12 units — as far as it can grow before 자뼈 and 노뼈, 13.3 units apart, would meet; `data-organ` attributes added, each label wrapped in a `<g>` with an invisible box sized to its own neighbours. Artwork, leader lines and the grouping bars untouched. **Replaces the unlabelled edition by Mikael Häggström** used until now, which was this same drawing with the labels removed; the artwork is identical, 906 of 906 paths matching. |
| `excretion.svg` | [Illu urinary system numbers.svg](https://commons.wikimedia.org/wiki/File:Illu_urinary_system_numbers.svg) | Unknown (US federal government work); SVG by Luigi Chiesa | Public domain | **The four numbers replaced with Korean names** — 콩팥, 오줌관, 방광, 요도. The original is the language-neutral cut and publishes no legend, so what each number meant was established from the labelled edition of the same drawing and from the leader lines in the file itself; both are recorded in `excretion_terms.py`. The numbers, which the original holds as `<tspan>` children of one `<text>`, split into a `<text>` each at the same coordinates; **a `viewBox` added**, absent in the original, without which the drawing will not scale; font set to the Hangul stack at 5.6 units so the labels match the other diagrams on screen; `data-organ` attributes added, each label wrapped in a `<g>` with an invisible box so a fingertip can hit it. Artwork and leader lines untouched. |

Public domain carries no legal obligation to credit, but these are somebody's
work and the table is the least that is owed.

### Colours changed at display time

Three of the original colours are overridden by the stylesheet when a diagram
is shown. The files themselves are not edited — open any of them outside this
app and the original colours are what you get — but what a reader sees here is
not what the author drew, and that is worth stating.

| What | Original | Shown as | Why |
|---|---|---|---|
| The skeleton's two group bars, beside 머리뼈 and 척추뼈 | `#dff3f4` | `--lavender` at 22% | At its published tint the bar is invisible against a cream page, so the grouping it exists to show does not read. |
| Labels that hold other labels — 머리뼈, 척추뼈, 침샘, 잘록창자 | plain text | bold, with a pale halo behind the letters | Marks them as headings before anything is clicked, so a reader can tell the drawing names three bones and their parts rather than eight separate bones. |
| The label being read, and the labels it contains | plain text | `--coral`, and `--lavender` for the parts | Shows which labels the open note is talking about. |

Nothing is moved, removed or redrawn; only these fills change.

### Relabelling

```bash
# Terms live beside the script, one module per diagram.
python3 docs/content/images-source/relabel.py \
  docs/content/images-source/Circulatory_System_en.svg \
  public/anatomy/systems/circulation-ko.svg circ_terms

# The excretory diagram runs the same two steps; its "translation" turns the
# numbers 1-4 into the names they were found to stand for.
python3 docs/content/images-source/relabel.py \
  docs/content/images-source/Illu_urinary_system_numbers.svg \
  /tmp/excretion-ko.svg excretion_terms
python3 docs/content/images-source/annotate.py \
  /tmp/excretion-ko.svg \
  public/anatomy/systems/excretion.svg excretion_ids

# The skeleton is keyed by each label's own id, not by the words on it: two of
# them read "Phalanges", once in the hand and once in the foot.
python3 docs/content/images-source/relabel.py \
  docs/content/images-source/Human_skeleton_front_en.svg \
  /tmp/skeleton-ko.svg skeleton_terms
python3 docs/content/images-source/annotate.py \
  /tmp/skeleton-ko.svg \
  public/anatomy/systems/movement.svg skeleton_ids
```

Every label is kept and translated rather than removed. Dropping labels means
also finding and cutting the lines that pointed at them, which costs an order
of magnitude more work and risks cutting a line that was still needed.

`annotate.py` then stamps each label with a `data-organ` id, which is what the
viewer hangs its notes on. Matching on the visible string instead would break
the first time a word is reworded.

The one addition to the artwork is the subtitle **"(큰창자)"** next to 잘록창자.
The original pairs 돌창자 with a smaller "(작은창자)" but leaves 잘록창자 bare,
and the organ list calls that part 큰창자 — without the subtitle a reader has
no way to see the two are the same thing. It sits on the same line rather than
below because the three sub-colons start only 26 units down.

## Organ models — `public/models/{heart,brain,...}.glb`

Shipped with the upstream `thebuggeddev/anatomy` repository; generated with
Tripo. Not modified here. They are what the single-organ viewer shows.

## Organ illustrations — `public/anatomy/{organ}/*.webp` — ⚠ needs checking

Forty-five images: nine organs — brain, eyeball, heart, intestine, kidneys,
liver, lungs, pancreas, skin — each with `location`, `thumb`, `organ`,
`microscopic` and `compare`. All 720×720. They are most of what the organ
pages show, including the "몸속의 {organ}" panel.

**Where they come from is not established, and this entry records only what
was verified.**

What is known:

| | |
|---|---|
| Added by | `thebuggeddev`, in commits `0fc4ad7` (30 files) and `758b397` (15 files) |
| Added on | 2026-08-02, the day this project's history begins |
| Came from | the upstream repository this one is forked from, `github.com/thebuggeddev/anatomy` |
| Licence stated there | **none** — that repository declares no licence on GitHub and carries no `LICENSE`, `ATTRIBUTION`, `CREDITS` or `NOTICE` file at any commit its author made |
| Licence stated here | none, until this entry |
| Metadata in the files | none — no Exif, XMP, ICC or copyright field in any of them |

What is not known:

- **Whether the upstream author drew them or took them from somewhere else.**
  Nothing in the files, the commit messages, or the repository says. Both
  possibilities are open, and no evidence here favours either.
- Consequently, who holds copyright, and on what terms these may be used.

Why this matters: an absent licence is not permission. If the upstream author
made them, using them in a fork is a question to put to that author. If they
came from elsewhere, there is a third party whose name is missing from this
file. The two lead to different obligations, and until it is known which
applies, neither can be discharged.

This differs from every other asset listed above, each of which names its
source and its licence — the Z-Anatomy meshes are CC BY-SA, the Commons
diagrams are public domain. These images alone have neither.

Ways to settle it, none of them taken yet: ask the upstream author directly —
the repository is public and accepts issues — or run a reverse image search on
one of the files.
