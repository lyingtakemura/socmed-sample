from django.db import models

# from messenger.managers import CustomThreadManager
from users.models import User


class Room(models.Model):
    users = models.ManyToManyField(User)


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    body = models.CharField(max_length=255, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Message from: {}".format(self.sender.username)
