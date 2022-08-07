from tornado.web import RequestHandler
from torcms.core.torcms_redis import redisvr


class WeatherHander(RequestHandler):

    def get(self):
        # 允许跨域访问
        self.set_header("Access-Control-Allow-Origin", "*")
        weather_data = redisvr.get("weather_data")
        self.write(weather_data)
