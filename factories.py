import factory

from posts.models import Post
from users.models import User


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

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
