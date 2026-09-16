from decimal import Decimal

sales = [
    (125, "2122302.77"), (121, "1500000.00"), (120, "1531200.00"), (121, "1670000.00"),
    (121, "1611242.60"), (120, "1487357.60"), (120, "1750000.00"), (123, "1609204.06"),
    (120, "1601147.74"), (120, "1686600.60"), (123, "1600000.00"), (121, "1574678.27"),
    (125, "2228070.00"), (120, "1671995.00"), (123, "1586169.30"), (125, "1696500.00"),
    (121, "1696500.00"), (125, "1502776.55"), (125, "1650000.00"), (123, "1843395.61"),
    (120, "1569917.86"), (120, "1833717.67"), (120, "1816555.50"), (123, "1637014.95"),
    (120, "1872601.99"), (120, "1810674.12"), (120, "1793514.48"), (121, "1602250.00"),
    (120, "1843644.50"), (120, "1570000.00"), (121, "1734206.61"), (125, "1728048.73"),
]

buckets = {
    "119-126": [Decimal(value) for area, value in sales if 119 <= area <= 126],
    "150": [Decimal(value) for area, value in sales if area == 150],
    "184-188": [Decimal(value) for area, value in sales if 184 <= area <= 188],
    "+200": [Decimal(value) for area, value in sales if area > 200],
}

for name, values in buckets.items():
    if not values:
        print(f"{name}: no-data")
        continue
    average = sum(values) / len(values)
    print(f"{name}: count={len(values)} average={average.quantize(Decimal('0.01'))}")
