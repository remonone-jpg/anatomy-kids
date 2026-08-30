"""Swap a diagram's labels for Korean, leaving the artwork and leaders alone.

Keeping every label means every leader still points at something, so nothing
has to be cut — which is what makes this cheap compared with pruning.
"""
import importlib
import re
import sys

src_path, out_path, module = sys.argv[1], sys.argv[2], sys.argv[3]
TERMS = importlib.import_module(module).TERMS

src = open(src_path, encoding="utf-8").read()
seen, missing = set(), []


def swap(m):
    attrs, body = m.group(1), m.group(2)
    plain = re.sub(r"\s+", " ", re.sub(r"<[^>]*>", "", body)).strip()
    if not plain:
        return m.group(0)
    if plain not in TERMS:
        missing.append(plain)
        return m.group(0)
    seen.add(plain)
    # Arial and friends carry no Hangul; name a stack the browser can satisfy.
    attrs = re.sub(r'font-family="[^"]*"', "", attrs)
    attrs = attrs.rstrip() + " font-family=\"'Noto Sans KR','Apple SD Gothic Neo',sans-serif\""
    return "<text" + attrs + ">" + TERMS[plain] + "</text>"


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
print("교체 %d / 사전 %d" % (len(seen), len(TERMS)))
if missing:
    print("사전에 없어 남긴 라벨:", sorted(set(missing)))
