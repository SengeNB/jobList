from django.urls import path
from .views import job_list, job_create, job_update, job_delete, update_status, update_notes  # ✅ 确保导入

urlpatterns = [
    path('', job_list, name='job_list'),
    path('create/', job_create, name='job_create'),
    path('update/<int:pk>/', job_update, name='job_update'),
    path('delete/<int:pk>/', job_delete, name='job_delete'),
    path('update-status/<int:job_id>/', update_status, name='update_status'),  # ✅ 确保这个 URL 存在
    path('update-notes/<int:job_id>/', update_notes, name='update_notes'),  # ✅ 确保这个 URL 存在
]
