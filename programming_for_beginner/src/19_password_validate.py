# password_validate.py
password = input('Nhập mật khẩu : ')

if len(password) < 6:
    print('Mật khẩu quá ngắn')
    exit()

co_chu_cai = False
for c in password:
    C = c.upper()
    if (C >= 'A' and C <= 'Z'):
        co_chu_cai = True
        break

if not co_chu_cai:
    print('Mật khẩu cần chứa ít nhất một chữ cái (a-z/A-Z)')
    exit()

co_chu_so = False
for c in password:
    if c >= '0' and c <= '9':
        co_chu_so = True
        break

if not co_chu_so:
    print('Mật khẩu cần chứa ít nhất một chữ số (0-9)')
    exit()

print('Mật khẩu hợp lệ !')