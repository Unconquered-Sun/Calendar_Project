from django import forms
import datetime

class EventForm(forms.Form):
	name = forms.CharField(label='Event Title', max_length=100);
	start_time = forms.DateTimeField(initial=datetime.datetime.today);
	end_time = forms.DateTimeField(initial=datetime.datetime.today);
	description = forms.CharField();