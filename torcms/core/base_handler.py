# -*- coding:utf-8 -*-
'''
Basic for handler
'''

import socket

import tornado.web
from tornado.concurrent import run_on_executor

from config import kind_arr, post_type
from torcms.core.tool import run_whoosh
from torcms.model.user_model import MUser


class BaseHandler(tornado.web.RequestHandler):
    '''
    The base class for handlers.
    '''
    def initialize(self, **kwargs):

        # self.set_cookie('b_locale', 'zh_CN')
        # self.set_cookie('b_locale', 'en')

        _ = kwargs
        super(BaseHandler, self).initialize()
        if self.get_current_user():
            self.userinfo = MUser.get_by_name(self.get_current_user())
        else:
            self.userinfo = None
        self.is_p = False  # True, if partially rendered.
        self.is_j = False  # True, if json would be returned.

    def get_post_data(self):
        '''
        Get all the arguments from post request. Only get the first argument by default.
        '''
        post_data = {}
        for key in self.request.arguments:
            post_data[key] = self.get_arguments(key)[0]
        return post_data

    # pylint: disable=R0201
    def parse_url(self, url_str):
        '''
        split the url_str to array.
        :param url_str: the request url.
        :return: the array of request url.
        '''
        url_str = url_str.strip()
        return url_str.split('/') if url_str else []

    def check_post_role(self):
        '''
        check the user role for docs.
        '''
        priv_dic = {
            'ADD': False,
            'EDIT': False,
            'DELETE': False,
            'ADMIN': False
        }
        if self.userinfo:
            if self.userinfo.role[1] > '0':
                priv_dic['ADD'] = True
            if self.userinfo.role[1] >= '1':
                priv_dic['EDIT'] = True
            if self.userinfo.role[1] >= '3':
                priv_dic['DELETE'] = True
            if self.userinfo.role[1] >= '2':
                priv_dic['ADMIN'] = True
        return priv_dic

    def get_current_user(self):
        '''
        the current user.
        '''
        return self.get_secure_cookie("user")
        # user_id = self.get_secure_cookie("user")
        # if not user_id: return None
        #     return self.backend.get_user_by_id(user_id)

    def get_user_locale(self):
        '''
        Override the function, to control the UI language.
        '''
        locale_id = self.get_cookie('ulocale')
        if locale_id:
            return tornado.locale.get(locale_id)
        else:
            return tornado.locale.get('en_US')

    def get_browser_locale(self):
        '''
        Override the function, to control the UI language.
        '''
        locale_id = self.get_cookie('blocale')
        if locale_id:
            return tornado.locale.get(locale_id)
        else:
            return tornado.locale.get('en_US')

    def is_admin(self):
        '''
        if is admin
        '''
        return True if self.check_post_role()['ADMIN'] else False

    def editable(self):
        '''
        if is editable
        '''
        return True if self.check_post_role()['EDIT'] else False

    def data_received(self, chunk):
        return False

    @run_on_executor
    def cele_gen_whoosh(self):
        '''
        Generat whoosh database.
        '''
        run_whoosh.gen_whoosh_database(kind_arr=kind_arr, post_type=post_type)

    def wrap_tmpl(self, tmpl):
        '''
        return the warpped template path.
        :param tmpl:
        '''
        return 'admin/' + tmpl.format(sig='p') if self.is_p else tmpl.format(
            sig='')

    def get_host_ip(self):
        """
        查询本机ip地址
        :return:
        """
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(('8.8.8.8', 80))
            ip = s.getsockname()[0]
        finally:
            s.close()

        return ip

    def show404(self, kwd=None):
        if kwd:
            pass
        else:
            kwd = {
                'info': 'Invalid requests',
            }
        self.set_status(404)
        self.render('misc/html/404.html', kwd=kwd, userinfo=self.userinfo)
