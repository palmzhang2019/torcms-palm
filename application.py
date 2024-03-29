# coding:utf-8

'''
The Application.
'''

import os

import tornado.web

import torcms.core.uifunction as uifuncs
from config import SITE_CFG
from torcms.modules.modef import core_modules
from urls import urls

# from extor.modules.extends import index_post,Catalog,Postrecent,Indexsearch
# 定义模板
# modules['Indexpost'] = index_post
# modules['catalog'] = Catalog
# modules['postrecent'] = Postrecent
# modules['indexsearch'] = Indexsearch


CUR_MODUES = {}  # type: Dict[str, object]

SETTINGS = {
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    'debug': True,
    "cookie_secret": SITE_CFG['cookie_secret'],
    "login_url": "/user/login",
    'ui_modules': dict(core_modules, **CUR_MODUES),
    'ui_methods': uifuncs,
}

APP = tornado.web.Application(
    handlers=urls,
    **SETTINGS,
)
