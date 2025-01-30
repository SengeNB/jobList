from django import forms
from .models import Job

class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = '__all__'
        widgets = {
            'status': forms.Select(choices=Job.STATUS_CHOICES),  # 这里是正确的
        }
