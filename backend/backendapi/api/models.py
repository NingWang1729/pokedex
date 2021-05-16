from django.core.validators import int_list_validator
from django.db import models
from django.contrib.auth.models import User


class UserFavorites(models.Model):
    favorites = models.CharField(validators=[int_list_validator], max_length=3600)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

