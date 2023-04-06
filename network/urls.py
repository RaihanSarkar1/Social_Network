
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.post, name="create_post"),

    #API routes
    path("posts", views.posts, name="posts"),
    path("username", views.get_username, name="username")


]
