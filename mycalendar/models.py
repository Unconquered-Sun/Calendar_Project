from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class events(models.Model):
	title = models.CharField(max_length=256)
	details = models.TextField()
	start_time = models.DateTimeField()
	end_time = models.DateTimeField()
	owner = models.ForeignKey(User, on_delete=models.CASCADE)

class event_file(models.Model):
	upload = models.FileField(upload_to='uploads/%Y/%m/%d/')
	user = models.ForeignKey(events,on_delete=models.CASCADE)

