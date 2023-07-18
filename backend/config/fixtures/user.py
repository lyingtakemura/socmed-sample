import pytest
from users.models import User


@pytest.fixture
def user_fixture(db) -> User:
    return User.objects.create_user(
        username="test_user",
        email="test@user.com",
        first_name="Test",
        last_name="User",
        password="password",
    )
