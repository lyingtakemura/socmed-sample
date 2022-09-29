from rest_framework import serializers

from chat.models import Inbox, Message


class InboxSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Inbox
        fields = "__all__"


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = "__all__"
