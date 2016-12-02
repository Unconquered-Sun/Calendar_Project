from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from .models import events, event_file
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.generic import View
from .forms import EventForm
import datetime
# Create your views here.


class Login(View):

	def get(self, request):
		print("Login Get")
		if "id" in request.session:
			if request.session["id"] != None:
				user = User.objects.get(id=request.session["id"])
				return render(request, "calendar/main.html")
		return render(request, "calendar/login.html",{'forms':AuthenticationForm()})

	def post(self, request):
		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(username=username, password=password)
		if user:
			if user.is_active:
				request.session["id"]= user.id
				return render(request, "calendar/main.html", {"user":user.id})
		print("Test")
		return render(request, "calendar/login.html",{'forms':AuthenticationForm(request.POST)})

class CreateUser(View):

	def get(self, request):
		print("CreateUser Get")
		return render(request, "calendar/createuser.html", {"forms": UserCreationForm() })

	def post(self, request):	
		tempform = UserCreationForm(request.POST)
		print(tempform)
		if tempform.is_valid():
			print("PING")
			user = tempform.save()
			return render(request, "calendar/main.html", {'user':user.id})
		else:
			return render(request, "calendar/createuser.html", {"forms": UserCreationForm(request.POST) })
			
class Logout(View):

	def get(self, request):
		print("Logout Get")
		if "id" in request.session:
			if request.session["id"] != None:
				request.session["id"] = None
		return redirect("Login")

class CreateEvent(View):
	def get(self, request):
		print("CreateEvent Get")
		if "id" in request.session:
			if request.session["id"] != None:
				user = User.objects.get(id=request.session["id"])
				return render(request, "calendar/createevent.html", {"forms":EventForm(), "id":user.id})
		return redirect("Login")

	def post(self, request):
		if "id" in request.session:
			if request.session["id"] != None:
				current_user = User.objects.get(id=request.session["id"])
				if current_user:
					print(request.POST)
					newEvent = events(title=request.POST['name'], details=request.POST['description'], start_time=datetime.datetime.strptime(request.POST['start_time'], '%Y-%m-%d %X'), end_time=datetime.datetime.strptime(request.POST['end_time'], '%Y-%m-%d %X'), owner=current_user)
					newEvent.save()
					print(events.objects.all())
		return redirect("Login")

class GetEvent(View):
	def get(self, request):
		print("GetEvent Get")
		if "id" in request.session:
			if request.session["id"] != None:
				user = User.objects.get(id=request.session["id"])
				eventlist = events.objects.filter(owner=user)
				output = []
				for e in eventlist:

					output.append( {
						"title":e.title, 
						"details":e.details,
						"start_time":e.start_time.isoformat(" "),
						"end_time":e.end_time.isoformat(" ")
						} )
				return JsonResponse({'events':output})
		return redirect('Login')
