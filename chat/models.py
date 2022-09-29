from django.db import models
from users.models import User


class Inbox(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    inbox = models.ForeignKey(Inbox, on_delete=models.CASCADE)
    body = models.CharField(max_length=255, blank=False, null=False)
