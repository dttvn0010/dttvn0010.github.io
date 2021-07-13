# number_to_text.py
bangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']

x = int(input('x='))

if x < 10:
    text = bangso[x]
else:
    chuc = x // 10
    donvi = x % 10

    text = (bangso[chuc] + ' mươi') if chuc > 1 else 'mười'    

    if donvi > 0:
        text += ' '

        if donvi == 5:
            text += 'lăm'

        elif donvi == 1 and chuc > 1:
            text += 'mốt'

        else:
            text += bangso[donvi]

print(text)
