from rest_framework import mixins, viewsets
from rest_framework.response import Response

from messenger.models import Message, Room
from messenger.serializers import MessageSerializer, RoomSerializer


class RoomViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def list(self, request):
        """
        GET /rooms
        """
        queryset = Room.objects.filter(users__in=[self.request.user])
        serializer = RoomSerializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """
        POST /rooms {"users": list}
        """
        room = Room.objects.create()
        room.users.set(self.request.data["users"])


class MessageViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        """
        POST /messages {"body": str, "room": int}
        """
        room = Room.objects.get(id=self.request.data["room"])
        serializer.save(sender=self.request.user, room=room)
