from torcms.core.torcms_redis import redisvr
from topcitys import top_citys
import requests
import json


weather_list = []
for top_city in top_citys:
    wurl = f"https://devapi.qweather.com/v7/weather/now?key=f0e7fdf927f641cdabaf2419ef938121&location={top_city['id']}&lang=ja"
    response = requests.get(wurl)
    weather_data = json.loads(response.text)
    if weather_data['code'] == "200":
        item = {
            "city": top_city["name"],
            "temp": weather_data['now']['temp'],
            "feels_temp": weather_data['now']['feelsLike'],
            "text": weather_data['now']['text'],
        }
        weather_list.append(item)
weather_data_str = json.dumps(weather_list)
redisvr.set("weather_data", weather_data_str)
