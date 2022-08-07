from torcms.handlers.weather_hander import WeatherHander
from torcms.handlers.authortree_hander import AuthorTreeHander

urls = [
    ("/weather", WeatherHander, {}),
    ("/author-tree", AuthorTreeHander, {})
]
