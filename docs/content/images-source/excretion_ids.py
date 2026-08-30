"""Visible label -> id for the excretory diagram.

Run after relabel.py has put the Korean names in; the numbers the original
ships with, and what they were found to mean, are recorded in
excretion_terms.py.
"""

IDS = {
    "콩팥": "kidney",
    "오줌관": "ureter",
    "방광": "bladder",
    "요도": "urethra",
}

# Sized for a 5.6 unit label on a 270 unit canvas, which the panel scales up
# about 2.6 times: 18 units of height come out near 47px, past the 44 a
# fingertip needs, and the labels sit 53 apart so the boxes cannot touch.
HIT = {"height": 18, "pad": 3}
