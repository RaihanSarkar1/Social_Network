from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post
from django.http import JsonResponse
import time
# To convert data into JSON
from django.core import serializers

def index(request):
    return render(request, "network/index.html",{
        "Posts": Post
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

def post(request):
    if request.method == "POST":
        user = request.user
        text = request.POST["text"]
        new_post = Post(user=user, text=text)
        new_post.save()
        #if creating post is sucessfull
        return render(request, "network/index.html")
    
# API call to see all posts
def posts(request):
    # get start and end point
    start = int(request.GET.get("start" or 0))
    end = int(request.GET.get("end") or (start + 9))
    user = str(request.GET.get("user"))


    print(user)
    if user != "null":  
        user = User.objects.get(username=user)
        user_id = user.id
        #getting the said amount of posts and converting it to JSON
        posts = list(Post.objects.filter(user_id=user_id).order_by("-created_at").values()[start:end])
    else:
        posts = list(Post.objects.order_by("-created_at").values()[start:end])

    return JsonResponse(posts, safe=False)

        

def get_username(request):
    user_id = request.GET.get("user_id")
    user = User.objects.get(id=user_id)
    username = user.username
    data = {'username': username}
    return JsonResponse(data, safe=False)

def like(request, post_id):

    post = Post.objects.get(id=post_id)
    user = request.user.id


    if post.like.filter(id=user).exists():
        post.like.remove(user)
        likeCount = post.like.count()
        data = {'message': 'disliked', 'count': likeCount}
        return JsonResponse(data, safe=False)
    else:
        post.like.add(user)
        likeCount = post.like.count()
        data = {'message': 'liked', 'count': likeCount}
        return JsonResponse(data, safe=False)
        
def checkLike(request, post_id):

    post = Post.objects.get(id=post_id)
    user = request.user.id

    likeCount = post.like.count()

    if post.like.filter(id=user).exists():
        data = {'message': 'likes', 'count': likeCount}
        return JsonResponse(data, safe=False)
    else:
        data = {'message': 'dislikes', 'count': likeCount}
        return JsonResponse(data, safe=False)
    

def profile(request, username):
    # .values() can return a list of dicts. the parameters can be the fields you want to return
    thisUser = request.user
    thatUser = User.objects.get(username=username)

    # Checking if the current user follows that user
    if thisUser.following.filter(username=username).exists():
        followed = True
    else:
        followed = False


    return render(request, "network/profile.html", {
        "User": thatUser,
        "Followed":  followed,
    })

def follow(request):
    user = request.user

    return render(request, "network/follow.html", {
        "User": user, 
    })

# Push Follow API
def pushFollow(request, username):
    user = request.user
    thisUser= User.objects.get(username=user)
    thatUsername = username
    try:
        thatUser = User.objects.get(username=thatUsername)
    except User.DoesNotExist:
        print("User matching query does not exist.", thatUsername)
    thatUserId = thatUser.id
    if thisUser.following.filter(username=thatUsername).exists():
        thisUser.following.remove(thatUserId)
        following = "false"
    else:
        thisUser.following.add(thatUserId)
        following = "true"

    data = {'Following': following, 'Username': thatUser.username }
    
    return JsonResponse(data, safe=False)

    # Check Follow API
def checkFollow(request, username):
    user = request.user
    thisUser= User.objects.get(username=user)
    thatUser = User.objects.get(username=username)
    thatUserId = thatUser.id
    if thisUser.following.filter(username=username).exists():
        following = "true"
    else:
        following = "false"

    data = {'Following': following}
    
    return JsonResponse(data, safe=False)




