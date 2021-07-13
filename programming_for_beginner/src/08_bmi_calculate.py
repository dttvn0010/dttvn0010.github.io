# bmi_calculate.py
height = input('Chiều cao (mét) : ')
height = float(height)
 
mass = input('Cân nặng (kg) : ')
mass = float(mass)
 
bmi = mass / (height * height)
 
if bmi < 16:
    print('Thân hình gầy')
 
elif bmi < 18.5:
    print('Thân hình hơi gầy')
 
elif bmi < 25:
    print('Thân hình bình thường')
 
elif bmi < 30:
    print('Thân hình hơi béo')
 
else:
    print('Thân hình béo')
