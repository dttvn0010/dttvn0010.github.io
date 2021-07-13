# parse_date.py
from datetime import datetime

dt1 = datetime.strptime('01/01/2020', '%d/%m/%Y')
print(dt1)

dt2 = datetime.strptime('01-01-2020 23:59:59', '%d-%m-%Y %H:%M:%S')
print(dt2)