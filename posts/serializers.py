from rest_framework import serializers

from posts.models import Comment, Post


class PostSerializer(serializers.ModelSerializer):
    '''
    Read-only fields are included in the API output but should not be included
    in the input during create or update operations. Any 'read_only' fields
    that are incorrectly included in the serializer input will be ignored.
    Set this to True to ensure that the field is used when serializing
    a representation, but is not used when creating or updating an instance
    during deserialization.
    '''
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Post
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"
