# -*- coding:utf-8 -*-
'''
Handler for user.
ToDo: 太多硬编码。需要处理。
'''

import datetime
import json
import re
import time

import requests
import tornado.web
import wtforms.validators
from wtforms.fields import StringField
from wtforms.validators import DataRequired
from wtforms_tornado import Form

import config
from config import CMS_CFG
from torcms.core import tools
from torcms.core.base_handler import BaseHandler
from torcms.core.tool.send_email import send_mail
from torcms.core.tools import logger
from torcms.model.user_model import MUser
from torcms.model.avatar_model import Avatar

def check_regist_info(post_data):
    '''
    check data for user regist.
    Return the status code dict.

    The first char of 'code' stands for the different field.
    '1' for user_name
    '2' for user_email
    '3' for user_pass
    '4' for user_role
    The seconde char of 'code' stands for different status.
    '1' for invalide
    '2' for already exists.
    '''
    user_create_status = {'success': False, 'code': '00'}

    if not tools.check_username_valid(post_data['user_name']):
        user_create_status['code'] = '11'
    elif not tools.check_email_valid(post_data['user_email']):
        user_create_status['code'] = '21'
    elif MUser.get_by_name(post_data['user_name']):
        user_create_status['code'] = '12'
    elif MUser.get_by_email(post_data['user_email']):
        user_create_status['code'] = '22'
    else:
        user_create_status['success'] = True
    return user_create_status


def check_modify_info(post_data):
    '''
    check data for user infomation modification.
    '''
    user_create_status = {'success': False, 'code': '00'}

    if not tools.check_email_valid(post_data['user_email']):
        user_create_status['code'] = '21'
    elif MUser.get_by_email(post_data['user_email']):
        user_create_status['code'] = '22'
    else:
        user_create_status['success'] = True
    return user_create_status


def check_valid_pass(postdata):
    '''
    ToDo: 对用户密码进行有效性检查。似乎没必要。
    '''
    _ = postdata
    user_create_status = {'success': False, 'code': '00'}
    user_create_status['success'] = True
    return user_create_status


class SumForm(Form):
    '''
    WTForm for user.
    '''
    user_name = StringField('user_name',
                            validators=[DataRequired()],
                            default='')
    user_pass = StringField('user_pass',
                            validators=[DataRequired()],
                            default='')
    user_email = StringField(
        'user_email',
        validators=[DataRequired(), wtforms.validators.Email()],
        default='')


class SumFormWithoutEmail(Form):
    '''
    WTForm for user.
    '''
    user_name = StringField('user_name',
                            validators=[DataRequired()],
                            default='')
    user_pass = StringField('user_pass',
                            validators=[DataRequired()],
                            default='')


class SumFormInfo(Form):
    '''
    WTForm for user.
    '''
    user_email = StringField(
        'user_email', validators=[DataRequired(),
                                  wtforms.validators.Email()])


class SumFormPass(Form):
    '''
    WTForm for user password.
    '''
    user_pass = StringField('user_pass', validators=[DataRequired()])


