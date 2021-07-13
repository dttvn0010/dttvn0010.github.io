# month_convert.py
table = {
    "JAN" : "Tháng một",
	"FEB" : "Tháng hai",
	"MAR" : "Tháng ba",
	"APR" : "Tháng tư",
	"MAY" : "Tháng năm",
	"JUN" : "Tháng sáu",
	"JUL" : "Tháng bảy",
	"AUG" : "Tháng tám",
	"SEP" : "Tháng chín",
	"OCT" : "Tháng mười",
	"NOV" : "Tháng mười một",
	"DEC" : "Tháng mười hai"
}
month = input("Nhập mã tháng 3 ký tự tiếng Anh:")
if month in table:
    print('Tháng tiếng Việt:', table[month])
else:
    print('Mã không hợp lệ')
