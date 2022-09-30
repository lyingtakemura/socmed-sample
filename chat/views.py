from django.db.models import Q
from rest_framework import mixins, viewsets
from rest_framework.response import Response
from users.models import User

from chat.models import Message
from chat.serializers import ContactSerializer, MessageSerializer


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

        Get receiver id from url param, filter and return in response only
        messages related to convesation between auth user and receiver

        GET /messages/?receiver=int
        '''
        sender = self.request.user
        receiver = User.objects.filter(id=request.GET['receiver']).first()

        queryset = Message.objects.filter(
            Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)
        ).order_by("created_at")
        serializer = MessageSerializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        '''
        The pre_save and post_save hooks no longer exist, but are replaced with
        perform_create(self, serializer) and perform_update(self, serializer).
        These methods should save the object instance by calling
        serializer.save(), adding in any additional arguments as required.
        They may also perform any custom pre-save or post-save behavior.

        POST /messages {"body": string, "receiver": int}
        '''
        receiver = User.objects.filter(id=self.request.data['receiver']).first()
        serializer.save(sender=self.request.user, receiver=receiver)


class ContactViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin
):
    queryset = User.objects.all()
    serializer_class = ContactSerializer
