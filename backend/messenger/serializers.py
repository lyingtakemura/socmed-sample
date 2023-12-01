from messenger.models import Message, Room
from rest_framework import serializers
from users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    room = serializers.PrimaryKeyRelatedField(read_only=True)
    sender = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ("id", "room", "sender", "body", "created_at")


class RoomSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True, source="message_set")

    class Meta:
        model = Room
        fields = ("id", "users", "messages")
