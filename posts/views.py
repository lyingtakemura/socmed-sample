# from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets

# from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle

from posts.models import Post
from posts.serializers import PostSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page


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

    @method_decorator(cache_page(20))
    def dispatch(self, *args, **kwargs):
        return super(PostViewSet, self).dispatch(*args, **kwargs)

    # def list(self, request):
    #     """
    #     To serialize a queryset or list of objects instead of a single object
    #     instance, you should set many=True flag when instantiating serializer.

    #     Get only posts of users which current user is following and self
    #     """
    #     queryset = Post.objects.filter(
    #         Q(user__in=self.request.user.following.all()) | Q(user=self.request.user)
    #     ).order_by("-created_at")
    #     serializer = PostSerializer(queryset, many=True)
    #     return Response(serializer.data)

    def perform_create(self, serializer):
        """
        The pre_save and post_save hooks no longer exist, but are replaced with
        perform_create(self, serializer) and perform_update(self, serializer).
        These methods should save the object instance by calling
        serializer.save(), adding in any additional arguments as required.
        They may also perform any custom pre-save or post-save behavior.
        """
        serializer.save(user=self.request.user)
