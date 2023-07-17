# import factory

# from messenger.models import Message
# from messenger.serializers import MessageSerializer
# from posts.serializers import PostSerializer
# from utils.factories import MessageFactory, PostFactory, UserFactory


# class TestPostSerializer:
#     """
#     - build provides a local object, create instantiates a local object,
#     and saves it to the database
#     """

#     user = UserFactory.build()

#     def test_serialize_model(self):
#         post = PostFactory.build()
#         serializer = PostSerializer(post)

#         assert serializer.data

#     def test_serialized_data(self, mocker):
#         valid_serialized_data = factory.build(dict, FACTORY_CLASS=PostFactory)

#         serializer = PostSerializer(data=valid_serialized_data)

#         assert serializer.is_valid()
#         assert serializer.errors == {}


# class TestMessageSerializer:
#     class Meta:
#         model = Message

#     def test_serialize_model(self):
#         message = MessageFactory.build()
#         serializer = MessageSerializer(message)

#         assert serializer.data

#     def test_serialized_data(self, mocker):
#         valid_serialized_data = factory.build(dict, FACTORY_CLASS=MessageFactory)

#         serializer = MessageSerializer(data=valid_serialized_data)

#         assert serializer.is_valid()
#         assert serializer.errors == {}
