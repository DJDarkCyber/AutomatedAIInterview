from rest_framework import serializers

from core.user.serializers import UserSerializer
from core.user.models import User


class RegisterSerializer(UserSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "email", "username",
                  "first_name", "last_name", "password",
                  "role"]
        
    def validate(self, data):
        required_fields = ["role"]
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            raise serializers.ValidationError({field: "This field is required." for field in missing_fields})
        
        return data
        
    def create(self, validated_data):
        role = validated_data.pop("role").upper()

        if role == User.Role.EMPLOYER:
            user = User.objects.create_employer(**validated_data)
        elif role == User.Role.MODERATOR:
            user = User.objects.create_moderator(**validated_data)
        else:
            raise serializers.ValidationError({"role": "Invalid role selected."})
        
        return user