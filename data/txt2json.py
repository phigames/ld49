import json
import re

with open("words.txt", encoding="utf8") as infile, open("words.json", "w", encoding="utf8") as outfile:
    word_set = set()
    pattern = re.compile(r"[A-Z]+")
    for word in infile:
        word = word.upper().rstrip()
        if pattern.fullmatch(word):
            word_set.add(word)
    print(word_set)
    outfile.write(json.dumps(list(word_set)))
