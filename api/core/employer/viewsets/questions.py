from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.employer.models import Employer, InterviewQuestion
from core.employer.serializers.questions import InterviewQuestionSerializer

from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist


class InterviewQuestionViewSet(viewsets.ModelViewSet):
    http_method_names = ("get", "post", "patch")
    serializer_class = InterviewQuestionSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == "MODERATOR":
            return InterviewQuestion.objects.all()  # ✅ Return InterviewQuestion instead of Employer
        return InterviewQuestion.objects.filter(employer__user=user)

    def get_object(self):
        try:
            instance = InterviewQuestion.objects.get(public_id=self.kwargs["pk"])
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            raise Http404("Question details not found.")

    def perform_create(self, serializer):
        try:
            employer = Employer.objects.get(user=self.request.user)
        except Employer.DoesNotExist:
            raise Http404("Employer profile not found.")
        
        serializer.save(employer=employer)  # ✅ Fix employer assignment
