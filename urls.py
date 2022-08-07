# -*- coding:utf-8 -*-

'''
The router used in App.
'''

import router
import torcms.core.router
import torcms.api.router

urls = router.urls + torcms.core.router.urls + torcms.api.router.urls
