from django.contrib import admin

from messenger.models import Message, Room


class RoomAdmin(admin.ModelAdmin):
    fields = ("users",)


admin.site.register(Message)
admin.site.register(Room, RoomAdmin)
