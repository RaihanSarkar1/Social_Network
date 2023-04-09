from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.BigAutoField(primary_key=True)
    # A user can follow many users and a user can be followed by many users
    following = models.ManyToManyField('self', symmetrical=False, blank=True, related_name="followers")


# A user can have many posts
class Post(models.Model):
    id = models.BigAutoField(primary_key=True)

    #Many to one relationship
    #   A user can have many posts
    #   A post can have one author/user
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    text = models.CharField(max_length=200)
    # A post can be liked by many users
    # Users can like many posts
    like = models.ManyToManyField("User", blank=True, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user,
            "text": self.text,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }