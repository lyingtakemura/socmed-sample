from rest_framework import mixins, viewsets
from rest_framework.response import Response

from messenger.models import Message, Thread
from messenger.serializers import MessageSerializer, ThreadSerializer


class ThreadViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer

    def list(self, request):
        """
        Return only threads where current user is participating

        GET /threads
        """
        queryset = Thread.objects.filter(users__in=[self.request.user])
        serializer = ThreadSerializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """
        Thread type value is personal by default, so if no type
        is provided in request object - personal thread should be created

        POST /threads {"users": list, "type": str}
        """
        if not self.request.data.get("type"):
            Thread.objects.get_or_create_personal_thread(
                users=self.request.data["users"]
            )


class MessageViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        """
        POST /messages {"body": str, "thread": int}
        """
        thread = Thread.objects.get(id=self.request.data["thread"])
        serializer.save(sender=self.request.user, thread=thread)
