from django.shortcuts import render, get_object_or_404, redirect
from django.utils.text import slugify
from .models import Job
from .forms import JobForm
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

def job_list(request):
    jobs = Job.objects.all()
    for job in jobs:
        job.status_class = slugify(job.status)  # 生成 CSS class
    return render(request, 'job_list.html', {'jobs': jobs})

def job_create(request):
    if request.method == "POST":
        form = JobForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('job_list')
    else:
        form = JobForm()
    return render(request, 'job_form.html', {'form': form})

def job_update(request, pk):
    job = get_object_or_404(Job, pk=pk)
    if request.method == "POST":
        form = JobForm(request.POST, instance=job)
        if form.is_valid():
            form.save()
            return redirect('job_list')
    else:
        form = JobForm(instance=job)
    return render(request, 'job_form.html', {'form': form})

def job_delete(request, pk):
    job = get_object_or_404(Job, pk=pk)
    if request.method == "POST":
        job.delete()
        return redirect('job_list')
    return render(request, 'job_confirm_delete.html', {'job': job})

@csrf_exempt
def update_status(request, job_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            new_status = data.get('status', '').strip()

            job = get_object_or_404(Job, id=job_id)
            job.status = new_status
            job.save()

            return JsonResponse({"status": "success", "new_status": job.status})
        except Exception as e:
            return JsonResponse({"status": "error", "error": str(e)}, status=500)
    return JsonResponse({"status": "error", "error": "Invalid request method"}, status=400)

@csrf_exempt
def update_notes(request, job_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            new_notes = data.get('notes', '').strip()

            job = get_object_or_404(Job, id=job_id)
            job.notes = new_notes
            job.save()

            return JsonResponse({"status": "success", "notes": job.notes})
        except Exception as e:
            return JsonResponse({"status": "error", "error": str(e)}, status=500)
    return JsonResponse({"status": "error", "error": "Invalid request method"}, status=400)