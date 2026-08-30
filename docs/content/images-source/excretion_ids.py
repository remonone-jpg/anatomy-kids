"""Visible label -> id for the excretory diagram.

The labels here are bare numbers, because the original is the "language
neutral" cut of the drawing: the numbers carry no meaning on their own and
the Commons page publishes no legend for them.

What each number points at was settled two ways, which agree:

  * the same illustration published with words, File:Illu_urinary_system.svg,
    reads Kidney, Ureter, Bladder, Urethra from top to bottom;
  * the leader lines drawn in this very file end at (163,106), (147,155),
    (134,254) and (129,280) on a 270x280 canvas — the second landing inside
    the thin vertical tube that runs from kidney to bladder.

Numbers are also why the ids matter more here than elsewhere. "1" says
nothing about what it labels, so the id is the only readable link between the
drawing and the notes.
"""

IDS = {
    "1": "kidney",
    "2": "ureter",
    "3": "bladder",
    "4": "urethra",
}
