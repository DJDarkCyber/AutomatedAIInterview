from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets

from core.user.serializers import UserSerializer
from core.user.models import User

from django.http import Http404


class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ("patch", "get")
    permission_classes = (AllowAny, )
    serializer_class = UserSerializer

    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.role == "MODERATOR":
            return User.objects.all()
        return User.objects.filter(username=self.request.user.username)
    
    def get_object(self):
        try:
            obj = User.objects.get_object_by_public_id(self.kwargs["pk"])
            self.check_object_permissions(self.request, obj)
            return obj
        except Http404 as e:
            raise Http404("User not found.") from e