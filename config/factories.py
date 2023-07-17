import factory

from messenger.models import Message, Room
from posts.models import Post
from users.models import User
from django.contrib.auth.hashers import make_password


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("username",)

    email = factory.Sequence(lambda i: "test{}@test.com".format(i))
    username = factory.Sequence(lambda i: "test{}".format(i))
    password = make_password("0")
    is_superuser = False
    is_staff = False


class PostFactory(factory.django.DjangoModelFactory):
    """
    - when one attribute is actually a complex field (e.g a ForeignKey to
    another Model), use the SubFactory declaration
    """

    class Meta:
        model = Post

    factory.Faker._DEFAULT_LOCALE = 'la'
    user = factory.SubFactory(UserFactory)
    body = factory.Faker("paragraph", nb_sentences=3, variable_nb_sentences=False)
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
