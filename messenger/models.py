from django.db import models
from users.models import User


class Thread(models.Model):
    THREAD_TYPE = (  # first - actual value, second - human-readable name
        ("personal", "personal"),
        ("group", "group"),
    )
    type = models.CharField(max_length=8, choices=THREAD_TYPE, default="personal")
    users = models.ManyToManyField(User)

    def __str__(self):
        return f"{self.type.upper()}: {self.users.all()}"

    @classmethod
    def get_or_create_personal_thread(cls, users):
        user1, user2 = users
        obj = (
            Thread.objects.filter(type="personal")
            .filter(users=user1)
            .filter(users=user2)
            .exists()
        )
        if not obj and len(users) >= 2:
            qs = Thread.objects.create(type="personal")
            qs.users.set(users)


class Message(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    body = models.CharField(max_length=255, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Message from: {}".format(self.sender.username)
