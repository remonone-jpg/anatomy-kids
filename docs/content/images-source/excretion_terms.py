"""Number -> Korean name for the excretory diagram.

The original is the language-neutral cut: its labels are the bare numbers 1 to
4, and the Commons page publishes no legend for them. What each one points at
was settled two ways, which agree:

  * the same illustration published with words, File:Illu_urinary_system.svg,
    reads Kidney, Ureter, Bladder, Urethra from top to bottom;
  * the leader lines drawn in this very file end at (163,106), (147,155),
    (134,254) and (129,280) on a 270x280 canvas — the second landing inside
    the thin vertical tube that runs from kidney down to bladder.
"""

TERMS = {
    "1": "콩팥",
    "2": "오줌관",
    "3": "방광",
    "4": "요도",
}

# This drawing is 270 units wide where the digestive one is 644, so it is
# scaled up about three times to fill the same panel and its labels come out
# three times the size of everybody else's. 5.6 units lands at roughly 15px on
# screen, which is what the digestive diagram's labels measure.
FONT_SIZE = 5.6

# The four labels are <tspan> children of a single <text> here, one per label —
# not one label wrapped over several lines, which is the other thing a run of
# tspans can mean.
SPLIT_TSPANS = True
