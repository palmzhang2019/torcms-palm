# -*- coding:utf-8 -*-

import peewee
from peewee import SQL

from torcms.core import tools
from torcms.model.abc_model import Mabc
from torcms.model.core_tab import TabPost, TabPost2Tag, TabRel
from torcms.model.label_model import MPost2Label


class MRelation(Mabc):
    @staticmethod
    def add_relation(app_f, app_t, weight=1):
        '''
        Adding relation between two posts.
        '''
        recs = TabRel.select().where(
            (TabRel.post_f_id == app_f) & (TabRel.post_t_id == app_t)
        )
        if recs.count() > 1:
            for record in recs:
                MRelation.delete(record.uid)

        if recs.count() == 0:
            uid = tools.get_uuid()
            entry = TabRel.create(
                uid=uid,
                post_f_id=app_f,
                post_t_id=app_t,
                count=1,
            )
            return entry.uid
        elif recs.count() == 1:
            MRelation.update_relation(app_f, app_t, weight)
        else:
            return False

    @staticmethod
    def delete(uid):
        entry = TabRel.delete().where(
            TabRel.uid == uid
        )
        entry.execute()

    @staticmethod
    def update_relation(app_f, app_t, weight=1):
        try:
            postinfo = TabRel.get(
                (TabRel.post_f_id == app_f) & (TabRel.post_t_id == app_t)
            )
        except:
            return False
        entry = TabRel.update(
            count=postinfo.count + weight
        ).where(
            (TabRel.post_f_id == app_f) & (TabRel.post_t_id == app_t)
        )
        entry.execute()

    @staticmethod
    def get_app_relations(app_id, num=20, kind='1'):
        '''
        The the related infors. 如有标签按标签推荐，如无标签按标题推荐
        '''

        tag_info = filter(lambda x: not x.tag_name.startswith('_'),
                          MPost2Label.get_by_uid(app_id).objects())

        info = TabPost.get_by_id(app_id)

        tag_arr = []
        for tag in tag_info:
            tag_arr.append(tag.tag_uid)

        if len(tag_arr) > 0:

            recs = TabPost2Tag.select(
                TabPost2Tag,
                TabPost.title.alias('post_title'),
                TabPost.valid.alias('post_valid')
            ).join(
                TabPost, on=(TabPost2Tag.post_id == TabPost.uid)
            ).where(
                (TabPost2Tag.tag_id << tag_arr) &
                (TabPost.uid != app_id) &
                (TabPost.kind == kind) &
                (TabPost.valid == 1)
            ).distinct(TabPost2Tag.post_id).order_by(
                TabPost2Tag.post_id
            ).limit(num)
        else:

            recs = TabPost.select(
                TabPost.title.alias('post_title'),
                TabPost.valid.alias('post_valid'),
                TabPost.uid.alias('post_id')
            ).where(
                (SQL(("title ilike '%%{0}%%' ").format(info.title))) &
                (TabPost.uid != app_id) &
                (TabPost.kind == kind) &
                (TabPost.valid == 1)

            ).order_by(peewee.fn.Random()).limit(num)
        return recs
