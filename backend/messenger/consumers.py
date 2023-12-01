import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from messenger.models import Room
from messenger.serializers import MessageSerializer
from users.models import User


class MessengerConsumer(WebsocketConsumer):
    def connect(self):
        print("SCOPE: ", self.scope)
        self.room_name = "room_" + self.scope["url_route"]["kwargs"]["id"]
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)
        self.accept()

    def receive(self, text_data):
        """
        -  serializer data will get only non-relation fields,
        related fields require model instances
        """
        data = json.loads(text_data)
        serializer = MessageSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            room = Room.objects.get(id=data["room"])
            sender = User.objects.get(id=data["sender"])
            serializer.save(room=room, sender=sender)
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "websocket_message",
                    "text": json.dumps(serializer.data),
                },
            )

    def websocket_message(self, event):
        self.send(text_data=event["text"])

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )


class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        print("GROUPS: ", self.groups)
        print("SCOPE: ", self.scope)
        self.room_name = "broadcast"
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": "websocket_message",
                "text": json.dumps(data),
            },
        )

    def websocket_message(self, event):
        self.send(text_data=event["text"])

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )
