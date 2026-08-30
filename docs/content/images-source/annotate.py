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
open(out_path, "w", encoding="utf-8").write(svg)

print("%-24s %s" % ("data-organ", "라벨"))
print("-" * 44)
for oid, label in tagged:
    print("%-24s %s" % (oid, label))
print("-" * 44)
print("붙인 것 %d개 / 고유 id %d개" % (len(tagged), len(set(i for i, _ in tagged))))
if untagged:
    print("id 없이 남긴 라벨:", untagged)
