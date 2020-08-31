'''
数据量大的时候比较慢，
按脚本运行。

简单的方法，使用下面的语句更新，但是数据量大的时候很慢。更改为逐条更新：

    UPDATE tabpost SET view_count_1d=(SELECT count(*) FROM
        tabaccess WHERE (tabaccess.post_id = tabpost.uid)
        and (tabaccess.uid >= {}));'.format(ts1d)
'''

import psycopg2
import time

from cfg import DB_CFG

conn = psycopg2.connect(
    database=DB_CFG['db'],
    user=DB_CFG['user'],
    password=DB_CFG['pass'],
    host="127.0.0.1",
    port=DB_CFG.get('port', "5432")
)

cur = conn.cursor()

timestamp = int(time.time())
ts1d = timestamp - 24 * 60 * 60
ts7d = timestamp - 7 * 24 * 60 * 60
ts30d = timestamp - 30 * 24 * 60 * 60


def echo_info():
    print('访问总数目：')
    cur.execute('select count(*) from tabaccess')
    recs = cur.fetchall()
    for rec in recs:
        print(rec)

    print('访问总数目：')
    cur.execute('select count(*) from tabpost')
    recs = cur.fetchall()
    for rec in recs:
        print(rec)

    print('近24小时：')
    recent_1d = '''
    select uid, view_count_1d, view_count_7d, view_count_30d, title from tabpost order by view_count_1d DESC limit 10
    '''
    cur.execute(recent_1d)
    recs = cur.fetchall()
    for rec in recs:
        print(rec)

    print('近7日：')
    recent_7d = '''
    select uid, view_count_1d, view_count_7d, view_count_30d, title from tabpost order by view_count_7d DESC limit 10
    '''
    cur.execute(recent_7d)
    recs = cur.fetchall()
    for rec in recs:
        print(rec)

    print('近30日：')
    recent_30d = '''
    select uid, view_count_1d, view_count_7d, view_count_30d, title from tabpost order by view_count_7d DESC limit 10
    '''
    cur.execute(recent_30d)
    recs = cur.fetchall()
    for rec in recs:
        print(rec)


def update_view_count():
    cur.execute('select uid from tabpost')
    post_ids = []
    for rec in cur.fetchall():
        post_ids.append(rec[0])

    print('更新近24小时')
    for uid in post_ids:
        cur.execute(
            "select count(*) from tabaccess where post_id = '{}' and uid >= {}".format(
                uid, ts1d
            )
        )
        the_count = cur.fetchone()[0]

        cur.execute(
            "update tabpost set view_count_1d = {} where uid = '{}'".format(
                the_count, uid
            )
        )
        # 每次提交。不然似乎导致数据库锁住，长时间无响应。
        conn.commit()

    print('更新近7日')
    for uid in post_ids:
        cur.execute(
            "select count(*) from tabaccess where post_id = '{}' and uid >= {}".format(
                uid, ts7d
            )
        )
        the_count = cur.fetchone()[0]

        cur.execute(
            "update tabpost set view_count_7d = {} where uid = '{}'".format(
                the_count, uid
            )
        )
        # 每次提交。不然似乎导致数据库锁住，长时间无响应。
        conn.commit()

    print('更新近30日')
    for uid in post_ids:
        cur.execute(
            "select count(*) from tabaccess where post_id = '{}' and uid >= {}".format(
                uid, ts30d
            )
        )
        the_count = cur.fetchone()[0]

        cur.execute(
            "update tabpost set view_count_30d = {} where uid = '{}'".format(
                the_count, uid
            )
        )
        # 每次提交。不然似乎导致数据库锁住，长时间无响应。
        conn.commit()


def run_update_count(_):
    update_view_count()
    echo_info()
