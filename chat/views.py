from rest_framework import mixins, viewsets
from rest_framework.response import Response
from users.models import User


class ChatsViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin
):
    pass