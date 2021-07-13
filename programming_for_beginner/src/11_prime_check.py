# prime_check.py
x = int(input('x='))

i = 2
while i * i <= x:
    if x % i == 0:
        j = x // i
        print(x, '=', i , '*', j)
        exit()
    i += 1

print(x, ' là số nguyên tố')