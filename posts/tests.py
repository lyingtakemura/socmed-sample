import pytest

from config.fixtures.user import user_fixture
from posts.models import Post


@pytest.mark.django_db
def test_create_post(user_fixture):
    post = Post.objects.create(user=user_fixture, body="Ipsum eaque recusandae.")
    assert post.body == "Ipsum eaque recusandae."
    assert post.user.id == user_fixture.id
