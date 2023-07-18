from django.core.cache import cache
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle

from posts.models import Post
from posts.serializers import PostSerializer


class PostViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
):
    queryset = Post.objects.order_by("-created_at").select_related("user")
    serializer_class = PostSerializer
    throttle_classes = [UserRateThrottle]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["user"]

    def list(self, request, *args, **kwargs):
        if not cache.get("query_params") == request.query_params:
            cache.set("query_params", request.query_params)
            cache.delete("posts")  # delete cached posts on url filtering params change

        if "posts" in cache:
            print("CACHE_PING")
            return Response(cache.get("posts"))
        else:
            queryset = self.filter_queryset(self.get_queryset())

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            cache.set("posts", serializer.data, timeout=3600)
            return Response(serializer.data)

    def perform_create(self, serializer):
        """
        The pre_save and post_save hooks no longer exist, but are replaced with
        perform_create(self, serializer) and perform_update(self, serializer).
        These methods should save the object instance by calling
        serializer.save(), adding in any additional arguments as required.
        They may also perform any custom pre-save or post-save behavior.
        """
        cache.delete("posts")
        print("CACHE_DROP")
        serializer.save(user=self.request.user)
