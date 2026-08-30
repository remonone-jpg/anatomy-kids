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
open(out_path, "w", encoding="utf-8").write(out)
print("교체 %d / 사전 %d" % (len(seen), len(TERMS)))
if missing:
    print("사전에 없어 남긴 라벨:", sorted(set(missing)))
