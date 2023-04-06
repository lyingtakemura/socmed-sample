from rest_framework import serializers
from users.serializers import UserSerializer

from posts.models import Post


class PostSerializer(serializers.ModelSerializer):
    """
    Read-only fields are included in the API output but should not be included
    in the input during create or update operations. Any 'read_only' fields
    that are incorrectly included in the serializer input will be ignored.
    Set this to True to ensure that the field is used when serializing
    a representation, but is not used when creating or updating an instance
    during deserialization.
    """

    user = UserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = "__all__"
