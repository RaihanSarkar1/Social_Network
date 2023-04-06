from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


# A user can have many posts
class Post(models.Model):
    #Many to one relationship
    #   A post can have one author/user
    #   A user can have many posts
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    text = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def __str__(self):
        return f"{self.id} {self.user} : {self.text}"