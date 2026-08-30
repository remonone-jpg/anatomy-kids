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

# A file that gives its size only as width and height has nothing left to
# scale by once the viewer strips those — it then draws at 1:1 in the corner of
# whatever box it is given. The viewBox says the same thing in the form that
# survives.
if "viewBox" not in svg:
    box = re.search(r'<svg\b[^>]*?\bwidth="([\d.]+)"[^>]*?\bheight="([\d.]+)"', svg)
    if box:
        svg = svg[:box.end(2) + 1] + ' viewBox="0 0 %s %s"' % (box.group(1), box.group(2)) + svg[box.end(2) + 1:]
        print("viewBox 추가: 0 0 %s %s" % (box.group(1), box.group(2)))

# Excretion only: its four numbers are <tspan> children of a single <text>,
# where the other diagrams give every label a <text> of its own. The viewer
# hangs tabindex, role and aria-label on whatever node it finds, and focus on a
# <tspan> is not dependable across browsers — keyboard users would reach some
# labels and not others. Each number becomes its own <text> at the coordinates
# its tspan carried, so nothing moves on screen.
split = re.search(
    r'<text\b([^>]*)>(\s*(?:<tspan\b[^>]*>\s*\d+\s*</tspan>\s*)+)</text>', svg
)
if split:
    hit = split.group(1).rstrip()
    pieces = []
    for t in re.finditer(r'<tspan\b([^>]*)>\s*(\d+)\s*</tspan>', split.group(2)):
        x = re.search(r'\bx="([-\d.]+)"', t.group(1))
        y = re.search(r'\by="([-\d.]+)"', t.group(1))
        if not (x and y):
            continue
        pieces.append(
            '<text%s x="%s" y="%s">%s</text>' % (hit, x.group(1), y.group(1), t.group(2))
        )
    if pieces:
        svg = svg[:split.start()] + "".join(pieces) + svg[split.end():]
        print("숫자 tspan %d개를 <text> 로 분리" % len(pieces))

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


# A one-digit label is a 20x44 target, and a fingertip needs 44 square. Chrome
# hit-tests text by its glyph box, so widening the stroke does not widen where
# a tap counts — only a real shape does. Each number therefore gets an
# invisible square behind it, and the id moves to a wrapping <g> so that the
# square and the digit stay one target: two elements carrying the same id would
# mean two tab stops and the label announced twice.
#
# 22 user units on a 270-wide drawing is 57px wherever the diagram is shown
# with the stage at its full width, and the numbers sit 53 apart, so the
# squares cannot touch.
PAD = 22


widened = []


def widen(m):
    attrs, body = m.group(1), m.group(2)
    if not body.strip().isdigit():
        return m.group(0)
    x = re.search(r'\bx="([-\d.]+)"', attrs)
    y = re.search(r'\by="([-\d.]+)"', attrs)
    oid = re.search(r'\sdata-organ="([^"]*)"', attrs)
    if not (x and y and oid):
        return m.group(0)
    # x is the left edge of the digit and y its baseline; centre the square on
    # the glyph rather than on the anchor.
    left = float(x.group(1)) + 4 - PAD / 2
    top = float(y.group(1)) - 5 - PAD / 2
    widened.append(oid.group(1))
    return (
        '<g data-organ="%s">'
        '<rect x="%.2f" y="%.2f" width="%d" height="%d" fill="none" pointer-events="all" />'
        '<text%s>%s</text>'
        "</g>"
    ) % (oid.group(1), left, top, PAD, PAD, re.sub(r'\sdata-organ="[^"]*"', "", attrs), body)


svg = re.sub(r'<text\b([^>]*)>([^<]*)</text>', widen, svg)
if widened:
    print("숫자 라벨 %d개에 %d단위 투명 히트 영역을 덧댐" % (len(widened), PAD))

open(out_path, "w", encoding="utf-8").write(svg)

print("%-24s %s" % ("data-organ", "라벨"))
print("-" * 44)
for oid, label in tagged:
    print("%-24s %s" % (oid, label))
print("-" * 44)
print("붙인 것 %d개 / 고유 id %d개" % (len(tagged), len(set(i for i, _ in tagged))))
if untagged:
    print("id 없이 남긴 라벨:", untagged)
