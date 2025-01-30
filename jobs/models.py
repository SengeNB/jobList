from django.db import models

class Job(models.Model):
    STATUS_CHOICES = [
        ('Submitted', 'Submitted'),
        ('Reviewed', 'Reviewed'),
        ('Rejected', 'Rejected'),
        ('To Apply', 'To Apply'),
        ('Interviewing', 'Interviewing'),
        ('Offer Received', 'Offer Received'),
        ('Withdraw', 'Withdraw'),
    ]

    company = models.CharField(max_length=255)  # 必填
    position = models.CharField(max_length=255, blank=True, null=True)  # 可选
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='To Apply')  # 默认 "To Apply"
    applications_data = models.DateField(blank=True, null=True)  # 申请日期
    pay_day = models.DateField(blank=True, null=True)  # 发薪日
    site = models.CharField(max_length=255, blank=True, null=True)  # 工作网站
    location = models.CharField(max_length=255, blank=True, null=True)  # 地点
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # 工资
    notes = models.TextField(blank=True, null=True)  # 备注信息

    def __str__(self):
        return f"{self.company} - {self.position or 'Unknown'}"
