
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls import include, url
from django.contrib import admin
from mycalendar.views import Login, CreateUser, Logout, CreateEvent, GetEvent

urlpatterns = [
	url(r'^$', Login.as_view(), name="Login"),
	url(r'^login/$', Login.as_view(), name="Login"),
	url(r'^logout/$', Logout.as_view(), name="Logout"),
	url(r'^getevents/$', GetEvent.as_view(), name="GetEvents"),
	url(r'^createuser/$', CreateUser.as_view(), name="CreateUser"),
	url(r'^createevent/$', CreateEvent.as_view(), name="CreateEvent"),
	url(r'^index/', Login.as_view(),name="Index"),
	url(r'^.*$', Login.as_view(),name="Index"),
]