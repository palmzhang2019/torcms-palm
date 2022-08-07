from torcms.core.torcms_redis import redisvr

weather_data = redisvr.get("weather_data")
print(weather_data)
