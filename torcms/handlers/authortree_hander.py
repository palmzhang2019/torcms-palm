from tornado.web import RequestHandler
import json


class AuthorTreeHander(RequestHandler):

    data = [
        {
        "text": "不負責任的日文教學",
        "nodes": [
          {
            "text": "開始學習日文之前",
            "nodes": [
              {
                "text": "對於日本"
              },
              {
                "text": "看清自己的目的"
              },
              {
                "text": "理解自己的母語"
              },
              {
                "text": "理解自己的母語"
              },
              {
                "text": "學習和尊重的平衡"
              },
              {
                "text": "偏見的戰爭"
              },
              {
                "text": "自我能力的評估"
              }
            ]
          },
          {
            "text": "自修指標",
            "nodes": [
              {
                "text": "基礎1",
                "nodes": [
                  {
                    "text": "目標和範圍"
                  },
                  {
                    "text": "五十音和假名"
                  },
                  {
                    "text": "拆解和解構"
                  },
                  {
                    "text": "眼光向外"
                  }
                ]
              },
              {
                "text": "交通-定期券"
              }
            ]
          }
        ]
        },
        {
        "text": "在日本的人生",
        "nodes": [
          {
            "text": "幸福和痛苦",
            "nodes": [
              {
                "text": "歧視",
                "nodes": [
                  {
                    "text": "……"
                  }
                ]
              }
            ]
          }
        ]
        }
    ]


    def get(self):
        # 允许跨域访问
        self.set_header("Access-Control-Allow-Origin", "*")
        self.write(json.dumps(self.data))


class MenuTreeHander(RequestHandler):

    data = [
        {
    "text": "日本生活討論版",
    "nodes": [
      {
        "text": "No Food, No Life",
        "nodes": [
          {
            "text": "美食介紹"
          },
          {
            "text": "自家料理"
          }
        ]
      },
      {
        "text": "購物指南",
        "nodes": [
          {
            "text": "留學-初來乍到"
          },
          {
            "text": "交通-定期券"
          }
        ]
      },
      {
        "text": "簽證手續"
      }
    ]
  }
    ]

    def get(self):
        # 允许跨域访问
        self.set_header("Access-Control-Allow-Origin", "*")
        self.write(json.dumps(self.data))