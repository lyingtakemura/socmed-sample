from django.contrib import admin
from users.models import User


class UserAdmin(admin.ModelAdmin):
    model = User
    search_fields = ("username",)


admin.site.register(User, UserAdmin)
