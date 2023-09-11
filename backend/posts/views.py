from django.core.cache import cache
from django_filters.rest_framework import DjangoFilterBackend
from posts.models import Post
from posts.serializers import PostSerializer
from rest_framework import mixins, status, viewsets
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle


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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        cache.delete("posts")
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data["user"] = self.request.user
        self.perform_create(serializer)
        cache.delete("posts")
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
