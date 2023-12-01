from messenger.models import Room
from messenger.serializers import RoomSerializer
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class RoomViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        """
        GET /rooms
        """
        queryset = Room.objects.filter(users__in=[self.request.user]).prefetch_related(
            "users__followers", "users__following"
        )
        serializer = RoomSerializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """
        POST /rooms {"user": int}
        """
        Room.get_or_create_room(self.request)
