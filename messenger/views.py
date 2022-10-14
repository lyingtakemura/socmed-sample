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

    def retrieve(self, request, *args, **kwargs):
        thread = Thread.objects.get(id=self.kwargs['pk'])
        serializer = ThreadSerializer(thread)
        return Response(serializer.data)

    def perform_create(self, serializer):
        '''
        Check if input combination of thread type and users already exist.
        For personal thread also check if there's no more than 2 users.

        POST /threads {"type": str, "users": list}
        '''
        users = self.request.data['users']
        type = self.request.data['type']

        if type == 'personal':
            user1, user2 = users
            obj = Thread.objects.filter(type=type).filter(users=user1).filter(users=user2).exists()
            if not obj and len(users) >= 2:
                qs = Thread.objects.create(type=type)
                qs.users.set(users)


class MessageViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        '''
        POST /messages {"body": string, "thread": int}
        '''
        thread = Thread.objects.get(id=self.request.data['thread'])
        serializer.save(sender=self.request.user, thread=thread)
