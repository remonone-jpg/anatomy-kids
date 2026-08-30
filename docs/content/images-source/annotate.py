"""Give a diagram's labels stable ids so the UI can hang data off them.

Usage: annotate.py <in.svg> <out.svg> <term-module>
The module supplies IDS, a map from the visible label to the id the notes use.

Matching on the visible string would break the first time a word is reworded.
Where a label runs over two lines the two halves are still separate targets:
"돌창자" names one stretch of the small intestine and "(작은창자)" names the
whole of it, and the notes say different things.
"""
import importlib
import re
import sys

src_path, out_path, module = sys.argv[1], sys.argv[2], sys.argv[3]
IDS = importlib.import_module(module).IDS

# Visible text -> id. Two entries may share an id; that is the split-label case.
svg = open(src_path, encoding="utf-8").read()

# Digestion only: the original pairs "돌창자" with a smaller "(작은창자)" beneath
# it but leaves "잘록창자" bare. Our organ list calls that part 큰창자, so without
# a subtitle a reader has to guess the two are the same thing. Placed on the
# same line rather than below: the three sub-colons start only 26 units down.
if "잘록창자" in svg and "(큰창자)" not in svg:
    m = re.search(r'<text\b([^>]*)>잘록창자</text>', svg)
    attrs = m.group(1)
    x = float(re.search(r'\bx="([-\d.]+)"', attrs).group(1))
    y = float(re.search(r'\by="([-\d.]+)"', attrs).group(1))
    fill = re.search(r'fill="([^"]*)"', attrs).group(1)
    sub = (
        '<text x="%.4f" y="%.4f" fill="%s" '
        'font-family="\'Noto Sans KR\',\'Apple SD Gothic Neo\',sans-serif" '
        'font-size="14" font-weight="400" style="line-height:0%%">(큰창자)</text>'
    ) % (x + 76, y, fill)
    svg = svg[:m.end()] + sub + svg[m.end():]

tagged, untagged = [], []


def annotate(m):
    attrs, body = m.group(1), m.group(2)
    plain = body.strip()
    if plain not in IDS:
        if plain:
            untagged.append(plain)
        return m.group(0)
    tagged.append((IDS[plain], plain))
    attrs = re.sub(r'\sdata-organ="[^"]*"', "", attrs)
    return '<text' + attrs + ' data-organ="' + IDS[plain] + '">' + body + '</text>'


svg = re.sub(r'<text\b([^>]*)>([^<]*)</text>', annotate, svg)


# Chrome hit-tests text by its glyph box, so a label only as tall as its
# letters is only that tall to a fingertip — 15px where 44 is the minimum. A
# transparent stroke does not help; hit-testing ignores it. Only a real shape
# does, so the label gets an invisible rectangle behind it, sized to the words
# and padded out to a reachable height.
#
# The id moves onto a wrapping <g> so the rectangle and the words stay one
# target. Two elements carrying the same id would be two tab stops, and the
# label read out twice.
#
# Diagrams whose labels are already comfortable say nothing and are left alone.
HIT = getattr(importlib.import_module(module), "HIT", None)
widened = []

# How tall each label's box may be. A fixed height suits a diagram whose labels
# are evenly spaced; where they are not — the skeleton's sit anywhere from 13
# to 143 units apart — one height for all of them is set by the tightest pair
# and robs every other label. So each is given the most room its own
# neighbours leave, capped at the point where more stops helping.
heights = {}
if HIT and "height" not in HIT:
    placed = []
    for m in re.finditer(r'<text\b([^>]*)>([^<]*)</text>', svg):
        oid = re.search(r'\sdata-organ="([^"]*)"', m.group(1))
        x = re.search(r'\bx="([-\d.]+)"', m.group(1))
        y = re.search(r'\by="([-\d.]+)"', m.group(1))
        if oid and x and y:
            placed.append((oid.group(1), float(x.group(1)), float(y.group(1))))
    for oid, x, y in placed:
        # Only labels in the same column can collide; the two sides of the
        # drawing are hundreds of units apart.
        column = [p for p in placed if p[0] != oid and abs(p[1] - x) < HIT["column"]]
        gaps = [abs(p[2] - y) for p in column]
        # Two boxes centred d apart, each of height h, meet when h reaches d.
        # Taking h a little under the nearest gap therefore keeps every pair
        # apart, whichever of the two is the shorter.
        room = HIT["max"] if not gaps else min(HIT["max"], min(gaps) - HIT["gap"])
        heights[oid] = max(HIT["min"], round(room, 2))


def widen(m):
    attrs, body = m.group(1), m.group(2)
    oid = re.search(r'\sdata-organ="([^"]*)"', attrs)
    x = re.search(r'\bx="([-\d.]+)"', attrs)
    y = re.search(r'\by="([-\d.]+)"', attrs)
    if not (oid and x and y and body.strip()):
        return m.group(0)
    size = re.search(r"font-size\s*:\s*([\d.]+)", attrs)
    height = HIT["height"] if "height" in HIT else heights[oid.group(1)]
    em = float(size.group(1)) if size else height
    # Hangul is full-width, so a word is about as wide as its letter count.
    width = max(len(body.strip()) * em + 2 * HIT["pad"], height)
    # x is the left edge and y the baseline; letters sit roughly 0.35em above it.
    left = float(x.group(1)) - HIT["pad"]
    top = float(y.group(1)) - 0.35 * em - height / 2
    widened.append(oid.group(1))
    return (
        '<g data-organ="%s">'
        '<rect x="%.2f" y="%.2f" width="%.2f" height="%.2f" fill="none" pointer-events="all" />'
        "<text%s>%s</text>"
        "</g>"
    ) % (
        oid.group(1), left, top, width, height,
        re.sub(r'\sdata-organ="[^"]*"', "", attrs), body,
    )


if HIT:
    svg = re.sub(r'<text\b([^>]*)>([^<]*)</text>', widen, svg)
    if "height" in HIT:
        print("라벨 %d개에 투명 히트 영역을 덧댐 (높이 %s단위)" % (len(widened), HIT["height"]))
    else:
        sizes = sorted(heights.values())
        print("라벨 %d개에 투명 히트 영역을 덧댐 (높이 %.1f~%.1f단위, 이웃 간격에 맞춤)"
              % (len(widened), sizes[0], sizes[-1]))

open(out_path, "w", encoding="utf-8").write(svg)

print("%-24s %s" % ("data-organ", "라벨"))
print("-" * 44)
for oid, label in tagged:
    print("%-24s %s" % (oid, label))
print("-" * 44)
print("붙인 것 %d개 / 고유 id %d개" % (len(tagged), len(set(i for i, _ in tagged))))
if untagged:
    print("id 없이 남긴 라벨:", untagged)
