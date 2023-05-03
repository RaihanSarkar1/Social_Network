
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.post, name="create_post"),
    path("profile", views.profile, name="profile"),
    path("follow", views.follow, name="follow"),

    #API routes
    path("posts", views.posts, name="posts"),
    path("edit/<int:post_id>", views.edit, name="edit"),
    path("delete/<int:post_id>", views.delete, name="delete"),
    path("current_user", views.current_user, name="current_user"),
    path("like/<int:post_id>", views.like, name="like"),
    path("checkLike/<int:post_id>", views.checkLike, name="checkLike"),
    path("pushFollow/<str:username>", views.pushFollow, name="pushFollow"),
    path("checkFollow/<str:username>", views.checkFollow, name="checkFollow"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("username", views.get_username, name="username")


]
