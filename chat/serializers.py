from rest_framework import serializers

from chat.models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    receiver = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = "__all__"
