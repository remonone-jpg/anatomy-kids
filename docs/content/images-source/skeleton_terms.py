"""Label id -> Korean name for the skeleton diagram.

Keyed by id rather than by the visible word, because the visible word does not
identify the label here: two of them read "Phalanges", one in the hand and one
in the foot. The file already carries a meaningful id on every label, so there
is nothing to guess.

The roman numerals the original spells out — Cervical Vertebrae (I-VII),
Thoracic (T I - T XII), Lumbar (L I - L V) — are dropped. They tell a reader
how many bones are in each stretch of spine, which is past what this screen is
for, and they were the reason those three labels ran over two lines.
"""

TERMS_BY_ID = {
    # Head
    "l_Skull": "머리뼈",
    "l_Cranium": "머리덮개뼈",
    "l_Mandible": "아래턱뼈",
    # Shoulder and chest
    "l_Clavicle": "빗장뼈",
    "l_Scapula": "어깨뼈",
    "l_Manubrium": "복장뼈자루",
    "l_Sternum": "복장뼈",
    "l_Ribs": "갈비뼈",
    # Arm
    "l_Humerus": "위팔뼈",
    "l_Ulna": "자뼈",
    "l_Radius": "노뼈",
    "l_Carpals": "손목뼈",
    "l_Metacarpals": "손허리뼈",
    "l_Phalanges": "손가락뼈",
    # Spine, listed down the left of the drawing
    "l_Spinal_Column": "척추뼈",
    "l_Cervicle_Vertebrae": "목뼈",
    "l_Thoracic_Vertebrae": "등뼈",
    "l_Lumbar_Vertebrae": "허리뼈",
    "l_Sacrum": "엉치뼈",
    "l_Coccyx": "꼬리뼈",
    # Pelvis and leg
    "l_Pelvic_Girdle": "골반",
    "l_Femur": "넓적다리뼈",
    "l_Patella": "무릎뼈",
    "l_Tibia": "정강뼈",
    "l_Fibula": "종아리뼈",
    "l_Tarsals": "발목뼈",
    "l_Metatarsals": "발허리뼈",
    "l_PhalangesFoot": "발가락뼈",
}

# The original sets 11 units, which comes out at 9.5px once the panel scales
# this 842-tall drawing down to fit — small for Hangul. 12 is as far as it can
# go: the closest pair of labels, 자뼈 and 노뼈, sit 13.3 units apart.
FONT_SIZE = 12
