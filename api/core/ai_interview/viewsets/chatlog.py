from django.http import Http404
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from core.ai_interview.models import InterviewChatLog
from core.ai_interview.serializers.chatlog import InterviewChatLogSerializer
from core.user.models import User  # Import User model if needed

class InterviewChatLogViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewChatLogSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        user = self.request.user
        specific_user_id = self.request.query_params.get("user_id")

        if user.is_superuser or user.role == "MODERATOR":
            # If an admin/mod requests chat logs of a specific user
            if specific_user_id:
                return InterviewChatLog.objects.filter(user__public_id=specific_user_id)
            return InterviewChatLog.objects.all()  # Admins/Mods can see all logs
        
        # Regular users can only access their own chat logs
        return InterviewChatLog.objects.filter(user=user)

    def get_object(self):
        """
        Fetch chat log using `public_id`
        """
        try:
            return InterviewChatLog.objects.get(public_id=self.kwargs["pk"], user=self.request.user)
        except InterviewChatLog.DoesNotExist:
            raise Http404("Chat log not found.")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
