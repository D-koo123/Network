
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('following', views.following, name= 'following'),
    path('profile/<int:poster_id>/', views.profile, name= 'profile'),

    #API routes
    path('edit/', views.edit, name= 'edit'),
    path('like/', views.like, name= 'like')
]
