# from django.db.models import Q
from rest_framework import filters, mixins, viewsets

from users.models import User
from users.serializers import UserSerializer

# from rest_framework.response import Response


class UserViewSet(
    viewsets.GenericViewSet, mixins.ListModelMixin, mixins.UpdateModelMixin
):
    queryset = User.objects.all()
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
        print(dir(self.request))
        print(self.request.data)
        """
        The pre_save and post_save hooks no longer exist, but are replaced with
        perform_create(self, serializer) and perform_update(self, serializer).
        These methods should save the object instance by calling
        serializer.save(), adding in any additional arguments as required.
        They may also perform any custom pre-save or post-save behavior.

        - Follow/Unfollow:
        PATCH /users/<int:current_user_id> {"follow": int}

        - Remove user image:
        PATCH /users/<int:current_user_id> {"image": ""}
        """

        # Check if input combination of thread type and users already exist.
        # For personal thread also check if there's no more than 2 users.
        if self.request.data.get("follow"):
            current_user = self.request.user
            selected_user = User.objects.get(id=self.request.data.get("follow"))

            if current_user.following.filter(id=selected_user.id).exists():
                current_user.following.remove(selected_user)
                selected_user.followers.remove(current_user)
                print(current_user.following.filter(id=selected_user.id).exists())
            else:
                current_user.following.add(selected_user)
                selected_user.followers.add(current_user)

        # On user image update request delete previous file
        if self.request.data.get("image"):
            self.request.user.image.delete()

        serializer.save()