class UserHandler(BaseHandler):
    '''
    Handler for user.
    '''

    def initialize(self, **kwargs):
        super().initialize()
        self.is_p = False

    def get(self, *args, **kwargs):

        url_str = args[0]
        url_arr = self.parse_url(url_str)

        dict_get = {
            'before_regist': self.__before_regist__,
            'avatar': self.__avatar__,
            'privacy': self.__privacy__,
            'regist': (lambda: self.redirect('/user/info'))
            if self.get_current_user() else self.__to_register__,
            'regist_finish': self.__regist_finish__,
            'login':
                self.__to_login__,
            'info':
                self.__to_show_info__,
            'message':
                self.__to_message__,
            'logout':
                self.__logout__,
            'reset-password':
                self.__to_reset_password__,
            'changepass':
                self.__change_pass__,
            'changeinfo':
                self.__to_change_info__,
            'reset-passwd':
                self.gen_passwd,
            'changerole':
                self.__to_change_role__,
            'find':
                self.find,
            'delete_user':
                self.__delete_user__,
            'list':
                self.__user_list__,
        }
        if len(url_arr) == 1:
            dict_get.get(url_arr[0])()
        elif len(url_arr) == 2:
            dict_get.get(url_arr[0])(url_arr[1])
        elif len(url_arr) == 3:
            self.__to_find__(url_arr[2])
        else:
            pass

    def post(self, *args, **kwargs):
        '''
        用户操作。
        '''
        _ = kwargs
        url_str = args[0]
        url_arr = self.parse_url(url_str)

        if url_str == 'regist':
            self.__register__()
        elif url_str == 'before_regist':
            self.__before_regist_post__()
        elif url_str == 'j_regist':
            self.json_register()
        elif url_str == 'j_changeinfo':
            self.json_changeinfo()
        elif url_str == 'j_changepass':
            self.json_changepass()
        elif url_str == 'login':
            self.login()
        elif url_str == 'changepass':
            self.__change_password__()
        elif url_str == 'changeinfo':
            self.__change_info__()
        elif url_str == 'find':
            self.post_find()
        elif url_str == 'reset-password':
            self.reset_password()
        elif url_arr[0] == 'changepass':
            self.p_changepassword()
        elif url_arr[0] == 'changeinfo':
            self.p_changeinfo()
        elif url_arr[0] == 'find':
            self.find(url_arr[1])
        elif url_arr[0] == 'changerole':
            self.__change_role__(url_arr[1])

    @tornado.web.authenticated
    def p_changepassword(self):
        '''
        Changing password.
        '''

        post_data = self.get_request_arguments()

        usercheck = MUser.check_user(self.userinfo.uid, post_data['rawpass'])
        if usercheck == 1:
            MUser.update_pass(self.userinfo.uid, post_data['user_pass'])
            output = {'changepass ': usercheck}
        else:
            output = {'changepass ': 0}
        return json.dump(output, self)

    @tornado.web.authenticated
    def p_changeinfo(self):
        '''
        Change Infor via Ajax.
        '''

        post_data, def_dic = self.fetch_post_data()

        usercheck = MUser.check_user(self.userinfo.uid, post_data['rawpass'])
        if usercheck == 1:
            MUser.update_info(self.userinfo.uid,
                              post_data['user_email'],
                              extinfo=def_dic)
            output = {'changeinfo ': usercheck}
        else:
            output = {'changeinfo ': 0}
        return json.dump(output, self)

    def fetch_post_data(self):
        '''
        fetch post accessed data. post_data, and ext_dic.
        '''
        post_data = {}
        ext_dic = {}
        for key in self.request.arguments:
            if key.startswith('def_'):
                ext_dic[key] = self.get_argument(key, default='')
            else:
                post_data[key] = self.get_arguments(key)[0]

        post_data['user_name'] = self.userinfo.user_name

        ext_dic = dict(ext_dic, **self.ext_post_data(postdata=post_data))

        return (post_data, ext_dic)

    def ext_post_data(self, **kwargs):
        '''
        The additional information.  for add(), or update().
        '''
        _ = kwargs
        return {}

    @tornado.web.authenticated
    def __change_password__(self):
        '''
        Change password
        '''
        post_data = self.get_request_arguments()

        usercheck_num = MUser.check_user(self.userinfo.uid,
                                         post_data['rawpass'])
        if usercheck_num == 1:
            MUser.update_pass(self.userinfo.uid, post_data['user_pass'])
            self.redirect('/user/info')
        else:
            kwd = {
                'info': '原密码输入错误，请重新输入',
                'link': '/user/changepass',
            }
            self.render('misc/html/404.html', kwd=kwd, userinfo=self.userinfo)

    @tornado.web.authenticated
    def __change_info__(self):
        '''
        Change the user info
        '''

        post_data, def_dic = self.fetch_post_data()

        usercheck_num = MUser.check_user(self.userinfo.uid,
                                         post_data['rawpass'])
        if usercheck_num == 1:
            MUser.update_info(self.userinfo.uid,
                              post_data['user_email'],
                              extinfo=def_dic)
            self.redirect(('/user/info'))
        else:
            kwd = {
                'info': '密码输入错误。',
                'link': '/user/changeinfo',
            }
            self.render('misc/html/404.html', kwd=kwd, userinfo=self.userinfo)

    @tornado.web.authenticated
    def __change_role__(self, xg_username):
        '''
        Change th user rule
        '''
        post_data = self.get_request_arguments()
        MUser.update_role(xg_username, post_data['role'])
        self.redirect('/user/info')

    @tornado.web.authenticated
    def __logout__(self):
        '''
        user logout.
        '''
        self.clear_all_cookies()
        print('log out')
        self.redirect('/')

    @tornado.web.authenticated
    def __change_pass__(self):
        '''
        to change the password.
        '''

        if self.is_p:
            tmpl = 'admin/user/puser_changepass.html'
        else:
            tmpl = 'user/user_changepass.html'
        self.render(tmpl,
                    userinfo=self.userinfo,
                    kwd={})

    @tornado.web.authenticated
    def __to_change_info__(self):
        '''
        to change the user info.
        '''
        if self.is_p:
            tmpl = 'admin/user/puser_changeinfo.html'
        else:
            tmpl = 'user/user_changeinfo.html'
        self.render(tmpl,
                    userinfo=self.userinfo,
                    kwd={})

    @tornado.web.authenticated
    def __to_change_role__(self, xg_username):
        '''
        to change the user role
        '''
        self.render('user/user_changerole.html',
                    userinfo=MUser.get_by_name(xg_username),
                    kwd={})

    @tornado.web.authenticated
    def __to_find__(self, cur_p=''):
        '''
        to find the user
        '''
        if cur_p == '':
            current_page_number = 1
        else:
            current_page_number = int(cur_p)

        current_page_number = 1 if current_page_number < 1 else current_page_number

        pager_num = int(MUser.total_number() / CMS_CFG['list_num'])

        kwd = {'pager': '', 'current_page': current_page_number}

        if self.is_p:
            tmpl = 'admin/user/puser_find_list.html'
        else:
            tmpl = 'user/user_find_list.html'
        self.render(tmpl,
                    cfg=config.CMS_CFG,
                    infos=MUser.query_pager_by_slug(
                        current_page_num=current_page_number),
                    kwd=kwd,
                    view=MUser.get_by_keyword(""),
                    userinfo=self.userinfo)

    @tornado.web.authenticated
    def __to_show_info__(self):
        '''
        show the user info
        '''
        rec = MUser.get_by_uid(self.userinfo.uid)
        kwd = {}

        if self.is_p:
            tmpl = 'admin/user/puser_info.html'
        else:
            tmpl = 'user/user_info.html'

        self.render(tmpl,
                    userinfo=self.userinfo,
                    extinfo=rec.extinfo,
                    kwd=kwd)

    @tornado.web.authenticated
    def __to_message__(self):
        '''
        show the user message
        '''
        rec = MUser.get_by_uid(self.userinfo.uid)
        kwd = {}

        if self.is_p:
            tmpl = 'admin/user/puser_info.html'
        else:
            tmpl = 'user/user_message.html'

        self.render(tmpl,
                    userinfo=self.userinfo,
                    extinfo=rec.extinfo,
                    kwd=kwd)

    def __to_reset_password__(self):
        '''
        to reset the password.
        '''
        self.render('user/user_reset_password.html',
                    userinfo=self.userinfo,
                    kwd={})

    def __to_login__(self):
        '''
        to login.
        '''
        next_url = self.get_argument("next", "/")

        if self.get_current_user():
            self.redirect(next_url)
        else:
            kwd = {
                'pager': '',
                'next_url': next_url,
                'ad': False,
            }
            self.render('user/user_login.html', kwd=kwd, userinfo=None)

    def __avatar__(self):
        self.render('user/user_avatar.html', userinfo=None)

    def __before_regist__(self):
        '''
        before regist.
        '''
        next_url = "/user/privacy"

        if self.get_current_user():
            self.redirect(next_url)
        else:
            kwd = {
                'pager': '',
                'next_url': next_url,
                'ad': False,
            }
            self.render('user/user_or_roboot.html', kwd=kwd, userinfo=None)

    def __privacy__(self):
        self.render('user/user_privacy.html', userinfo=None)

    def __before_regist_post__(self):
        post_data = self.get_request_arguments()
        data = {
            'secret': '6LdqDJEhAAAAABAf9bCE5U_Poe_CR84ZYGIhT1N-',
            'response': post_data['token']
        }
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data)
        res_data = response.text
        res = json.loads(res_data)['success']
        if res:
            self.set_cookie("rechap", post_data['token'])
            self.write("true")
        else:
            self.write("false")

    def __register__(self):
        '''
        regist the user.
        '''
        post_data = self.get_request_arguments()
        google_data = {
            'secret': '6LdqDJEhAAAAABAf9bCE5U_Poe_CR84ZYGIhT1N-',
            'response': post_data['g-recaptcha-response']
        }
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', google_data)
        res_data = response.text
        res = json.loads(res_data)['success']
        if not res:
            kwd = {
                'info': '没有通过Google验证',
                'link': '/user/regist',
            }
            self.set_status(400)
            self.render(
                'misc/html/404.html',
                cfg=config.CMS_CFG,
                kwd=kwd,
                userinfo=None
            )
        else:
            ckname = MUser.get_by_name(post_data['user_name'])
            ckemail = None
            if post_data['user_email']:
                ckemail = MUser.get_by_email(post_data['user_email'])
                form = SumForm(self.request.arguments)
            else:
                form = SumFormWithoutEmail(self.request.arguments)
            if ckname is None:
                pass
            else:
                kwd = {
                    'info': '用户名已存在，请更换用户名。',
                    'link': '/user/regist',
                }
                self.set_status(400)
                self.render('misc/html/404.html',
                            cfg=config.CMS_CFG,
                            kwd=kwd,
                            userinfo=None)
            if ckemail is None:
                pass
            else:
                kwd = {
                    'info': '邮箱已经存在，请更换邮箱。',
                    'link': '/user/regist',
                }
                self.set_status(400)
                self.render('misc/html/404.html',
                            cfg=config.CMS_CFG,
                            kwd=kwd,
                            userinfo=None)
            if form.validate():
                res_dic = MUser.create_user(post_data)
                if res_dic['success']:
                    self.redirect('/user/regist_finish')
                else:
                    kwd = {
                        'info': '注册不成功',
                        'link': '/user/regist',
                    }
                    self.set_status(400)
                    self.render('misc/html/404.html',
                                cfg=config.CMS_CFG,
                                kwd=kwd,
                                userinfo=None)

            else:
                kwd = {
                    'info': '注册不成功',
                    'link': '/user/regist',
                }
                self.set_status(400)
                self.render('misc/html/404.html',
                            cfg=config.CMS_CFG,
                            kwd=kwd,
                            userinfo=None)

    def json_register(self):
        '''
        user regist.
        '''

        post_data = self.get_request_arguments()
        user_create_status = check_regist_info(post_data)
        if not user_create_status['success']:
            return json.dump(user_create_status, self)

        form = SumForm(self.request.arguments)

        if form.validate():
            user_create_status = MUser.create_user(post_data)
            logger.info('user_register_status: {0}'.format(user_create_status))
            return json.dump(user_create_status, self)
        return json.dump(user_create_status, self)

    def json_changeinfo(self):
        '''
        Modify user infomation.
        '''

        post_data = self.get_request_arguments()

        is_user_passed = MUser.check_user(self.userinfo.uid,
                                          post_data['rawpass'])

        if is_user_passed == 1:

            user_create_status = check_modify_info(post_data)
            if not user_create_status['success']:
                return json.dump(user_create_status, self)

            form_info = SumFormInfo(self.request.arguments)

            if form_info.validate():
                user_create_status = MUser.update_info(self.userinfo.uid,
                                                       post_data['user_email']
                                                       )
                return json.dump(user_create_status, self)
            return json.dump(user_create_status, self)
        return False

    def json_changepass(self):
        '''
        modify password.
        '''

        # user_create_status = {'success': False, 'code': '00'} # Not used currently.
        post_data = self.get_request_arguments()

        check_usr_status = MUser.check_user(self.userinfo.uid,
                                            post_data['rawpass'])

        if check_usr_status == 1:

            user_create_status = check_valid_pass(post_data)
            if not user_create_status['success']:
                return json.dump(user_create_status, self)

            form_pass = SumFormPass(self.request.arguments)

            if form_pass.validate():
                MUser.update_pass(self.userinfo.uid, post_data['user_pass'])
                return json.dump(user_create_status, self)

            return json.dump(user_create_status, self)

        return False

    def __to_register__(self):
        '''
        to register.
        '''
        kwd = {
            'pager': '',
        }
        avatars = Avatar.query_all()
        self.render('user/user_regist.html',
                    cfg=config.CMS_CFG,
                    userinfo=None,
                    avatars=avatars,
                    kwd=kwd)

    def __regist_finish__(self):
        self.render(
            'user/regist_finish.html',
            cfg=config.CMS_CFG,
            userinfo=None,
        )

    def login(self):
        '''
        user login.
        '''
        post_data = self.get_request_arguments()

        if 'next' in post_data:
            next_url = post_data['next']
        else:
            next_url = '/'

        u_name = post_data['user_name']
        u_pass = post_data['user_pass']

        check_email = re.compile(r'^\w+@(\w+\.)+(com|cn|net)$')

        result = MUser.check_user_by_name(u_name, u_pass)
        # 根据用户名进行验证，如果不存在，则作为E-mail来获取用户名进行验证
        if result == -1 and check_email.search(u_name):
            user_x = MUser.get_by_email(u_name)
            if user_x:
                result = MUser.check_user_by_name(user_x.user_name, u_pass)

        # Todo: the `kwd` should remove from the codes.
        if result == 1:
            self.set_secure_cookie(
                "user",
                u_name,
                expires_days=None,
                expires=time.time() + 60 * CMS_CFG.get('expires_minutes', 15)
            )
            MUser.update_success_info(u_name)
            self.redirect(next_url)
        elif result == 0:
            self.set_status(401)

            MUser.update_failed_info(u_name)

            self.render('user/user_relogin.html',
                        cfg=config.CMS_CFG,
                        kwd={
                            'info': 'Invalid password. Please try again.',
                            'code': '0',
                            'link': '/user/login',
                        },
                        userinfo=self.userinfo)
        elif result == 2:
            self.set_status(401)

            MUser.update_failed_info(u_name)

            self.render('user/user_relogin.html',
                        cfg=config.CMS_CFG,
                        kwd={
                            'info': 'Too many faild times. Please try again later.',
                            'code': '2',
                            'link': '/user/login',
                        },
                        userinfo=self.userinfo)
        elif result == -1:
            self.set_status(401)
            self.render('user/user_relogin.html',
                        cfg=config.CMS_CFG,
                        kwd={
                            'info': 'No such user.',
                            'code': -1,
                            'link': '/user/login',
                        },
                        userinfo=self.userinfo)
        else:
            self.set_status(305)
            self.redirect("{0}".format(next_url))

    def p_to_find(self, ):
        '''
        To find, pager.
        '''
        kwd = {
            'pager': '',
        }
        self.render('user/user_find_list.html',
                    kwd=kwd,
                    view=MUser.get_by_keyword(""),
                    cfg=config.CMS_CFG,
                    userinfo=self.userinfo)

    def find(self, keyword=None, cur_p=''):
        '''
        find by keyword.
        '''
        if not keyword:
            self.__to_find__(cur_p)

        kwd = {
            'pager': '',
            'title': '查找结果',
        }

        if self.is_p:
            tmpl = 'admin/user/puser_find_list.html'
        else:
            tmpl = 'user/user_find_list.html'

        self.render(tmpl,
                    kwd=kwd,
                    view=MUser.get_by_keyword(keyword),
                    cfg=config.CMS_CFG,
                    userinfo=self.userinfo)

    def __user_list__(self):
        '''
        find by keyword.
        '''

        month_arr = []
        count_arr = []
        num_arr = []

        jan_arr = []
        feb_arr = []
        mar_arr = []
        apr_arr = []
        may_arr = []
        jun_arr = []
        jul_arr = []
        aug_arr = []
        sep_arr = []
        oct_arr = []
        nov_arr = []
        dec_arr = []

        current_month = datetime.datetime.now().month

        # 获取当年，1月到当前月份注册信息
        recs = MUser.query_by_time(current_month * 30)

        for rec in recs:
            current_mon = time.strftime("%m", time.localtime(rec.time_create))
            if current_mon == '01':
                jan_arr.append(rec)
            elif current_mon == '02':
                feb_arr.append(rec)
            elif current_mon == '03':
                mar_arr.append(rec)
            elif current_mon == '04':
                apr_arr.append(rec)
            elif current_mon == '05':
                may_arr.append(rec)
            elif current_mon == '06':
                jun_arr.append(rec)
            elif current_mon == '07':
                jul_arr.append(rec)
            elif current_mon == '08':
                aug_arr.append(rec)
            elif current_mon == '09':
                sep_arr.append(rec)
            elif current_mon == '10':
                oct_arr.append(rec)
            elif current_mon == '11':
                nov_arr.append(rec)
            elif current_mon == '12':
                dec_arr.append(rec)
            count_arr.append(len(jan_arr))
            count_arr.append(len(feb_arr))
            count_arr.append(len(mar_arr))
            count_arr.append(len(apr_arr))
            count_arr.append(len(may_arr))
            count_arr.append(len(jun_arr))
            count_arr.append(len(jul_arr))
            count_arr.append(len(aug_arr))
            count_arr.append(len(sep_arr))
            count_arr.append(len(oct_arr))
            count_arr.append(len(nov_arr))
            count_arr.append(len(dec_arr))

            for mon in range(0, current_month):
                month_arr.append(mon + 1)
                num_arr.append(count_arr[mon])

            kwd = {
                'pager': '',
                'title': '查找结果',
                'user_count': MUser.total_number(),
                'month_arr': month_arr,
                'num_arr': num_arr,
            }

            self.render('user/user_list.html',
                        recs=recs,
                        kwd=kwd,
                        view=MUser.query_by_time(),
                        cfg=config.CMS_CFG,
                        userinfo=self.userinfo)

    def __delete_user__(self, user_id):
        '''
        delete user by ID.
        '''
        if self.is_p:
            if MUser.delete(user_id):
                output = {'del_category': 1}
            else:
                output = {
                    'del_category': 0,
                }

            return json.dump(output, self)

        else:
            is_deleted = MUser.delete(user_id)
            if is_deleted:
                self.redirect('/user/find')

    def post_find(self):
        '''
        Do find user.
        '''
        keyword = self.get_argument('keyword', default='')
        self.find(keyword)

    def reset_password(self):
        '''
        Do reset password
        :return: None
        '''
        post_data = self.get_request_arguments()

        if 'email' in post_data:
            userinfo = MUser.get_by_email(post_data['email'])

            if tools.timestamp() - userinfo.time_reset_passwd < 70:
                self.set_status(400)
                kwd = {
                    'info': '两次重置密码时间应该大于1分钟',
                    'link': '/user/reset-password',
                }
                self.render('misc/html/404.html',
                            kwd=kwd,
                            userinfo=self.userinfo)
                return False

            if userinfo:
                timestamp = tools.timestamp()
                passwd = userinfo.user_pass
                username = userinfo.user_name
                hash_str = tools.md5(username + str(timestamp) + passwd)
                url_reset = '{0}/user/reset-passwd?u={1}&t={2}&p={3}'.format(
                    config.SITE_CFG['site_url'], username, timestamp, hash_str)
                email_cnt = '''<div>请查看下面的信息，并<span style="color:red">谨慎操作</span>：</div>
                <div>您在"{0}"网站（{1}）申请了密码重置，如果确定要进行密码重置，请打开下面链接：</div>
                <div><a href={2}>{2}</a></div>
                <div>如果无法确定本信息的有效性，请忽略本邮件。</div>'''.format(
                    config.SMTP_CFG['name'], config.SITE_CFG['site_url'],
                    url_reset)

                if send_mail([userinfo.user_email],
                             "{0}|密码重置".format(config.SMTP_CFG['name']),
                             email_cnt):
                    MUser.update_time_reset_passwd(username, timestamp)
                    self.set_status(200)
                    logger.info('password has been reset.')
                    return True

                self.set_status(400)
                return False
            self.set_status(400)
            return False
        self.set_status(400)
        return False

    def gen_passwd(self):
        '''
        reseting password
        '''
        post_data = self.get_request_arguments()

        userinfo = MUser.get_by_name(post_data['u'])

        sub_timestamp = int(post_data['t'])
        cur_timestamp = tools.timestamp()
        if cur_timestamp - sub_timestamp < 600 and cur_timestamp > sub_timestamp:
            pass
        else:
            kwd = {
                'info': '密码重置已超时！',
                'link': '/user/reset-password',
            }
            self.set_status(400)
            self.render('misc/html/404.html', kwd=kwd, userinfo=self.userinfo)

        hash_str = tools.md5(userinfo.user_name + post_data['t'] +
                             userinfo.user_pass)
        if hash_str == post_data['p']:
            pass
        else:
            kwd = {
                'info': '密码重置验证出错！',
                'link': '/user/reset-password',
            }
            self.set_status(400)
            self.render(
                'misc/html/404.html',
                kwd=kwd,
                userinfo=self.userinfo,
            )

        new_passwd = tools.get_uu8d()
        MUser.update_pass(userinfo.uid, new_passwd)
        kwd = {
            'user_name': userinfo.user_name,
            'new_pass': new_passwd,
        }
        self.render(
            'user/user_show_pass.html',
            cfg=config.CMS_CFG,
            kwd=kwd,
            userinfo=self.userinfo,
        )


class UserPartialHandler(UserHandler):
    '''
    Partially render for user handler.
    For website background.
    '''

    def initialize(self, **kwargs):
        super().initialize()
        self.is_p = True
