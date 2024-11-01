from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name='poster')
    post = models.TextField()
    likes = models.IntegerField(default=0)
    posting_date = models.DateTimeField(auto_now_add=True)


class Follow(models.Model):
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followed')
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower')
    following_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'followed') 