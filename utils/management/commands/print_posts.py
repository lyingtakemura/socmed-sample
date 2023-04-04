from django.core.management.base import BaseCommand
from posts.models import Post


class Command(BaseCommand):
    help = "test"

    def handle(self, *args, **options):
        for post in Post.objects.all():
            print(post.body)
