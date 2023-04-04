from django.core.management.base import BaseCommand
from utils.factories import UserFactory, PostFactory


class Command(BaseCommand):
    help = "seed db with test users and lorem ipsum posts"

    def handle(self, *args, **options):
        print("- seed users")
        users = []
        for i in range(1, 6):
            user = UserFactory()
            users.append(user)

        print("- seed posts")
        for user in users:
            PostFactory(user=user)
            PostFactory(user=user)
            PostFactory(user=user)
            PostFactory(user=user)
        print("done")
