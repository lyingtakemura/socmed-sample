# chat/routing.py
from django.urls import path

from chat.consumers import ChatConsumer

ws_urlpatterns = [
    path('ws/test/', ChatConsumer.as_asgi())
]
