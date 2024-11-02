import json

from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post, Follow
from network.forms import PostForm


def index(request):
    
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post_instance = Post() # Create a blank instance of the Class post
            post_instance = form.save(commit=False) # Save the values to the instance but not yet to the database
            user_instance = User.objects.get(id=request.user.id) 
            post_instance.poster = user_instance # add the user details to the instance
            post_instance.save()
            return HttpResponseRedirect(reverse('index'))

    else:
        form = PostForm()
        all_posts = Post.objects.all().order_by('-posting_date') 
        p = Paginator(all_posts, 10)
        page = request.GET.get('page')  
        display_posts = p.get_page(page)
        return render(request, "network/index.html", {
            "posts" : display_posts,
            'form':form
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
    # Returns the instance of the poster
    poster_instance = User.objects.get(id=poster_id)

    # Returns the instance of the loggedin/requester_id user
    requestor_instance = User.objects.get(id=request.user.id)

    if request.method == 'POST':
        # Check if the requestor want to follow and if so add the details to the database
        if request.POST.get('follow'):
            follow = Follow(followed = poster_instance, follower=requestor_instance)
            follow.save()
        
        # Else its an unfollow request remove the follow from the database
        else:
            follow = Follow.objects.filter(followed = poster_instance, follower=requestor_instance)
            follow.delete()
    
    followed = Follow.objects.filter(followed = poster_instance, follower = requestor_instance).exists()
    no_followers = Follow.objects.filter(followed = requestor_instance).count()
    no_followed  = Follow.objects.filter(follower = requestor_instance).count()
    posts  = Post.objects.filter(poster = requestor_instance).order_by('-posting_date') 
    return render(request, 'network/profile.html', {
        "poster_id" : poster_id,
        "followed": followed,
        'no_followers': no_followers,
        'no_followed': no_followed,
        'posts': posts
    })


def following(request):
    '''
    A function that returns all posts made by people who the user is following
    '''
    # Returns the instance of the loggedin/requester_id user
    requestor_instance = User.objects.get(id=request.user.id)
    users_followed  = Follow.objects.filter(follower=requestor_instance).values_list('followed', flat=True)

    # Retrieve posts from followed users
    posts = Post.objects.filter(poster__in=users_followed).order_by('-posting_date') 
    return render(request, 'network/follow.html', {
        'posts':posts
    })


@csrf_exempt
def edit(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        post_id = data.get('id')
        post = data.get('post')
        post_instance = Post.objects.get(pk=post_id)
        post_instance.post = post
        post_instance.save()
        return JsonResponse({"Success": 'Post edited successfully!'})
        
        




        