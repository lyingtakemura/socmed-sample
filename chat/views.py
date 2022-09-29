from rest_framework import mixins, viewsets
from rest_framework.response import Response

from chat.models import Inbox, Message
from chat.serializers import InboxSerializer, MessageSerializer


class InboxViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin
):
    queryset = Inbox.objects.all()
    serializer_class = InboxSerializer

    def list(self, request):
        '''
        To serialize a queryset or list of objects instead of a single object
        instance, you should set many=True flag when instantiating serializer.
        '''
        queryset = Inbox.objects.filter(post=request.GET['inbox'])
        serializer = InboxSerializer(queryset, many=True)
        return Response(serializer.data)


class MessageViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        '''
        The pre_save and post_save hooks no longer exist, but are replaced with
        perform_create(self, serializer) and perform_update(self, serializer).
        These methods should save the object instance by calling
        serializer.save(), adding in any additional arguments as required.
        They may also perform any custom pre-save or post-save behavior.
        '''
        serializer.save(
            user=self.request.user,
            inbox=self.request
        )
