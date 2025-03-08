from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.employer.models import Employer
from core.employer.serializers.employer import EmployerSerializer

from django.http import Http404

from django.core.exceptions import ObjectDoesNotExist

class EmployerViewSet(viewsets.ModelViewSet):
    http_method_names = ("get", "post", "patch")
    serializer_class = EmployerSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == "MODERATOR":
            Employer.objects.all()
        return Employer.objects.filter(user=user)
    
    def get_object(self):
        try:
            instance = Employer.objects.get(public_id=self.kwargs["pk"])
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            raise Http404("Employer Details not Found.")
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)