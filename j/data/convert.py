import json

data = []
with open('unit10.txt', encoding='utf-8') as f:
    for line in f:
        arr = line.split(';')
        if len(arr) != 4:
            print(line)
            exit()
        
        hira, kanji, latin, meaning = arr
        data.append({
            'hira': hira,
            'kanji' : kanji,
            'latin': latin,
            'meaning': meaning
        });
        
with open('unit10.json', 'w', encoding='utf-8') as f:
    json.dump(data, f)
        
    