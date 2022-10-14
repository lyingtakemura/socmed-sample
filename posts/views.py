from django.db.models import Q
from rest_framework import mixins, viewsets
from rest_framework.response import Response

from posts.models import Comment, Post
from posts.serializers import CommentSerializer, PostSerializer


class PostViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def list(self, request):
        """
        To serialize a queryset or list of objects instead of a single object
        instance, you should set many=True flag when instantiating serializer.

        Get only posts of users which current user is following and self
        """
        queryset = Post.objects.filter(
            Q(user__in=self.request.user.following.all()) | Q(user=self.request.user)
        ).order_by("-created_at")
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """
        The pre_save and post_save hooks no longer exist, but are replaced with
        perform_create(self, serializer) and perform_update(self, serializer).
        These methods should save the object instance by calling
        serializer.save(), adding in any additional arguments as required.
        They may also perform any custom pre-save or post-save behavior.
        """
        serializer.save(user=self.request.user)


class CommentViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request):
        """
        To serialize a queryset or list of objects instead of a single object
        instance, you should set many=True flag when instantiating serializer.
        """
        queryset = Comment.objects.filter(post=request.GET["post"])
        serializer = CommentSerializer(queryset, many=True)
        return Response(serializer.data)
