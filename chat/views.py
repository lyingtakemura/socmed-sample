from rest_framework import mixins, viewsets
from rest_framework.response import Response

from chat.models import Message, Thread
from chat.serializers import MessageSerializer, ThreadSerializer


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
        The pre_save and post_save hooks no longer exist, but are replaced with
        perform_create(self, serializer) and perform_update(self, serializer).
        These methods should save the object instance by calling
        serializer.save(), adding in any additional arguments as required.
        They may also perform any custom pre-save or post-save behavior.

        Check if input combination of thread type and users already exist.
        For personal thread also check if there's no more than 2 users.

        POST /threads {"type": str, "users": list}
        '''

        users = self.request.data['users']
        type = self.request.data['type']

        if not Thread.objects.filter(type=type, users__in=users).exists():
            if type == 'group':
                thread = serializer.save()
                thread.users.set(self.request.data['users'])

            if type == 'personal' and not len(users) > 2:
                thread = serializer.save()
                thread.users.set(self.request.data['users'])


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
