from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('company', 'position', 'status', 'salary', 'location')
    search_fields = ('company', 'position', 'status')

