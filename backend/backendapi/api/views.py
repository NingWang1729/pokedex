from rest_framework import viewsets
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer, UserFavoritesSerializer
from .models import UserFavorites


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserFavoritesViewSet(viewsets.ModelViewSet):
    # queryset = UserFavorites.objects.all()
    serializer_class = UserFavoritesSerializer

    queryset = UserFavorites.objects.all()

    def get_queryset(self):
        username = self.request.query_params.get('username')
        userquery = User.objects.all().filter(username=username).first()
        queryset = UserFavorites.objects.all().filter(user_id=userquery)
        return queryset

    def get_object(self):
        return UserFavorites.objects.all()