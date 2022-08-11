from torcms.handlers.weather_hander import WeatherHander
from torcms.handlers.authortree_hander import AuthorTreeHander, MenuTreeHander

urls = [
    ("/weather", WeatherHander, {}),
    ("/author-tree", AuthorTreeHander, {}),
    ("/menu-tree", MenuTreeHander, {})
]
