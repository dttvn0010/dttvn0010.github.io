# add_date.py
from datetime import datetime, timedelta

dt1 = datetime(2020, 2, 1)
duration = timedelta(days=30, seconds=3600) # 30 ngày + 1 giờ
dt2 = dt1 + duration

print(dt2)