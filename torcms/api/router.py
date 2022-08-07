from torcms.handlers.weather_hander import WeatherHander

urls = [
    ("/weather", WeatherHander, {}),
]
