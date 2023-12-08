import pytest
from users.models import User


@pytest.fixture()
def current_user_fixture():
    return User.objects.create(
        id=1,
        username="user1",
        email="user1@test.com",
    )


@pytest.fixture()
def user_to_follow_fixture():
    return User.objects.create(
        id=2,
        username="user2",
        email="user2@test.com",
    )


@pytest.fixture()
def api_client(current_user_fixture):
    from rest_framework.test import APIClient

    api_client = APIClient()
    api_client.force_authenticate(user=current_user_fixture)
    yield api_client
    api_client.force_authenticate(user=None)


@pytest.mark.django_db
def test_get_user(api_client, current_user_fixture):
    response = api_client.get("http://127.0.0.1:8000/users/")
    assert response.status_code == 200
    response_user = response.json()[0]
    assert current_user_fixture.username == response_user["username"]
    assert "following" in response_user.keys()
    assert "followers" in response_user.keys()


@pytest.mark.django_db
def test_follow_user(api_client, current_user_fixture, user_to_follow_fixture):
    follow_response = api_client.get(
        "http://127.0.0.1:8000/users/{}/follow/".format(user_to_follow_fixture.id)
    )
    assert follow_response.status_code == 200
    assert current_user_fixture in user_to_follow_fixture.followers.all()
    assert user_to_follow_fixture in current_user_fixture.following.all()


@pytest.mark.django_db
def test_unfollow_user(api_client, current_user_fixture, user_to_follow_fixture):
    current_user_fixture.following.add(user_to_follow_fixture)
    user_to_follow_fixture.followers.add(current_user_fixture)
    assert current_user_fixture in user_to_follow_fixture.followers.all()
    assert user_to_follow_fixture in current_user_fixture.following.all()

    response = api_client.get("http://127.0.0.1:8000/users/2/unfollow/")
    assert response.status_code == 200
    assert not current_user_fixture in user_to_follow_fixture.followers.all()
    assert not user_to_follow_fixture in current_user_fixture.following.all()
