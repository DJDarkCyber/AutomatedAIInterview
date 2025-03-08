from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.contrib.auth import authenticate
from core.user.serializers import UserSerializer
from rest_framework import serializers


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get("username") or attrs.get("email")
        password = attrs.get("password")

        user = authenticate(request=self.context.get("request"), username=username_or_email, password=password)

        if not user:
            user = authenticate(request=self.context.get("request"), email=username_or_email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")
        
        data = super().validate(attrs)
        refresh = self.get_token(user)

        data["user"] = UserSerializer(user).data
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, user)

        return data