from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.hashers import make_password
from core.auth.serializers import RegisterSerializer
from core.employer.models import Employer
from core.user.models import User


class RegisterViewSet(ViewSet):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        user = request.user if request.user.is_authenticated else None  # Handle AnonymousUser

        # Bypass authentication check for moderator creation
        if user is None or not (getattr(user, "is_superuser", False) or getattr(user, "role", "") == "MODERATOR"):
            if request.data.get("role") == "MODERATOR":  # Allow creating a MODERATOR role even if not logged in
                pass
            else:
                return Response(
                    {"error": "You do not have permission to create an employer account."},
                    status=status.HTTP_403_FORBIDDEN
                )

        if request.data.get("role") == "EMPLOYER":
            field_of_interview = request.data.get("field_of_interview")
            if not field_of_interview:
                return Response(
                    {"error": "field_of_interview is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)

            employer_user = User.objects.create_employer(
                username=serializer.validated_data["username"],
                email=serializer.validated_data["email"],
                password=None,
                first_name=serializer.validated_data["first_name"],
                last_name=serializer.validated_data["last_name"],
            )

            Employer.objects.create(
                user=employer_user,
                first_name=employer_user.first_name,
                last_name=employer_user.last_name,
                field_of_interview=field_of_interview,
            )

            return Response({
                "user": serializer.data,
                "password": employer_user.plain_password,
            }, status=status.HTTP_201_CREATED)

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

