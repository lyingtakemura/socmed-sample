from django.db import models
from users.models import User


class Thread(models.Model):
    THREAD_TYPE = (  # first - actual value, second - human-readable name
        ('personal', 'personal'),
        ('group', 'group')
    )
    name = models.CharField(max_length=64, blank=True, null=True)
    type = models.CharField(max_length=8, choices=THREAD_TYPE, default='personal')
    users = models.ManyToManyField(User)


class Message(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    # receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")
    body = models.CharField(max_length=255, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Message from: {}".format(
            self.sender.username)
