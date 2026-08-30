"""Label id -> Korean name for the respiratory diagram.

Keyed by id, because the visible word does not identify the label: four of them
appear twice, once on each lung — Superior lobe, Inferior lobe, Oblique fissure
— and one more, Middle lobe, has a partner only on the right.

The ids are Inkscape's own numbering and say nothing, so each is commented with
what it labels and where it sits on the 907x966 canvas.

The original is a multilingual Commons file: every label is a <switch> holding
a Kurdish, Persian, Central Kurdish and English branch, and a browser picks by
its own locale. relabel.py unwraps those, keeping the English fallback and
dropping the rest, so one file says the same thing to every reader.
"""

TERMS_BY_ID = {
    # ── Nose, pharynx, larynx ─────────────────────────────────────────────
    "trsvg420": "코",             # Nose                     x60  y137
    "trsvg232": "코안",           # Nasal cavity             x65  y158
    "trsvg424": "코선반",         # Nasal conchae            x64  y180
    "trsvg236": "코안뜰",         # Nasal vestibule          x65  y201
    "trsvg428": "코곁굴",         # Paranasal sinuses        x174 y53
    "trsvg224": "이마굴",         # Frontal                  x137 y75
    "trsvg228": "나비굴",         # Sphenoid                 x265 y75
    "trsvg244": "인두",           # Pharynx                  x67  y243
    "trsvg388": "후두",           # Larynx                   x60  y277
    "trsvg248": "후두덮개",       # Epiglottis               x64  y301
    "trsvg256": "방패연골",       # Thyroid cartilage        x65  y325
    "trsvg364": "반지연골",       # Cricoid cartilage        x65  y349
    "trsvg252": "성대주름",       # Vocal folds              x64  y384
    "trsvg240": "입안",           # Oral (+ cavity)          x298 y323
    "trsvg416": "식도",           # Esophagus                x297 y360
    # ── Trachea and bronchi ───────────────────────────────────────────────
    "trsvg260": "기관",           # Trachea                  x61  y409
    "trsvg336": "기관갈림",       # Carina of trachea        x64  y432
    "trsvg340": "주기관지",       # Main bronchi             x64  y468
    "trsvg400": "엽기관지",       # Lobar bronchus           x267 y931
    "trsvg332": "혀구역 기관지",  # Lingular division bronchi x64 y509
    "trsvg384": "기관·기관지 연골고리",  # Tracheal and bronchi (+ rings) x447 y456
    "trsvg404": "위엽 기관지",    # Superior  — branch of the lobar bronchus, not a lobe
    "trsvg408": "중간엽 기관지",  # Middle
    "trsvg412": "아래엽 기관지",  # Inferior
    # ── Lungs ─────────────────────────────────────────────────────────────
    "trsvg396": "오른허파",       # Right lung               x23  y555
    "trsvg392": "왼허파",         # Left lung                x500 y547
    "trsvg268": "오른위엽",       # Superior lobe, right     x31  y580
    "trsvg328": "왼위엽",         # Superior lobe, left      x500 y573
    "trsvg280": "오른중간엽",     # Middle lobe              x31  y663
    "trsvg284": "오른아래엽",     # Inferior lobe, right     x30  y690
    "trsvg356": "왼아래엽",       # Inferior lobe, left      x501 y698
    "trsvg272": "수평틈새",       # Horizontal fissure       x32  y609
    "trsvg276": "오른빗틈새",     # Oblique fissure, right   x31  y634
    "trsvg344": "왼빗틈새",       # Oblique fissure, left    x502 y623
    "trsvg348": "심장패임",       # Cardiac notch            x501 y649
    "trsvg352": "허파혀",         # Lingula of lung          x501 y672
    "trsvg368": "왼허파꼭대기",   # Apex of left lung        x502 y597
    "trsvg288": "가로막",         # Diaphragm                x31  y798
    # ── The alveolar inset, top right ─────────────────────────────────────
    "trsvg360": "모세혈관그물",   # Capilllary beds — the extra l is the original's
    "trsvg436": "결합조직",       # Connective (+ tissue)    x388 y84
    "trsvg308": "허파꽈리주머니", # Alveolar (+ sacs)        x388 y138
    "trsvg376": "허파꽈리관",     # Alveolar (+ duct)        x388 y187
    "trsvg380": "점액샘",         # Mucous (+ gland)         x387 y232
    "trsvg304": "점막",           # Mucosal (+ lining)       x387 y277
    "trsvg312": "허파동맥",       # Pulmonary artery         x476 y350
    "trsvg316": "허파정맥",       # Pulmonary vein           x456 y373
    "trsvg320": "허파꽈리",       # Alveoli                  x646 y354
    "trsvg324": "허파꽈리방",     # Atrium — of the alveolus, not of the heart
}

# One <switch> is lifted out and kept whole; every label becomes a plain <text>
# like the other three diagrams.
UNWRAP_SWITCH = True

# Seven labels the original sets over two lines. The first id keeps the whole
# phrase and the second is removed — left in, it would be a target reading
# "sacs" or "rings" with nothing to say.
MERGE = [
    ("trsvg436", "trsvg292"),   # Connective / tissue
    ("trsvg308", "trsvg372"),   # Alveolar / sacs
    ("trsvg376", "trsvg296"),   # Alveolar / duct
    ("trsvg380", "trsvg300"),   # Mucous / gland
    ("trsvg304", "trsvg440"),   # Mucosal / lining
    ("trsvg240", "trsvg432"),   # Oral / cavity
    ("trsvg384", "trsvg264"),   # Tracheal and bronchi / rings
]

# This drawing is 907 units wide, the widest of the four, so the panel shrinks
# it more than the others. 15 units lands near the 10.4-11.1px the rest sit at.
FONT_SIZE = 15
