from rest_framework import mixins, viewsets

from posts.models import Post
from posts.serializers import PostSerializer


class PostViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin
):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
