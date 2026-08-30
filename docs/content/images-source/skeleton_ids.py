"""Visible label -> id for the skeleton diagram.

Run after relabel.py has put the Korean names in. Keying by the visible word is
safe at this point where it was not before: the two "Phalanges" have become
손가락뼈 and 발가락뼈, and all twenty-eight names are distinct.
"""

IDS = {
    "머리뼈": "skull",
    "머리덮개뼈": "cranium",
    "아래턱뼈": "mandible",
    "빗장뼈": "clavicle",
    "어깨뼈": "scapula",
    "복장뼈자루": "manubrium",
    "복장뼈": "sternum",
    "갈비뼈": "ribs",
    "위팔뼈": "humerus",
    "자뼈": "ulna",
    "노뼈": "radius",
    "손목뼈": "carpals",
    "손허리뼈": "metacarpals",
    "손가락뼈": "phalanges-hand",
    "척추뼈": "spine",
    "목뼈": "cervical",
    "등뼈": "thoracic",
    "허리뼈": "lumbar",
    "엉치뼈": "sacrum",
    "꼬리뼈": "coccyx",
    "골반": "pelvis",
    "넓적다리뼈": "femur",
    "무릎뼈": "patella",
    "정강뼈": "tibia",
    "종아리뼈": "fibula",
    "발목뼈": "tarsals",
    "발허리뼈": "metatarsals",
    "발가락뼈": "phalanges-foot",
}

# Twenty-eight labels down two columns, spaced anywhere from 13 to 143 units
# apart, so each box is sized to its own neighbours rather than all of them to
# the tightest pair. `max` is where growing stops helping: 52 units is 45px
# once the panel scales this 842-tall drawing down, just past what a fingertip
# needs. `column` is how far apart two labels must be horizontally before they
# cannot collide — the two sides of this drawing are 250 units apart.
HIT = {"max": 52, "min": 12, "pad": 4, "gap": 1, "column": 80}
