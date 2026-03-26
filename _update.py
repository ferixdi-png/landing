#!/usr/bin/env python3
"""Update landing: 9999 training + 1999/mes skladchina"""
import re, sys

P = 'index.html'
with open(P, 'r', encoding='utf-8') as f:
    h = f.read()

R = [
    # Schema price
    ('"price": "10000"', '"price": "9999"'),
    # Nav
    ('<a class="topnav__link" href="#buy">\u0426\u0435\u043d\u0430</a>',
     '<a class="topnav__link" href="#skladchina">\u0421\u043a\u043b\u0430\u0434\u0447\u0438\u043d\u0430</a>\n<a class="topnav__link" href="#buy">\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435</a>'),
]

ok = 0
for old, new in R:
    if old in h:
        h = h.replace(old, new, 1)
        ok += 1
    else:
        print(f'MISS: {old[:60]}')

# Global: all "10 000 \u20bd" but NOT "100 000 \u20bd" or "110 000"
h = re.sub(r'(?<!\d)10\s*000\s*\u20bd', '9 999 \u20bd', h)
h = re.sub(r'(?<!\d)10\s*000\s*\u0440\u0443\u0431', '9 999 \u0440\u0443\u0431', h)

# "500 \u20bd/\u043c\u0435\u0441" and "500\u20bd/\u043c\u0435\u0441" -> "1 999 \u20bd/\u043c\u0435\u0441"
h = re.sub(r'500\s*\u20bd\s*/\s*\u043c\u0435\u0441', '1 999 \u20bd/\u043c\u0435\u0441', h)
h = re.sub(r'500\s*\u20bd\s*/\s*\u043c\u0435\u0441\u044f\u0446', '1 999 \u20bd/\u043c\u0435\u0441\u044f\u0446', h)
h = h.replace('\u0432\u0441\u0435\u0433\u043e 500 \u20bd / \u043c\u0435\u0441\u044f\u0446', '\u0441\u043a\u043b\u0430\u0434\u0447\u0438\u043d\u0430 1 999 \u20bd / \u043c\u0435\u0441\u044f\u0446')

# $125 -> $120
h = h.replace('$125 \u0437\u0430 \u0441\u0442\u0430\u0440\u0442', '$120 \u0437\u0430 \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 / $25 \u0437\u0430 \u0441\u043a\u043b\u0430\u0434\u0447\u0438\u043d\u0443 \u0432 \u043c\u0435\u0441')

# "500\u20bd/\u043c\u0435\u0441 \u0437\u0430 \u0441\u043a\u043b\u0430\u0434\u0447\u0438\u043d\u0443 \u043d\u0430 Google Flow"
h = h.replace('500\u20bd/\u043c\u0435\u0441 \u0437\u0430 \u0441\u043a\u043b\u0430\u0434\u0447\u0438\u043d\u0443 \u043d\u0430 Google Flow',
              '1 999\u20bd/\u043c\u0435\u0441 \u0437\u0430 \u0441\u043a\u043b\u0430\u0434\u0447\u0438\u043d\u0443 Gemini AI ULTRA')

# Remove step 2 "doplata" blocks (both in #buy and #final)
# Pattern: <!-- ШАГ 2 --> ... </div> ending with "бессрочный доступ"
h = re.sub(
    r'<!-- \u0428\u0410\u0413 2 -->.*?\u0431\u0435\u0441\u0441\u0440\u043e\u0447\u043d\u044b\u0439 \u0434\u043e\u0441\u0442\u0443\u043f.*?</div>\s*</div>',
    '', h, flags=re.DOTALL)

# "Старт" -> "Обучение" in step 1 titles
h = h.replace('\u0421\u0442\u0430\u0440\u0442 \u2014 9 999 \u20bd', '\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 \u2014 9 999 \u20bd')

# Sticky CTA
h = h.replace('\u0421\u0442\u0430\u0440\u0442 9 999 \u20bd', '\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 9 999 \u20bd')

with open(P, 'w', encoding='utf-8') as f:
    f.write(h)
print(f'Done. Applied {ok} targeted + regex replacements.')
