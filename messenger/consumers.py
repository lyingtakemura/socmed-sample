from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        print(self.channel_name)
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

    def ws_message(self, event):
        self.send(text_data=event["text"])

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )
