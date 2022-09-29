from django.contrib import admin

from chat.models import Inbox, Message

admin.site.register(Inbox)
admin.site.register(Message)
