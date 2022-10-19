import factory
import pytest
from factories import MessageFactory, PostFactory, ThreadFactory, UserFactory
from messenger.models import Message, Thread
from messenger.serializers import MessageSerializer, ThreadSerializer
from posts.serializers import PostSerializer


class TestPostSerializer:
    """
    - build provides a local object, create instantiates a local object,
    and saves it to the database
    """

    user = UserFactory.build()

    def test_serialize_model(self):
        post = PostFactory.build()
        serializer = PostSerializer(post)

        assert serializer.data

    def test_serialized_data(self, mocker):
        valid_serialized_data = factory.build(dict, FACTORY_CLASS=PostFactory)

        serializer = PostSerializer(data=valid_serialized_data)

        assert serializer.is_valid()
        assert serializer.errors == {}


class TestMessageSerializer:
    class Meta:
        model = Message

    def test_serialize_model(self):
        message = MessageFactory.build()
        serializer = MessageSerializer(message)

        assert serializer.data

    def test_serialized_data(self, mocker):
        valid_serialized_data = factory.build(dict, FACTORY_CLASS=MessageFactory)

        serializer = MessageSerializer(data=valid_serialized_data)

        assert serializer.is_valid()
        assert serializer.errors == {}


# class TestThreadSerializer: # RecursionError
#     class Meta:
#         model = Thread

#     def test_serialize_model(self):
#         thread = ThreadFactory.build()
#         serializer = ThreadSerializer(thread)
#         assert serializer.data
