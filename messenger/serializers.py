from rest_framework import serializers
from users.serializers import UserSerializer

from messenger.models import Message, Thread


class MessageSerializer(serializers.ModelSerializer):
    thread = serializers.PrimaryKeyRelatedField(read_only=True)
    sender = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ("id", "thread", "sender", "body", "created_at")


class ThreadSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True, source="message_set")

    class Meta:
        model = Thread
        fields = ("id", "type", "users", "messages")
