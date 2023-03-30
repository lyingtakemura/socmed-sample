from rest_framework import mixins, viewsets
from rest_framework.response import Response

from messenger.models import Room
from messenger.serializers import RoomSerializer


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
