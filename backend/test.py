import requests

r = requests.get(url="https://michigan-dining-api.tendiesti.me/v1/menus?date=2025-01-04&diningHall=Bursley%20Dining%20Hall&meal=LUNCH")

print(r.status_code)