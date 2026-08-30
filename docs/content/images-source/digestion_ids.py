"""Visible label -> id for the digestive diagram.

Two labels run over two lines. The halves are separate targets: 돌창자 names
one stretch of the small intestine and "(작은창자)" names the whole of it,
and the notes say different things.
"""

IDS = {
    "입안": "oral-cavity",
    "침샘": "salivary-glands",
    "귀밑샘": "parotid",
    "턱밑샘": "submandibular",
    "혀밑샘": "sublingual",
    "혀": "tongue",
    "인두": "pharynx",
    "식도": "esophagus",
    "위": "stomach",
    "간": "liver",
    "쓸개": "gallbladder",
    "이자": "pancreas",
    "샘창자": "duodenum",
    "온쓸개관": "bile-duct",
    "이자관": "pancreatic-duct",
    "돌창자": "ileum",
    # The subtitles carry their own note — 돌창자 is one part of the small
    # intestine, "(작은창자)" is the whole of it — so they get their own ids
    # rather than sharing with the line above.
    "(작은창자)": "small-intestine-note",
    "잘록창자": "colon",
    "(큰창자)": "large-intestine-note",
    "가로잘록창자": "transverse-colon",
    "오름잘록창자": "ascending-colon",
    "내림잘록창자": "descending-colon",
    "막창자": "cecum",
    "막창자꼬리": "appendix",
    "곧창자": "rectum",
    "항문": "anus",
}
