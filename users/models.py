from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    When Django processes this model, it identifies that it has a
    ManyToManyField on itself, and as a result, it doesn't add a followers
    attribute to the User class. Instead, the ManyToManyField is assumed to be
    symmetrical - that is, if I am your follower, then you are my follower.

    If you do not want symmetry in many-to-many relationships with self, set
    symmetrical to False. This will force Django to add the descriptor for the
    reverse relationship, allowing ManyToManyField relationships
    to be non-symmetrical.

    blank=True - means that field is not required
    """

    following = models.ManyToManyField(
        "self", related_name="following_set", symmetrical=False, blank=True
    )
    followers = models.ManyToManyField(
        "self", related_name="followers_set", symmetrical=False, blank=True
    )
