# format_datetime.py
from datetime import datetime

now = datetime.now()

print(now.strftime('%d-%m-%Y'))
print(now.strftime('%d/%m/%Y %H:%M:%S'))