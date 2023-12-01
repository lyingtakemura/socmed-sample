from django.urls import path
from messenger.consumers import MessengerConsumer, NotificationConsumer

ws_urlpatterns = [
    path("ws/notifications/", NotificationConsumer.as_asgi()),
    path("ws/chat/<str:id>", MessengerConsumer.as_asgi()),
]
