# -*- coding:utf-8 -*-

'''
User defined Configuration for the application.
'''

DB_CFG = {
    'host': '127.0.0.1',
    'db': 'torcms',
    'user': 'torcms',
    'pass': '111111',
}

REDIS_CFG = {
    'host': '',
    'port': '',
    'pass': ''
}

SMTP_CFG = {
    'name': 'TorCMS',
    'host': "smtp.ym.163.com",
    'user': "admin@yunsuan.org",
    'pass': "",
    'postfix': 'yunsuan.org',
}

SITE_CFG = {
    'site_url': 'http://127.0.0.1:8888',
    'cookie_secret': '123456',
    'DEBUG': False
}

ROLE_CFG = {
    'add': '1000',
    'edit': '2000',
    'delete': '3000',
    'check': '0001', # 审核权限
}
