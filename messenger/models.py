import uuid

from django.db import models

# from messenger.managers import CustomThreadManager
from users.models import User


class Room(models.Model):
    # objects = CustomThreadManager()

    # THREAD_TYPE = (  # first - actual value, second - human-readable name
    #     ("personal", "personal"),
    #     ("group", "group"),
    # )
    # type = models.CharField(max_length=8, choices=THREAD_TYPE, default="personal")
    # uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    users = models.ManyToManyField(User)

    # def __str__(self):
    #     return f"{self.type.upper()}: {self.users.all()}"


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    body = models.CharField(max_length=255, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Message from: {}".format(self.sender.username)
