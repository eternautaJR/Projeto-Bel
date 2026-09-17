#!/usr/bin/env python3
import re
from decimal import Decimal
from pathlib import Path

source = Path("client/src/App.tsx").read_text(encoding="utf-8")
block = source.split("const mudraSales: SaleRow[] = [", 1)[1].split("];", 1)[0]
rows = []
pattern = re.compile(r'value: "R\$ ([\d.]+,\d{2})"[^\n]*area: "(\d+) m²"')
for value_text, area_text in pattern.findall(block):
    value = Decimal(value_text.replace(".", "").replace(",", "."))
    rows.append((value, int(area_text)))

ranges = [
    ("78–80 m²", 78, 80),
    ("91–106 m²", 91, 106),
    ("199 m²", 199, 199),
]

print(f"total={len(rows)}")
for label, minimum, maximum in ranges:
    values = [value for value, area in rows if minimum <= area <= maximum]
    if not values:
        print(f"{label}\t0\tSem dados recentes")
        continue
    average = sum(values) / len(values)
    formatted = f"{average:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    print(f"{label}\t{len(values)}\tR$ {formatted}")
