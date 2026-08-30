"""Set the label font size on a built diagram.

Usage: resize_labels.py <svg> <size>

A label's size on screen is its size in the file times however much the panel
scales the drawing to fit, and that factor differs wildly: the digestive
drawing is 644 units wide and shrinks to 0.82, the urinary one is 270 and grows
to 2.61. Left alone, the same number in two files comes out three times
different on screen, and the diagrams stop looking like one set.

Most of these are regenerated from their original by relabel.py, which takes
the size from the diagram's own terms module. The digestive one is not — it has
no terms module, having been relabelled before that pipeline existed — so it is
adjusted in place here. Only labels carrying a `data-organ` are touched;
anything else in the file keeps the size it was drawn with.
"""
import re
import sys

path, size = sys.argv[1], sys.argv[2]
svg = open(path, encoding="utf-8").read()

changed = []


def resize(m):
    tag = m.group(0)
    if "data-organ=" not in tag:
        return tag
    changed.append(re.search(r'data-organ="([^"]*)"', tag).group(1))
    if re.search(r'font-size\s*:', tag):
        return re.sub(r"font-size\s*:\s*[\d.]+(px)?", "font-size:%spx" % size, tag)
    if re.search(r'\bfont-size="', tag):
        return re.sub(r'\bfont-size="[^"]*"', 'font-size="%s"' % size, tag)
    return tag[:-1].rstrip() + ' font-size="%s">' % size


svg = re.sub(r"<text\b[^>]*>", resize, svg)
open(path, "w", encoding="utf-8").write(svg)
print("라벨 %d개의 글자 크기를 %s 단위로 맞춤" % (len(changed), size))
