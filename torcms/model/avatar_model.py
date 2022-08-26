# -*- coding:utf-8 -*-
'''
Model for user.
'''
import time

from torcms.model.core_tab import TabAvatar


class Avatar():
    '''
    Model for user.
    '''

    @staticmethod
    def query_all(limit=50):
        '''
        Return some of the records. Not all.
        '''
        return TabAvatar.select().order_by(TabAvatar.avatar_path)
