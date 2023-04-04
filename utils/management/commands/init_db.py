from django.core.management.base import BaseCommand
from posts.models import Post
from utils.factories import UserFactory


class Command(BaseCommand):
    help = "test"

    def handle(self, *args, **options):
        for i in range(0, 6):
            UserFactory()
