from abc import abstractmethod

from django.db import models
from users.models import User


class Room(models.Model):
    users = models.ManyToManyField(User)

    @abstractmethod
    def get_or_create_room(request):
        print(request.data.get("users"))
        room = Room.objects.filter(users__in=[request.data.get("user")]).filter(
            users__in=[request.user.id]
        )
        if room.exists():
            return room
        else:
            room = Room.objects.create()
            room.users.set([request.data.get("user"), request.user.id])


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    body = models.CharField(max_length=255, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Message from: {}".format(self.sender.username)
