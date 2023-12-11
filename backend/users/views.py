from rest_framework import filters, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import User
from users.serializers import UserSerializer


class UserViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = User.objects.prefetch_related("followers", "following")
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["username"]

    @action(methods=["get"], detail=True)
    def follow(self, request, pk=None):
        # GET /users/pk/follow
        current_user = request.user
        selected_user = self.get_object()

        current_user.following.add(selected_user)
        selected_user.followers.add(current_user)
        return Response(status=status.HTTP_200_OK)

    @action(methods=["get"], detail=True)
    def unfollow(self, request, pk=None):
        # GET /users/pk/unfollow
        current_user = request.user
        selected_user = self.get_object()

        current_user.following.remove(selected_user)
        selected_user.followers.remove(current_user)
        return Response(status=status.HTTP_200_OK)
