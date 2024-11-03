from datetime import datetime


def time_difference(start, end):
    diff = end - start
    h = diff / 3600
    return h

start = input("start date: ")
end = input("end date: ")

s_date = datetime.strptime(start, "%d/%m/%Y %H:%M").timestamp()
e_date = datetime.strptime(end, "%d/%m/%Y %H:%M").timestamp()

print(time_difference(s_date, e_date))

