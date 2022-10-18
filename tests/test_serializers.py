import pytest
from factories import PostFactory, UserFactory
from posts.serializers import PostSerializer


class TestPostSerializer:
    """
    - build provides a local object, create instantiates a local object,
    and saves it to the database
    """

    user = UserFactory.build()

    @pytest.mark.unit
    def test_serialize_model(self):
        post = PostFactory.build()
        serializer = PostSerializer(post)

        assert serializer.data
