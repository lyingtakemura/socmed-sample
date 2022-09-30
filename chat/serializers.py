from rest_framework import serializers

from chat.models import Message
from users.models import User


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    receiver = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = "__all__"


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")
