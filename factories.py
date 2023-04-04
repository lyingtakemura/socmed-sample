import factory

from messenger.models import Message, Room
from posts.models import Post
from users.models import User


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker("email")
    username = "testuser"
    is_superuser = False
    is_staff = False


class PostFactory(factory.django.DjangoModelFactory):
    """
    - when one attribute is actually a complex field (e.g a ForeignKey to
    another Model), use the SubFactory declaration
    """

    class Meta:
        model = Post

    user = factory.SubFactory(UserFactory)
    body = factory.Faker("sentence")
    created_at = factory.Faker("date_time")


class RoomFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Room

    # @factory.post_generation
    # def groups(self, create, extracted, **kwargs):
    #     if not create:
    #         # Simple build, do nothing.
    #         return

    #     if extracted:
    #         # A list of users were passed in, use them
    #         for users in extracted:
    #             self.users.add(users)


RoomFactory.create()


class MessageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Message

    thread = factory.SubFactory(RoomFactory)
    sender = factory.SubFactory(UserFactory)
    body = factory.Faker("sentence")
    created_at = factory.Faker("date_time")
