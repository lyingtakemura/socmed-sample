from rest_framework import filters, mixins, viewsets

from users.models import User
from users.serializers import UserSerializer


class UserViewSet(
    viewsets.GenericViewSet, mixins.ListModelMixin, mixins.UpdateModelMixin
):
    queryset = User.objects.prefetch_related("followers", "following")
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["username"]

    # def list(self, request):
    #     """
    #     To serialize a queryset or list of objects instead of a single object
    #     instance, you should set many=True flag when instantiating serializer.

    #     If you need to execute more complex queries (for example, queries with OR
    #     statements), you can use Q objects.
    #     """
    #     queryset = User.objects.filter(
    #         ~Q(id=self.request.user.id)
    #     )  # exclude self from response query
    #     serializer = UserSerializer(queryset, many=True)
    #     return Response(serializer.data)

    def perform_update(self, serializer):
        """
        - Remove user image PATCH /users/<int:current_user_id> {"image": ""}
        - On user image update request delete previous file
        """
        if self.request.data.get("follow"):
            User.follow(request=self.request)

        if self.request.data.get("image"):
            self.request.user.image.delete()

        serializer.save()
