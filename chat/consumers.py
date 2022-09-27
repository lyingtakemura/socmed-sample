import json
# from random import randint
# from time import sleep

from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

        # for i in range(3):
        #     self.send(json.dumps({'message': randint(1, 300)}))
        #     sleep(2)

    def disconnect(self, close_code):
        pass

    def receive(self, text_data=None):
        text_data_json = json.loads(text_data)
        print(json.loads(text_data))
        message = text_data_json['message']

        self.send(json.dumps({
            'message': message
        }))
