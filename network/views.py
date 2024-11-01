import json

from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse


from .models import User, Post, Follow


def index(request):
    if request.method == 'POST':
        data = request.POST.get('post')
        user_instance = User.objects.get(id=request.user.id)
        post = Post(poster = user_instance, post=data)
        post.save()
    

    all_posts = Post.objects.all()
    return render(request, "network/index.html", {
        "posts" : all_posts
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def profile(request, poster_id):
    '''
    A function that returns the user profile
    '''
    followed_instance = User.objects.get(id=poster_id)
    follower_instance = User.objects.get(id=request.user.id)
    if request.method == 'POST':
        if request.POST.get('follow'):
            follow = Follow(followed = followed_instance, follower=follower_instance)
            follow.save()
        else:
            follow = Follow.objects.filter(followed = followed_instance, follower=follower_instance)
            follow.delete()
    
    followed = Follow.objects.filter(followed = followed_instance, follower = follower_instance).exists()
    return render(request, 'network/profile.html', {
        "poster_id" : poster_id,
        "followed": followed
    })


def following(request):
    '''
    A function that returns all posts made by people who the user is following
    '''
    return HttpResponse('Checking functioning  the following posts functions!')



