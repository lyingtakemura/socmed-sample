import pytest
from config.fixtures.user import user
from posts.models import Post


@pytest.mark.django_db
def test_create_post(user):
    post = Post.objects.create(user=user, body="Test Post Body")
    assert post.body == "Test Post Body"
    assert post.user.id == user.id
