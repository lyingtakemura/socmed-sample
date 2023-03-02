from django.db import models


class CustomThreadManager(models.Manager):
    def get_or_create_personal_thread(self, users):
        user1, user2 = users
        obj = (
            self.filter(type="personal")
            .filter(users=user1)
            .filter(users=user2)
            .exists()
        )
        if not obj and len(users) >= 2:
            qs = self.create(type="personal")
            qs.users.set(users)
