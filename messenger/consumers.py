from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json


# class ChatConsumer(WebsocketConsumer):
#     def connect(self):
#         self.accept()

#     def disconnect(self, close_code):
#         pass

#     def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json["message"]

#         self.send(text_data=json.dumps({"message": message}))


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        print(dir(self))
        print("GROUPS: ", self.groups)
        print("SCOPE: ", self.scope)

        self.room_name = "broadcast"
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)
        self.accept()

    def receive(self, text_data=None):
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": "ws.message",
                "text": text_data,
            },
        )
        print(text_data)

    def ws_message(self, event):
        print("WS_MESSAGE:", event)
        self.send(text_data=event["text"])

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )
