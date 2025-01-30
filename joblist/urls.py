from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('jobs/', include('jobs.urls')),  # ✅ 确保 jobs.urls 作为 jobs 应用的路由
]
