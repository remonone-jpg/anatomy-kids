"""Swap a diagram's labels for Korean, leaving the artwork and leaders alone.

Keeping every label means every leader still points at something, so nothing
has to be cut — which is what makes this cheap compared with pruning.
"""
import importlib
import re
import sys

src_path, out_path, module = sys.argv[1], sys.argv[2], sys.argv[3]
terms = importlib.import_module(module)
# Most diagrams are keyed by the words on the page. Some cannot be: the
# skeleton labels two different bones "Phalanges", once in the hand and once in
# the foot, so the visible string does not identify the label. Those diagrams
# key by the id the file already carries on each <text> instead.
TERMS = getattr(terms, "TERMS", None)
TERMS_BY_ID = getattr(terms, "TERMS_BY_ID", None)
if not (TERMS or TERMS_BY_ID):
    raise SystemExit("%s 에 TERMS 나 TERMS_BY_ID 가 없습니다" % module)
# A label's size on screen is its size here times however much the drawing is
# scaled to fill the panel, and that factor differs wildly between diagrams —
# the circulatory drawing is 550 units wide and shrinks, the urinary one is 270
# and nearly triples. A diagram whose scaling makes its labels the wrong size
# beside the others says so here, in its own units.
FONT_SIZE = getattr(terms, "FONT_SIZE", None)
# Whether this diagram keeps each label in its own <tspan>. Asked for rather
# than detected: a run of tspans is just as likely to be one label wrapped over
# two lines — the circulatory drawing holds "Palmar digital v." that way — and
# splitting those leaves two halves that match nothing.
SPLIT_TSPANS = getattr(terms, "SPLIT_TSPANS", False)

src = open(src_path, encoding="utf-8").read()
seen, missing = set(), []

# A file that gives its size only as width and height has nothing left to scale
# by once the viewer strips those — it then draws at 1:1 in the corner of
# whatever box it is given. The viewBox says the same thing in the form that
# survives.
box = re.search(r'<svg\b[^>]*?\bwidth="([\d.]+)"[^>]*?\bheight="([\d.]+)"', src)
if "viewBox" not in src and box:
    src = src[:box.end(2) + 1] + ' viewBox="0 0 %s %s"' % (box.group(1), box.group(2)) + src[box.end(2) + 1:]
    print("viewBox 추가: 0 0 %s %s" % (box.group(1), box.group(2)))

# Some drawings keep every label in one <text> as a run of <tspan> children.
# The viewer hangs tabindex, role and aria-label on whatever node carries the
# id, and focus on a <tspan> is not dependable across browsers, so each label
# becomes its own <text> at the coordinates its tspan carried. Nothing moves.
split = re.search(r'<text\b([^>]*)>(\s*(?:<tspan\b[^>]*>[^<]*</tspan>\s*){2,})</text>', src) if SPLIT_TSPANS else None
if split:
    shared, pieces = split.group(1).rstrip(), []
    for t in re.finditer(r'<tspan\b([^>]*)>([^<]*)</tspan>', split.group(2)):
        x = re.search(r'\bx="([-\d.]+)"', t.group(1))
        y = re.search(r'\by="([-\d.]+)"', t.group(1))
        if x and y and t.group(2).strip():
            pieces.append(
                '<text%s x="%s" y="%s">%s</text>' % (shared, x.group(1), y.group(1), t.group(2).strip())
            )
    if pieces:
        src = src[:split.start()] + "".join(pieces) + src[split.end():]
        print("tspan %d개를 <text> 로 분리" % len(pieces))


def restyle(attrs):
    """Point the label at a Hangul font, and resize it if the module asked.

    Both settings have to go into the style attribute rather than beside it: a
    style declaration beats the matching presentation attribute however the
    attribute is written, so a font-family left in there would keep winning.
    """
    attrs = re.sub(r'\sfont-family="[^"]*"', "", attrs)
    attrs = re.sub(r'\sfont-size="[^"]*"', "", attrs)
    css = re.search(r'style="([^"]*)"', attrs)
    props = ["font-family", "-inkscape-font-specification"]
    if FONT_SIZE:
        props.append("font-size")
    drop = r"\s*(%s)\s*:" % "|".join(props)
    add = "font-family:'Noto Sans KR','Apple SD Gothic Neo',sans-serif"
    if FONT_SIZE:
        add += ";font-size:%spx" % FONT_SIZE
    if css:
        kept = [d for d in css.group(1).split(";") if d.strip() and not re.match(drop, d)]
        return attrs[:css.start(1)] + ";".join(kept) + ";" + add + attrs[css.end(1):]
    return attrs.rstrip() + ' style="%s"' % add


def swap(m):
    attrs, body = m.group(1), m.group(2)
    plain = re.sub(r"\s+", " ", re.sub(r"<[^>]*>", "", body)).strip()
    if not plain:
        return m.group(0)
    if TERMS_BY_ID is not None:
        eid = re.search(r'\bid="([^"]*)"', attrs)
        key = eid.group(1) if eid else None
        table = TERMS_BY_ID
    else:
        key, table = plain, TERMS
    if key not in table:
        missing.append("%s (%s)" % (plain, key) if key != plain else plain)
        return m.group(0)
    seen.add(key)
    # Replacing the whole body drops any <tspan> the label was split over,
    # which is what we want: the Korean names are one word where the English
    # ran to two lines.
    return "<text" + restyle(attrs) + ">" + table[key] + "</text>"


out = re.sub(r"<text\b([^>]*)>(.*?)</text>", swap, src, flags=re.S)


def layer(text, label):
    """Span of the Inkscape layer named `label`, as (open_start, open_end, close_end)."""
    m = re.search(r'<g\b[^>]*inkscape:label="%s"[^>]*>' % re.escape(label), text)
    if not m:
        return None
    depth = 1
    for t in re.finditer(r"<(/?)g\b[^>]*?(/?)>", text[m.end():]):
        if t.group(2) == "/":      # <g … /> opens and closes at once
            continue
        depth += -1 if t.group(1) else 1
        if depth == 0:
            return m.start(), m.end(), m.end() + t.end()
    return None


# Some of these drawings carry their labels twice: an editable "Text" layer,
# which Inkscape hides, and a "Text to path" layer holding the same words baked
# into outlines, which is the one that actually paints. Swapping the <text>
# above therefore changes nothing on screen — and, because the click targets
# ride on those <text> elements, leaves the labels unclickable as well. Show the
# layer we edited and drop the baked copy, which is now the wrong language.
baked = layer(out, "Text to path")
if baked:
    out = out[:baked[0]] + out[baked[2]:]
    print("'Text to path' 레이어 삭제 (%,d자)".replace(",", "") % (baked[2] - baked[0]))

editable = layer(out, "Text")
if editable:
    head = out[editable[0]:editable[1]]
    shown = re.sub(r"display\s*:\s*none", "display:inline", head)
    if "display" not in shown:
        shown = shown[:-1] + ' style="display:inline">'
    out = out[:editable[0]] + shown + out[editable[1]:]
    print("'Text' 레이어 표시")

open(out_path, "w", encoding="utf-8").write(out)
print("교체 %d / 사전 %d" % (len(seen), len(TERMS_BY_ID or TERMS)))
if missing:
    print("사전에 없어 남긴 라벨:", sorted(set(missing)))
