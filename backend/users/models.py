from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField(
        "self", related_name="following_set", symmetrical=False, blank=True
    )
    followers = models.ManyToManyField(
        "self", related_name="followers_set", symmetrical=False, blank=True
    )
    image = models.ImageField(upload_to="users/", blank=True, null=True)
