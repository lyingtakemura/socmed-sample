"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

# get_asgi_application should me imported before middleware
# for "daphne config.asgi:application" to run
django_asgi_app = get_asgi_application()

from config.middleware import TokenAuthMiddleware
from messenger.routing import ws_urlpatterns

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": TokenAuthMiddleware(URLRouter(ws_urlpatterns)),
    }
)
