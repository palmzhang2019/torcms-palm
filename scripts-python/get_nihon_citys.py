import requests
import json

response = requests.get("https://geoapi.qweather.com/v2/city/top?key=f0e7fdf927f641cdabaf2419ef938121&range=jp&number=20&lang=ja")
citys_data = json.loads(response.text)

top_citys = []
for top_city in citys_data['topCityList']:
    item = {
        'name': top_city['name'],
        'id': top_city['id']
    }
    top_citys.append(item)

print(top_citys)
