# chat/routing.py
from django.urls import path

from messenger.consumers import ChatConsumer

ws_urlpatterns = [
    path('ws/test/', ChatConsumer.as_asgi())
]
