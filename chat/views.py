from rest_framework import mixins, viewsets
from rest_framework.response import Response

from chat.models import Message
from chat.serializers import MessageSerializer
from users.models import User

# class InboxViewSet(
#     viewsets.GenericViewSet,
#     mixins.ListModelMixin,
#     mixins.RetrieveModelMixin
# ):
#     queryset = Inbox.objects.all()
#     serializer_class = InboxSerializer

#     def list(self, request):
#         '''
#         To serialize a queryset or list of objects instead of a single object
#         instance, you should set many=True flag when instantiating serializer.
#         '''
#         # queryset = Inbox.objects.filter(post=request.GET['inbox'])
#         queryset = Inbox.objects.all()
#         serializer = InboxSerializer(queryset, many=True)
#         return Response(serializer.data)


class MessageViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def list(self, request):
        '''
        To serialize a queryset or list of objects instead of a single object
        instance, you should set many=True flag when instantiating serializer.
        '''
        # queryset = Inbox.objects.filter(post=request.GET['inbox'])
        queryset = Message.objects.all()
        serializer = MessageSerializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        '''
        The pre_save and post_save hooks no longer exist, but are replaced with
        perform_create(self, serializer) and perform_update(self, serializer).
        These methods should save the object instance by calling
        serializer.save(), adding in any additional arguments as required.
        They may also perform any custom pre-save or post-save behavior.
        '''
        receiver = User.objects.filter(id=self.request.data['receiver']).first()
        serializer.save(
            sender=self.request.user,
            receiver=receiver
        )
